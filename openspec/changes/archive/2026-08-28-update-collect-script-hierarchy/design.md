## Context

`teacher/tarefas.html` generates a PowerShell script in two places: `collectForks()` (post-collection, from `successes[]`) and `generateAndCopyScript()` (re-generation, from `listForks()`). Both currently produce a flat `mkdir "coleta-..."` + `Set-Location` + `git clone --branch <tag> <url> <user>`. The spec describes it as `.bat` but the code is already PowerShell. This change restructures the output to `org/repo/coleta/aluno`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Hierarchical folder structure `org/repo/coleta-YYYY-MM-DD-HHmm/aluno` on the teacher's filesystem
- Idempotent directory creation and overwrite semantics for student folders
- DRY script generation via single helper

**Non-Goals:**
- Change tag format or collection flow
- Server-side cloning or scheduling
- Support for non-PowerShell shells (cmd .bat kept as out-of-scope)
- Sanitization beyond Gitea's `a-z0-9-` repo/org charset

## Decisions

**1. Hierarchy `org/repo/coleta` (not `coleta/org/repo`)**
- Mirrors Gitea model; professor organizes by turma/tarefa then snapshots. Alternative `coleta/org/repo` groups by time, worse for per-class grading.

**2. `mkdir -Force "<org>/<repo>/<tag>"` + `Set-Location`**
- PowerShell `mkdir -Force` is recursive and no-op if exists — satisfies "verificar/construir". Single call instead of nested `Test-Path`/`mkdir`. Alternative `Test-Path` per level is more verbose with same effect.

**3. Overwrite via `Remove-Item -Recurse -Force` before `git clone`**
- Requested behavior: sobrescrever. `git clone` fails if target exists, so pre-remove is required. Alternative `git fetch + reset` would preserve local edits but conflicts with "sobrescrever limpo".

**4. Extract `buildCollectScript(org, repo, tagName, forks)`**
- Eliminates duplication between the two generation sites. Takes `forks` as `Array<{username, clone_url}>`. Returns script string. Both call sites delegate to it.

**5. Keep PowerShell (not .bat)**
- Existing script already uses `Write-Host`/`Set-Location`. Switching to `IF NOT EXIST` + `rmdir /s /q` would be a second breaking change. Spec delta updates terminology to PowerShell.

## Risks / Trade-offs

- [Risk] Destructive overwrite deletes professor's local corrections inside student folder → Mitigation: document in spec scenario; consider adding `Write-Host "Sobrescrevendo <aluno>..."` for visibility
- [Risk] Long path (>260 chars) on Windows with deep hierarchy → Mitigation: org/repo names are short (`a-z0-9-`); note `git config core.longpaths true` if needed; not blocking
- [Risk] Breaking change for teachers who scripted around flat path → Mitigation: called out as BREAKING in proposal; no auto-migration
- [Trade-off] Single `mkdir -Force` hides which level was created → Acceptable; idempotency is the requirement

## Migration Plan

- No data migration; change is client-side script generation only
- Deploy: update `tarefas.html` and delta spec; existing tags unaffected
- Rollback: revert `tarefas.html` to flat `mkdir`

## Open Questions

- None blocking. If `org`/`repo` ever contain characters invalid for Windows paths, sanitization can be added later without spec change.
