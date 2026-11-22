#!/usr/bin/env bash
set -euo pipefail

TOKEN="${TOKEN:-}"
MODEL="${MODEL:-opencode/deepseek-v4-flash-free}"
API_URL="${GITHUB_API_URL:-http://forgejo:3000/api/v1}"
REPO="${GITHUB_REPOSITORY:-}"
ACTOR="${GITHUB_ACTOR:-}"
RUN_ID="${GITHUB_RUN_ID:-}"
EVENT_PATH="${GITHUB_EVENT_PATH:-}"
SERVER_URL="${GITHUB_SERVER_URL:-https://github.com}"
# External URL for links in comments (set this to the public Forgejo URL)
EXTERNAL_URL="${EXTERNAL_URL:-$SERVER_URL}"

[ -z "$TOKEN" ] && { echo "Missing TOKEN"; exit 1; }
[ -z "$REPO" ] && { echo "Missing GITHUB_REPOSITORY"; exit 1; }
[ -z "$EVENT_PATH" ] && { echo "Missing GITHUB_EVENT_PATH"; exit 1; }

now() { date -u '+%Y-%m-%dT%H:%M:%SZ'; }
log()  { echo "[$(now)] $*" >&2; }
warn() { echo "[$(now)] [WARN] $*" >&2; }
err()  { echo "[$(now)] [ERROR] $*" >&2; }

# Add npm global bin to PATH for openspec CLI
# npm bin -g is removed in npm v11+. Use npm root -g + common fallbacks.
npm_root=$(npm root -g 2>/dev/null || echo "")
if [ -n "$npm_root" ]; then
  # npm_root is typically /usr/local/lib/node_modules
  # CLI scripts live in .bin subdir, symlinks in parent's bin dir
  npm_bin_dir="${npm_root}/.bin"
  [ -d "$npm_bin_dir" ] && export PATH="${npm_bin_dir}:$PATH" && log "Added npm bin dir: $npm_bin_dir"
  npm_bin_symlinks="$(dirname "$(dirname "$npm_root")")/bin"
  [ -d "$npm_bin_symlinks" ] && export PATH="${npm_bin_symlinks}:$PATH"
fi
# Add common locations as additional fallback
for dir in /usr/local/bin /usr/local/lib/node_modules/.bin /usr/lib/node_modules/.bin; do
  [ -d "$dir" ] && export PATH="${dir}:$PATH"
done
if command -v openspec &>/dev/null; then
  log "openspec found at: $(command -v openspec)"
else
  warn "openspec CLI not found after PATH setup — openspec commands will fail"
  log "npm: $(command -v npm 2>/dev/null || echo 'not found')"
  log "npm version: $(npm --version 2>/dev/null || echo 'N/A')"
  log "npm root -g: $(npm root -g 2>/dev/null || echo 'N/A')"
  log "node: $(command -v node 2>/dev/null || echo 'not found')"
  log "PATH entries:"
  echo "$PATH" | tr ':' '\n' | while IFS= read -r p; do log "  $p"; done
  log "find /usr -name openspec: $(find /usr -name "openspec" -type f -o -name "openspec" -type l 2>/dev/null | head -5 | tr '\n' ' ')"
  log "ls /usr/local/lib/node_modules/.bin/: $(ls /usr/local/lib/node_modules/.bin/ 2>/dev/null || echo 'dir not found')"
  log "ls -la /usr/local/bin/openspec: $(ls -la /usr/local/bin/openspec 2>/dev/null || echo 'not found')"
fi

# ═══════════════════════════════════════════════
# Git Operations
# ═══════════════════════════════════════════════

git_setup() {
  git config user.name "ssslabinhoBot"
  git config user.email "ssslabinho@s3lab.dpdns.org"
}

git_fix_remote() {
  echo "Git remote URL: $(git remote get-url origin 2>/dev/null)" >&2
  git config credential.helper "!f() { echo username=x-access-token; echo password=$TOKEN; }; f" 2>/dev/null || true
}

git_create_branch() {
  local name="$1"
  local base="${2:-main}"
  if git ls-remote --exit-code origin "refs/heads/$name" >/dev/null 2>&1; then
    local hash=$(echo "$name$RANDOM" | md5sum 2>/dev/null | head -c 8 || echo "$RANDOM" | head -c 8)
    name="${name}-${hash}"
    log "Branch name collision, using: $name"
  fi
  log "Creating branch '$name' from origin/$base"
  git fetch origin "$base" 2>/dev/null
  git checkout -b "$name" "origin/$base" >/dev/null 2>&1
  echo "$name"
}

git_commit_push() {
  local message="$1"
  local branch="$2"
  local msg_max=$(echo "$message" | head -c 72)
  git add --all
  if git diff --cached --quiet; then
    log "Nothing to commit (no staged changes) on branch '$branch'"
    git status --short 2>/dev/null | head -20
    return
  fi
  log "Committing: ${msg_max} (staged: $(git diff --cached --stat --name-only | wc -l) files)"
  git commit -m "$msg_max" || warn "git commit failed (exit $?)"
  local commit_hash=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
  log "Commit hash: $commit_hash"
  log "Pushing branch '$branch'..."
  git push -u origin "$branch" || warn "Push failed. Artifacts saved locally."
}

api_create_pr() {
  local title="$1"
  local body="$2"
  local head="$3"
  local base="${4:-main}"
  log "Creating PR: '$title' (${head} -> ${base})"
  local result=$(curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg title "$title" --arg body "$body" --arg head "$head" --arg base "$base" '{title: $title, body: $body, head: $head, base: $base}')" \
    "$API_URL/repos/$REPO/pulls" 2>/tmp/pr-curl-stderr.log)
  local http_code=$(echo "$result" | jq -r '. // {}' | jq -r '.url // empty' || echo "unknown")
  log "PR API response code: $(echo "$result" | jq -r '.url // "FAIL"' 2>/dev/null)"
  echo "$result"
}

# ═══════════════════════════════════════════════
# Issue Memory
# ═══════════════════════════════════════════════

fetch_issue_comments() {
  local issue="$1"
  local max="${2:-20}"
  local raw=$(curl -sS -H "Authorization: Bearer $TOKEN" \
    "$API_URL/repos/$REPO/issues/$issue/comments" 2>/dev/null)
  local count=$(echo "$raw" | jq 'length // 0')
  log "Fetched $count comments for issue #${issue}"
  echo "$raw" | jq -r ".[-$max:] | .[] | \"\(.user.login): \(.body | gsub(\"\\n\"; \" \"))\""
}

build_prompt_with_memory() {
  local prompt_text="$1"
  local issue_number="$2"
  local issue_title="$3"
  local issue_body="$4"
  local issue_state="$5"
  local actor="$6"

  cat > /tmp/opencode-prompt.txt << PROMPT_END
Read the following data as context:
<issue>
Title: $issue_title
Body: $issue_body
Author: $actor
State: $issue_state
</issue>

<comments>
$(fetch_issue_comments "$issue_number")
</comments>

$prompt_text
PROMPT_END
}

# ═══════════════════════════════════════════════
# OpenCode Server Helpers
# ═══════════════════════════════════════════════

start_opencode_server() {
  echo "Starting opencode server..."
  opencode serve --hostname 127.0.0.1 --port 4096 &
  SERVER_PID=$!
}

run_chat_session() {
  echo "Waiting for server and running chat..."
  local script_dir="$(cd "$(dirname "$0")" && pwd)"
  node "$script_dir/opencode-chat.js" > /tmp/opencode-response.txt 2>/tmp/opencode-stderr.log || true
  if [ -s /tmp/opencode-stderr.log ]; then
    echo "=== STDERR ==="
    cat /tmp/opencode-stderr.log
    echo "=== END STDERR ==="
  fi
  local response=$(cat /tmp/opencode-response.txt)
  [ -z "$response" ] && response="⚠️ Chat script failed (see stderr above)"
  echo "$response"
}

stop_opencode_server() {
  kill $SERVER_PID 2>/dev/null || true
  wait $SERVER_PID 2>/dev/null || true
}

# Helper: executa opencode via CLI run (agente, suporta tool execution)
run_opencode_cli() {
  local prompt_text=$(cat /tmp/opencode-prompt.txt)
  log "Running opencode CLI agent (model: $MODEL, prompt: ${#prompt_text} chars)"
  local start_ts=$(date +%s)
  local result
  result=$(opencode run "$prompt_text" --auto --model "$MODEL" 2>/tmp/opencode-stderr.log)
  local exit_code=$?
  local end_ts=$(date +%s)
  local elapsed=$((end_ts - start_ts))
  log "opencode CLI finished in ${elapsed}s (exit code: ${exit_code})"
  if [ -z "$result" ]; then
    warn "opencode CLI returned no output (exit code: ${exit_code}); stderr follows:"
    cat /tmp/opencode-stderr.log >&2
    result="⚠️ opencode CLI run falhou (exit code ${exit_code}). Veja stderr completo no log da action."
  fi
  log "opencode result (${#result} chars):"
  echo "$result" | head -c 5000 >&2
  [ ${#result} -gt 5000 ] && log "... (truncated, total ${#result} chars)"
  echo "$result"
}

post_comment() {
  local body="$1"
  local preview="${body:0:200}"
  log "Posting comment (${#body} chars, preview: ${preview}...)"
  local http_code=$(curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg body "$body" '{body: $body}')" \
    "$API_URL/repos/$REPO/issues/$ISSUE_NUMBER/comments" \
    -o /dev/null -w "%{http_code}" 2>/dev/null || true)
  log "Comment posted: HTTP ${http_code}"
}

post_working_comment() {
  local working_url="$EXTERNAL_URL/$REPO/actions/runs/$RUN_ID"
  log "Workflow run URL: $working_url"
  echo "$working_url"
}

fetch_issue_data() {
  local issue="$1"
  log "Fetching issue #${issue} data"
  curl -sS -H "Authorization: Bearer $TOKEN" \
    "$API_URL/repos/$REPO/issues/$issue" 2>/dev/null || { warn "Failed to fetch issue #${issue}"; echo "{}"; }
}

# ═══════════════════════════════════════════════
# Chat Flow (existing /oc /opencode)
# ═══════════════════════════════════════════════

run_chat_flow() {
  local prompt_text="$1"

  echo "=== opencode-forgejo-wrapper (chat) ==="
  echo "Repo: $REPO | Issue: #$ISSUE_NUMBER | Prompt: ${prompt_text:0:80}"
  echo ""

  local working_url=$(post_working_comment)
  local issue_data=$(fetch_issue_data "$ISSUE_NUMBER")

  local issue_title=$(echo "$issue_data" | jq -r '.title // ""')
  local issue_body=$(echo "$issue_data" | jq -r '.body // ""')
  local issue_state=$(echo "$issue_data" | jq -r '.state // ""')

  build_prompt_with_memory "$prompt_text" "$ISSUE_NUMBER" "$issue_title" "$issue_body" "$issue_state" "$ACTOR"
  local response=$(run_opencode_cli)
  post_comment "$response"
}


# ═══════════════════════════════════════════════
# Opsx Propose Flow
# ═══════════════════════════════════════════════

run_opsx_propose() {
  local description="$1"

  echo "=== opencode-forgejo-wrapper (opsx-propose) ==="
  echo "Repo: $REPO | Issue: #$ISSUE_NUMBER | Description: ${description:0:80}"
  echo ""

  local working_url=$(post_working_comment)

  # Buscar titulo da issue para nomear a branch
  local issue_data=$(fetch_issue_data "$ISSUE_NUMBER")
  local issue_title=$(echo "$issue_data" | jq -r '.title // ""')
  local issue_body=$(echo "$issue_data" | jq -r '.body // ""')
  local issue_state=$(echo "$issue_data" | jq -r '.state // ""')

  # Derive branch name from issue TITLE (not from comment/prompt)
  local name_source="${issue_title:-$description}"
  local short_desc=$(echo "$name_source" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//' | head -c 30 | sed 's/-$//')
  [ -z "$short_desc" ] && short_desc="change"
  local change_name="${ISSUE_NUMBER}-${short_desc}"
  # openspec requires change names to start with a letter
  if echo "$change_name" | grep -q '^[0-9]'; then
    change_name="issue-${change_name}"
    log "Change name starts with digit, prefixed: $change_name"
  fi

  # Git setup
  git_setup
  git_fix_remote

  # Check if branch already exists for this issue (must use issue- prefix pattern)
  log "Looking for existing branch: opsx/issue-${ISSUE_NUMBER}-*"
  local existing_branch=$(git ls-remote origin "refs/heads/opsx/issue-${ISSUE_NUMBER}-*" 2>/dev/null | head -1 | awk '{print $2}' | sed 's|refs/heads/||')
  local branch_name=""
  local has_existing_change=false
  

  if [ -n "$existing_branch" ]; then
    branch_name="$existing_branch"
    log "Branch exists: $branch_name (reusing)"
    git fetch origin "$branch_name"
    git checkout --force "$branch_name"
  else
    log "No existing branch for issue #${ISSUE_NUMBER}, creating new one"
    local base_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||' || echo "main")
    branch_name=$(git_create_branch "opsx/${change_name}" "$base_branch")
    log "Created branch: $branch_name (from $base_branch)"
  fi

  # Change name/ dir always derive from branch name (strip opsx/ prefix)
  local change_name_actual="${branch_name#opsx/}"
  # openspec requires change names to start with a letter
  if echo "$change_name_actual" | grep -q '^[0-9]'; then
    change_name_actual="issue-${change_name_actual}"
    log "Change name starts with digit, prefixed: $change_name_actual"
  fi
  local change_dir="openspec/changes/${change_name_actual}"
  log "Change name: $change_name_actual | Change dir: $change_dir"

  # Pre-create change dir with correct name (if not already exists)
  if [ ! -d "$change_dir" ]; then
    openspec new change "${change_name_actual}" 2>/dev/null || true
    log "Pre-created change dir: $change_dir"
  fi

  local opsx_prompt="/opsx-propose atualizar change '${change_name_actual}' com: ${description}"
  log "Prompt prefix: ${opsx_prompt:0:100}..."

  # Build prompt: comando /opsx-propose primeiro (para servidor reconhecer), contexto depois
  cat > /tmp/opencode-prompt.txt << PROMPT_END
${opsx_prompt}

<context>
Issue: #${ISSUE_NUMBER}
Title: ${issue_title}
Author: ${ACTOR}
Body: ${issue_body}
</context>

<comments>
$(fetch_issue_comments "$ISSUE_NUMBER")
</comments>
PROMPT_END

  local response=$(run_opencode_cli)

  # Commit all generated artifacts
  local commit_msg="opsx: ${change_name_actual} — $([ "$has_existing_change" = true ] && echo 'atualizacao' || echo 'proposta')"
  git_commit_push "$commit_msg" "$branch_name"

  # Post response + commit summary
  local comment="## Proposta: ${change_name_actual}"$'\n'"**Branch:** ${branch_name}"$'\n'"${response}"
  post_comment "$comment"
}

# ═══════════════════════════════════════════════
# Opsx Explore Flow
# ═══════════════════════════════════════════════

run_opsx_explore() {
  local topic="$1"

  echo "=== opencode-forgejo-wrapper (opsx-explore) ==="
  echo "Repo: $REPO | Issue: #$ISSUE_NUMBER | Topic: ${topic:0:80}"
  echo ""
  log "Starting explore flow"

  local working_url=$(post_working_comment)
  local issue_data=$(fetch_issue_data "$ISSUE_NUMBER")

  local issue_title=$(echo "$issue_data" | jq -r '.title // ""')
  local issue_body=$(echo "$issue_data" | jq -r '.body // ""')
  local issue_state=$(echo "$issue_data" | jq -r '.state // ""')

  # Check if there's already a change branch for this issue
  local existing_branch=$(git ls-remote origin "refs/heads/opsx/issue-${ISSUE_NUMBER}-*" 2>/dev/null | head -1 | awk '{print $2}' | sed 's|refs/heads/||')

  local change_hint=""
  if [ -n "$existing_branch" ]; then
    change_hint="There is already an existing change branch '${existing_branch}' for this issue. If the user wants to proceed, suggest '/opsx-apply' to create a PR, or '/opsx-propose' to update the existing change."
    log "Existing branch found for explore context: $existing_branch"
  else
    change_hint="When things crystallize, offer: 'I can create a change proposal with /opsx-propose'"
  fi

  local explore_prompt="You are in explore mode — a thinking partner helping the user explore ideas, investigate problems, and clarify requirements.

The user's topic is: ${topic}

Do NOT implement anything. Instead:
- Ask clarifying questions
- Draw ASCII diagrams to visualize the problem
- Compare options and tradeoffs
- Surface risks and unknowns
- Challenge assumptions
- ${change_hint}

Use the issue context and comment history above for background."

  build_prompt_with_memory "$explore_prompt" "$ISSUE_NUMBER" "$issue_title" "$issue_body" "$issue_state" "$ACTOR"
  local response=$(run_opencode_cli)
  post_comment "$response"
}


# ═══════════════════════════════════════════════
# Opsx Apply Flow
# ═══════════════════════════════════════════════

# Helper: create PR from an existing complete change
create_pr() {
  local change_name="$1"
  local branch_name="$2"
  local issue_title="$3"

  log "Creating PR for change: $change_name"
  git_setup
  git_fix_remote
  local base_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||' || echo "main")
  git push origin "$branch_name"

  local pr_title="opsx: ${branch_name#opsx/} — ${issue_title}"
  local pr_body=$'## Resumo\n\nChange gerado a partir da issue #'"${ISSUE_NUMBER}"$'.\n\nCloses #'"${ISSUE_NUMBER}"
  local pr_response=$(api_create_pr "$pr_title" "$pr_body" "$branch_name" "$base_branch")

  local pr_url=$(echo "$pr_response" | jq -r '.html_url // .url // ""')
  local pr_number=$(echo "$pr_response" | jq -r '.number // ""')

  echo "${pr_url}|${pr_number}|${base_branch}"
}

# Manual check for change completeness (avoids openspec CLI dependency)
check_change_complete() {
  local change_dir="$1"
  if [ ! -f "${change_dir}/.openspec.yaml" ]; then
    log "Change incomplete: missing .openspec.yaml"
    echo false; return
  fi
  for artifact in proposal.md design.md tasks.md; do
    if [ ! -f "${change_dir}/${artifact}" ]; then
      log "Change incomplete: missing ${artifact}"
      echo false; return
    fi
  done
  spec_count=$(find "${change_dir}/specs" -name "*.md" 2>/dev/null | wc -l)
  if [ "$spec_count" -eq 0 ]; then
    log "Change incomplete: warning — no delta specs in specs/ (openspec CLI unavailable)"
  fi
  if grep -q '^- \[ \]' "${change_dir}/tasks.md" 2>/dev/null; then
    log "Change incomplete: unchecked tasks remain"
    echo false; return
  fi
  log "Change is complete (artifacts present, tasks done)"
  echo true
}

run_opsx_apply() {
  echo "=== opencode-forgejo-wrapper (opsx-apply) ==="
  echo "Repo: $REPO | Issue: #$ISSUE_NUMBER"
  echo ""

  local working_url=$(post_working_comment)

  # Git setup (must be before any commit/push)
  git_setup
  git_fix_remote

  # Find existing branch for this issue (must use issue- prefix pattern)
  log "Looking for existing branch: opsx/issue-${ISSUE_NUMBER}-*"
  local branch_name=$(git ls-remote origin "refs/heads/opsx/issue-${ISSUE_NUMBER}-*" 2>/dev/null | head -1 | awk '{print $2}' | sed 's|refs/heads/||')
  if [ -z "$branch_name" ]; then
    warn "No opsx branch found for issue #${ISSUE_NUMBER}"
    post_comment "❌ Nenhum branch encontrado para issue #${ISSUE_NUMBER}. Crie um change primeiro com \`/opsx-propose\`."
    return
  fi
  log "Found branch: $branch_name"

  # Fetch branch
  log "Checking out branch: $branch_name"
  git fetch origin "$branch_name"
  git checkout --force "$branch_name"

  # Change name/ dir derive from branch name (strip opsx/ prefix)
  local change_name="${branch_name#opsx/}"
  # openspec requires change names to start with a letter
  if echo "$change_name" | grep -q '^[0-9]'; then
    change_name="issue-${change_name}"
    log "Change name starts with digit, prefixed: $change_name"
  fi
  local change_dir="openspec/changes/${change_name}"
  if [ ! -d "$change_dir" ]; then
    warn "Change directory not found: $change_dir"
    post_comment "❌ Change \`${change_name}\` não encontrado em \`${change_dir}\`. Execute \`/opsx-propose\` primeiro."
    return
  fi
  log "Change name: $change_name | Change dir: $change_dir"

  local is_complete=$(check_change_complete "$change_dir")
  log "Change complete before apply: ${is_complete}"
  local issue_data=$(fetch_issue_data "$ISSUE_NUMBER")
  local issue_title=$(echo "$issue_data" | jq -r '.title // ""')
  local issue_body=$(echo "$issue_data" | jq -r '.body // ""')
  local issue_state=$(echo "$issue_data" | jq -r '.state // ""')

  if [ "$is_complete" = "true" ]; then
    log "Change already complete — suggesting archive"
    post_comment "## ✅ Change completo: ${change_name}"$'\n'"**Branch:** ${branch_name}"$'\n'"Todas as tasks foram concluidas! Use \`/opsx-archive\` para arquivar e criar o PR."
    return
  fi

  # Build prompt for opencode to implement the change (bypass /opsx-apply
  # command file, which depends on unavailable openspec CLI)
  local spec_content=$(cat "${change_dir}/specs/"*.md 2>/dev/null || echo "(no spec files found)")
  local design_content=$(cat "${change_dir}/design.md" 2>/dev/null || echo "(not found)")
  local tasks_content=$(cat "${change_dir}/tasks.md" 2>/dev/null || echo "(not found)")

  cat > /tmp/opencode-prompt.txt << PROMPT_END
You are implementing tasks for change "${change_name}" in this repository.

Read the spec, design, and tasks below. Then implement each pending task:
- Make the required code changes in the working directory (the repo root)
- After each task is done, update tasks.md by changing \`- [ ]\` to \`- [x]\`
- Do NOT run openspec commands — they are not available
- Use the file edit/write tools directly to modify files

<spec>
${spec_content}
</spec>

<design>
${design_content}
</design>

<tasks>
${tasks_content}
</tasks>

<context>
Issue: #${ISSUE_NUMBER}
Title: ${issue_title}
Author: ${ACTOR}
Body: ${issue_body}
Change: ${change_name}
Change dir: ${change_dir}
</context>

<comments>
$(fetch_issue_comments "$ISSUE_NUMBER")
</comments>
PROMPT_END

  local response=$(run_opencode_cli)
  log "Apply implementation response: ${response:0:500}"

  # Diagnostic: check what opencode actually changed on disk
  local changed_files=$(git diff --name-only 2>/dev/null || echo "")
  if [ -z "$changed_files" ]; then
    warn "opencode CLI reported completion but no files were modified on disk"
    log "git diff --name-only was empty — agent may operate in isolated workspace"
  else
    log "Files modified by opencode CLI:"
    echo "$changed_files" | while IFS= read -r f; do log "  $f"; done
  fi

  # Commit any changes made by opencode
  local commit_msg="opsx: ${change_name} — implementacao"
  git_commit_push "$commit_msg" "$branch_name"

  # Re-check completeness after implementation
  local is_complete_after=$(check_change_complete "$change_dir")
  log "Change complete after apply: ${is_complete_after}"

  local comment="## Implementacao: ${change_name}"$'\n'"**Branch:** ${branch_name}"$'\n'"${response}"

  if [ "$is_complete_after" = "true" ]; then
    comment="${comment}"$'\n\n'"✅ Todas as tasks foram concluidas! Use \`/opsx-archive\` para arquivar e criar o PR."
  elif [ -z "$changed_files" ]; then
    comment="${comment}"$'\n\n'"⚠️ opencode reportou conclusao mas nenhum arquivo foi modificado em disco. O agente pode estar operando em ambiente isolado. Tente \`/opsx-apply\` novamente ou execute manualmente."
    warn "opencode reported completion but no files changed — possible sandbox isolation"
  else
    comment="${comment}"$'\n\n'"⚠️ Ainda ha tasks pendentes. Execute \`/opsx-apply\` novamente para continuar."
  fi

  post_comment "$comment"
}

# ═══════════════════════════════════════════════
# Opsx Archive Flow
# ═══════════════════════════════════════════════

run_opsx_archive() {
  echo "=== opencode-forgejo-wrapper (opsx-archive) ==="
  echo "Repo: $REPO | Issue: #$ISSUE_NUMBER"
  echo ""

  local working_url=$(post_working_comment)

  # Git setup (must be before any commit/push)
  git_setup
  git_fix_remote

  # Find existing branch for this issue (must use issue- prefix pattern)
  log "Looking for existing branch: opsx/issue-${ISSUE_NUMBER}-*"
  local branch_name=$(git ls-remote origin "refs/heads/opsx/issue-${ISSUE_NUMBER}-*" 2>/dev/null | head -1 | awk '{print $2}' | sed 's|refs/heads/||')
  if [ -z "$branch_name" ]; then
    warn "No opsx branch found for issue #${ISSUE_NUMBER}"
    post_comment "❌ Nenhum branch encontrado para issue #${ISSUE_NUMBER}. Nada a arquivar."
    return
  fi
  log "Found branch: $branch_name"

  git fetch origin "$branch_name"
  git checkout --force "$branch_name"

  # Change name/ dir derive from branch name (strip opsx/ prefix)
  local change_name="${branch_name#opsx/}"
  # openspec requires change names to start with a letter
  if echo "$change_name" | grep -q '^[0-9]'; then
    change_name="issue-${change_name}"
    log "Change name starts with digit, prefixed: $change_name"
  fi
  local change_dir="openspec/changes/${change_name}"
  if [ ! -d "$change_dir" ]; then
    warn "Change directory not found: $change_dir"
    post_comment "❌ Change \`${change_name}\` não encontrado em \`${change_dir}\`."
    return
  fi
  log "Change name: $change_name | Change dir: $change_dir"

  # Build prompt for opencode to archive the change
  local issue_data=$(fetch_issue_data "$ISSUE_NUMBER")
  local issue_title=$(echo "$issue_data" | jq -r '.title // ""')

  cat > /tmp/opencode-prompt.txt << PROMPT_END
/opsx-archive ${change_name}

Archive this completed change. Move it from ${change_dir} to openspec/changes/archive/.

<context>
Issue: #${ISSUE_NUMBER}
Title: ${issue_title}
Change: ${change_name}
</context>

<comments>
$(fetch_issue_comments "$ISSUE_NUMBER")
</comments>
PROMPT_END

  local response=$(run_opencode_cli)

  # If opencode didn't archive, do it manually
  if [ -d "$change_dir" ]; then
    local archive_date=$(date -u '+%Y-%m-%d')
    local archive_target="openspec/changes/archive/${archive_date}-${change_name}"
    mkdir -p "$(dirname "$archive_target")"
    mv "$change_dir" "$archive_target"
    log "Manually archived change to: $archive_target"
    git_commit_push "opsx: archive ${change_name}" "$branch_name"
    response="${response}"$'\n\n'"📦 Change movido para \`${archive_target}\`"
  fi

  # Create PR after archiving
  log "Creating PR from archived change"
  local pr_info=$(create_pr "$change_name" "$branch_name" "$issue_title")
  local pr_url=$(echo "$pr_info" | cut -d'|' -f1)
  local pr_number=$(echo "$pr_info" | cut -d'|' -f2)
  local base_branch=$(echo "$pr_info" | cut -d'|' -f3)

  local comment="## 📦 Archive + PR: ${change_name}"$'\n'"**Branch:** ${branch_name}"$'\n'"${response}"$'\n'"**PR:** [#${pr_number}](${pr_url}) (${branch_name} → ${base_branch})"$'\n\nCloses #'"${ISSUE_NUMBER}"
  post_comment "$comment"
}


# ═══════════════════════════════════════════════
# Main — Command Routing
# ═══════════════════════════════════════════════

ISSUE_NUMBER=$(jq -r '.issue.number // .pull_request.number // ""' "$EVENT_PATH")
COMMENT_BODY=$(jq -r '.comment.body // .issue.body // .pull_request.body // ""' "$EVENT_PATH")

echo "=== opencode-forgejo-wrapper ==="
echo "Repo: $REPO | Issue: #$ISSUE_NUMBER | Event: $(jq -r '.action // "unknown"' "$EVENT_PATH" 2>/dev/null)"
echo ""

log "Comment body: ${COMMENT_BODY:0:200}"

# Detect command type
if echo "$COMMENT_BODY" | grep -qiE '(^|\s)/opsx-explore($|\s)'; then
  PROMPT=$(echo "$COMMENT_BODY" | sed 's/.*\/opsx-explore\s*//')
  [ -z "$PROMPT" ] && PROMPT="Explore this issue context"
  log "Matched command: /opsx-explore (prompt: ${PROMPT:0:80})"
  run_opsx_explore "$PROMPT"
elif echo "$COMMENT_BODY" | grep -qiE '(^|\s)/opsx-propose($|\s)'; then
  PROMPT=$(echo "$COMMENT_BODY" | sed 's/.*\/opsx-propose\s*//')
  log "Matched command: /opsx-propose (prompt: ${PROMPT:0:80})"
  run_opsx_propose "$PROMPT"
elif echo "$COMMENT_BODY" | grep -qiE '(^|\s)/opsx-apply($|\s)'; then
  log "Matched command: /opsx-apply"
  run_opsx_apply
elif echo "$COMMENT_BODY" | grep -qiE '(^|\s)/opsx-archive($|\s)'; then
  log "Matched command: /opsx-archive"
  run_opsx_archive
elif echo "$COMMENT_BODY" | grep -qiE '(^|\s)/(oc|opencode)($|\s)'; then
  PROMPT=$(echo "$COMMENT_BODY" | sed 's/.*\/\(oc\|opencode\)\s*//')
  [ -z "$PROMPT" ] && PROMPT="Summarize this thread"
  log "Matched command: /oc or /opencode (prompt: ${PROMPT:0:80})"
  run_chat_flow "$PROMPT"
else
  log "No command detected in comment. Exiting."
  exit 0
fi

log "Workflow complete for issue #${ISSUE_NUMBER}"
