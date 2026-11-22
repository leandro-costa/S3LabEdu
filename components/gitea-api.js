function getGiteaUrl() {
  return sessionStorage.getItem('gitea_url') || '';
}

function getBaseUrl() {
  return sessionStorage.getItem('gitea_base_url') || (getGiteaUrl() ? `${getGiteaUrl()}/api/v1` : '');
}

function getToken() {
  return sessionStorage.getItem('oauth_access_token');
}

function getDisplayUrl() {
  return (getBaseUrl() || '').replace(/\/api\/v1$/, '') || getGiteaUrl() || '';
}

function getForgejoLogoutUrl() {
  const origin = window.location.origin;
  const giteaUrl = getGiteaUrl();
  if (!giteaUrl) return '../index.html';
  return `${giteaUrl}/user/logout?redirect=${encodeURIComponent(origin + '/index.html')}`;
}

const CACHE_KEY_CLASSES = 'academic_classes';
const CACHE_KEY_TASKS = 'academic_tasks_cache';


async function requireAuth() {
  await waitForAuth();
  if (!getToken()) window.location.href = '../index.html';
}

function displayUserInfo(role) {
  const email = document.getElementById(role + '-email-display');
  const gitea = document.getElementById(role + '-gitea-display');
  const name = document.getElementById(role + '-name-display');
  if (email) email.textContent = sessionStorage.getItem(role + '_email') || '';
  if (gitea) gitea.textContent = sessionStorage.getItem(role + '_gitea_user') || '';
  if (name) name.textContent = sessionStorage.getItem(role + '_full_name') || '';
}

async function loadOwnerOrgs() {
  try {
    const orgs = await listOwnerOrganizations();
    sessionStorage.setItem(CACHE_KEY_CLASSES, JSON.stringify(orgs));
    return orgs;
  } catch (e) {
    const cached = sessionStorage.getItem(CACHE_KEY_CLASSES);
    if (cached) return JSON.parse(cached);
    throw e;
  }
}

async function getTaskReposForOrg(orgName) {
  const repos = await listOrgRepos(orgName);
  const tasks = [];
  for (const r of (repos || [])) {
    const topics = await getRepoTopics(orgName, r.name);
    if (topics.includes('type-task')) {
      const deadline = topics.find(t => t.startsWith('deadline-'));
      tasks.push({ repoOwner: orgName, repoName: r.name, name: r.name, description: r.description || '', deadline: deadline ? deadline.replace('deadline-', '') : null, questions: topics.includes('questoes-individuais'), orgName });
    }
  }
  return tasks;
}

function buildForkName(org, login, repo) {
  return `${org}-${login}-${repo}`;
}

async function createForkSafe(owner, repo, forkName) {
  try {
    return await createFork(owner, repo, forkName);
  } catch (err) {
    if (err.message && err.message.includes('already exists')) return null;
    throw err;
  }
}

function createDeliveryIssue(giteaUser, repo, deadlineDate) {
  const dueDate = deadlineDate ? deadlineDate + 'T23:59:59-03:00' : null;
  createRepoIssue(giteaUser, repo,
    'Entrega: ' + repo,
    'Issue de entrega automática.\n\nPrazo: ' + (deadlineDate || 'Sem prazo definido'),
    dueDate).catch(() => {});
}

// Aceite de tarefa (usado pelo link da tarefa e pelo painel do aluno).
// O fork criado com o token do aluno é o registro do aceite. Retorna o fork
// ou null se o aluno já tinha um fork desta tarefa.
async function acceptTask(owner, repo, giteaUser, deadlineDate) {
  const fork = await createForkSafe(owner, repo, buildForkName(owner, giteaUser, repo));
  if (fork === null) return null;
  const forkOwner = fork.owner.login;
  await enableRepoIssues(forkOwner, fork.name).catch(() => {});
  // Professores entram como colaboradores com escrita: acompanham o fork e
  // gravam a questão sorteada no README.
  const owners = await listOrgOwners(owner);
  for (const prof of owners) {
    await addRepoCollaborator(forkOwner, fork.name, prof.login, 'write').catch(() => {});
  }
  if (deadlineDate) createDeliveryIssue(forkOwner, fork.name, deadlineDate);
  return fork;
}

async function refreshToken() {
  const refresh = sessionStorage.getItem('oauth_refresh_token');
  if (!refresh) throw new Error('Sessão expirada. Faça login novamente.');

  const giteaUrl = getGiteaUrl();
  const clientId = sessionStorage.getItem('oauth_client_id');
  if (!clientId) throw new Error('Client ID OAuth não configurado.');

  const res = await fetch(giteaUrl + '/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
  });

  if (!res.ok) {
    sessionStorage.removeItem('oauth_access_token');
    sessionStorage.removeItem('oauth_refresh_token');
    sessionStorage.removeItem('oauth_token_expiry');
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  let data;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    const sp = new URLSearchParams(text);
    data = Object.fromEntries(sp);
  }

  sessionStorage.setItem('oauth_access_token', data.access_token);
  if (data.refresh_token) sessionStorage.setItem('oauth_refresh_token', data.refresh_token);
  sessionStorage.setItem('oauth_token_expiry', String(Date.now() + (data.expires_in || 3600) * 1000));
  return data.access_token;
}

async function revokeOAuthToken() {
  const giteaUrl = getGiteaUrl();
  const token = getToken();
  if (!giteaUrl || !token) return;
  await fetch(giteaUrl + '/login/oauth/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, token_type_hint: 'access_token' }),
  });
}

async function _fetch(path, options = {}) {
  let token = getToken();
  if (!token) throw new Error('Token Gitea não configurado.');

  const expiry = parseInt(sessionStorage.getItem('oauth_token_expiry'), 10);
  if (expiry && Date.now() >= expiry - 60000) {
    token = await refreshToken();
  }

  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    token = await refreshToken();
    const retryRes = await fetch(`${getBaseUrl()}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!retryRes.ok) {
      let msg = `Erro Gitea (${retryRes.status})`;
      try { const body = await retryRes.json(); if (body.message) msg = body.message; } catch (_) {}
      throw new Error(msg);
    }
    try { return await retryRes.json(); } catch (_) { return null; }
  }
  if (!res.ok) {
    let msg = `Erro Gitea (${res.status})`;
    try { const body = await res.json(); if (body.message) msg = body.message; } catch (_) {}
    throw new Error(msg);
  }
  try { return await res.json(); } catch (_) { return null; }
}

async function listOrganizations() {
  return _fetch('/user/orgs');
}

async function listOrgRepos(orgName) {
  const limit = 50;
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await _fetch(`/orgs/${encodeURIComponent(orgName)}/repos?limit=${limit}&page=${page}`) || [];
    all.push(...batch);
    if (batch.length < limit) break;
  }
  return all;
}

async function listUserRepos() {
  return _fetch('/user/repos');
}

async function createFork(owner, repo, forkName) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/forks`, {
    method: 'POST',
    body: JSON.stringify(forkName ? { name: forkName } : {}),
  });
}

async function checkFork(owner, repo, giteaUser) {
  const forks = await _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/forks`);
  return forks.find(f => f.owner && f.owner.login === giteaUser) || null;
}

async function listForks(owner, repo) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/forks`);
}

async function addRepoCollaborator(owner, repo, collaborator, permission) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/collaborators/${encodeURIComponent(collaborator)}`, {
    method: 'PUT',
    body: JSON.stringify({ permission: permission || 'read' }),
  });
}

async function listCommits(owner, repo, since) {
  const limit = 50;
  const base = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`;
  const all = [];
  for (let page = 1; ; page++) {
    const params = new URLSearchParams({ limit, page, stat: 'false', verification: 'false', files: 'false' });
    if (since) params.set('since', since);
    const batch = await _fetch(`${base}?${params}`) || [];
    all.push(...batch);
    if (batch.length < limit) break;
  }
  return all;
}

/**
 * Conta os commits feitos após `since` cujo autor é `authorLogin`
 * (por padrão, o dono do repositório — o aluno, no caso de um fork).
 * Commits de outras pessoas (ex.: commits do professor sincronizados do
 * repositório da tarefa) não contam. O autor é o usuário do Forgejo
 * associado ao e-mail do commit; commits com e-mail não vinculado a
 * nenhuma conta não são contados.
 */
async function countCommitsSince(owner, repo, since, authorLogin = owner) {
  const commits = await listCommits(owner, repo, since);
  const login = (authorLogin || '').toLowerCase();
  return commits.filter(c => {
    if ((c.author?.login || '').toLowerCase() !== login) return false;
    if (!since) return true;
    const d = c.commit?.author?.date || c.commit?.committer?.date;
    return d && new Date(d) >= new Date(since);
  }).length;
}

async function createOrganization(name, description) {
  return _fetch('/orgs', {
    method: 'POST',
    body: JSON.stringify({ username: name, description: description || '', visibility: 'private' }),
  });
}

async function listOwnerOrganizations() {
  const username = sessionStorage.getItem('teacher_gitea_user');
  if (username) {
    const orgs = await _fetch(`/users/${encodeURIComponent(username)}/orgs`);
    return orgs || [];
  }
  return _fetch('/user/orgs') || [];
}

async function getRepo(owner, repo) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}

async function getRepoTopics(owner, repo) {
  try {
    const result = await getRepo(owner, repo);
    return result?.topics || [];
  } catch (_) {
    return [];
  }
}

async function setRepoTopic(owner, repo, topic) {
  const existing = await getRepoTopics(owner, repo);
  if (existing.includes(topic)) return existing;
  const allTopics = [...existing, topic];
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/topics`, {
    method: 'PUT',
    body: JSON.stringify({ topics: allTopics }),
  });
}

async function removeRepoTopic(owner, repo, topic) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/topics/${encodeURIComponent(topic)}`, {
    method: 'DELETE',
  });
}

async function listTeamMembers(teamId) {
  return _fetch(`/teams/${encodeURIComponent(teamId)}/members`);
}

async function createOrgRepo(org, name) {
  return _fetch(`/orgs/${encodeURIComponent(org)}/repos`, {
    method: 'POST',
    body: JSON.stringify({ name, auto_init: true, private: true }),
  });
}

async function addTeamRepo(teamId, owner, repo) {
  return _fetch(`/teams/${encodeURIComponent(teamId)}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    method: 'PUT',
  });
}

// Protege a branch padrão do repositório da tarefa: só a equipe Owners (professores)
// pode fazer push. Impede que um aluno que clonou o original por engano — ou uma
// credencial de professor salva numa máquina compartilhada usada pelo entrega.bat —
// altere o modelo que é copiado para os forks.
async function protectTaskBranch(owner, repo) {
  const info = await getRepo(owner, repo);
  const branch = info?.default_branch || 'main';
  const rule = {
    enable_push: true,
    enable_push_whitelist: true,
    push_whitelist_usernames: [],
    push_whitelist_teams: ['Owners'],
    push_whitelist_deploy_keys: false,
    // Sem isso, administradores do site e do repositório ignoram a lista de push.
    apply_to_admins: true,
  };
  const base = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branch_protections`;
  try {
    return await _fetch(base, { method: 'POST', body: JSON.stringify({ rule_name: branch, ...rule }) });
  } catch (err) {
    if (!/already|exist/i.test((err && err.message) || '')) throw err;
    return _fetch(`${base}/${encodeURIComponent(branch)}`, { method: 'PATCH', body: JSON.stringify(rule) });
  }
}

async function listPullRequests(owner, repo) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?state=all`);
}

async function checkPullRequest(owner, repo, giteaUser) {
  const pulls = await listPullRequests(owner, repo);
  return pulls.find(pr => pr.head && pr.head.repo && pr.head.repo.owner && pr.head.repo.owner.login === giteaUser) || null;
}

async function findUserByEmail(email) {
  const users = await _fetch(`/users/search?q=${encodeURIComponent(email)}`);
  if (users && users.data && users.data.length > 0) {
    const u = users.data[0];
    return { login: u.login, full_name: u.full_name || '', email: u.email || '' };
  }
  return null;
}

async function listOrgTeams(orgName) {
  return _fetch(`/orgs/${encodeURIComponent(orgName)}/teams`);
}

async function listOrgOwners(orgName) {
  const cacheKey = 'org_owners_' + orgName;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch (_) {}
  }
  try {
    const members = [];
    let page = 1;
    let total = Infinity;
    while (members.length < total) {
      const res = await fetch(`${getBaseUrl()}/orgs/${encodeURIComponent(orgName)}/members?limit=50&page=${page}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      total = parseInt(res.headers.get('x-total-count') || '0', 10) || members.length + 50;
      const data = await res.json();
      if (!Array.isArray(data)) break;
      members.push(...data);
      page++;
    }
    const results = await Promise.allSettled(members.map(m =>
      fetch(`${getBaseUrl()}/users/${encodeURIComponent(m.login)}/orgs/${encodeURIComponent(orgName)}/permissions`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      }).then(r => r.ok ? r.json() : null)
    ));
    const owners = members.filter((m, i) => {
      const r = results[i];
      return r.status === 'fulfilled' && r.value && r.value.is_owner === true;
    }).map(m => ({ login: m.login, id: m.id, full_name: m.full_name, avatar_url: m.avatar_url }));
    sessionStorage.setItem(cacheKey, JSON.stringify(owners));
    return owners;
  } catch (_) {
    return [];
  }
}

async function getTeamByName(orgName, teamName) {
  const teams = await listOrgTeams(orgName);
  if (!Array.isArray(teams)) return null;
  const lowerName = teamName.toLowerCase();
  return teams.find(t => t.name && t.name.toLowerCase() === lowerName) || null;
}

async function createOrgTeam(orgName, teamName) {
  return _fetch(`/orgs/${encodeURIComponent(orgName)}/teams`, {
    method: 'POST',
    body: JSON.stringify({ name: teamName, description: 'Alunos da turma', permission: 'read', units: ['repo.code'] }),
  });
}

async function ensureAlunosTeam(orgName) {
  let team = await getTeamByName(orgName, 'alunos');
  if (!team) {
    try {
      team = await createOrgTeam(orgName, 'alunos');
      if (!team || !team.id) {
        console.warn('[ensureAlunosTeam] createOrgTeam retornou resposta sem id:', JSON.stringify(team), '— tentando fallback getTeamByName');
        team = await getTeamByName(orgName, 'alunos');
      }
    } catch (err) {
      const msg = (err && err.message) || '';
      if (!/already|exist/i.test(msg)) {
        console.error('[ensureAlunosTeam] Erro ao criar time:', err);
        throw err;
      }
      team = await getTeamByName(orgName, 'alunos');
    }
  }
  if (!team || !team.id) {
    console.error('[ensureAlunosTeam] Falha ao obter time "alunos" para', orgName, '- team retornado:', JSON.stringify(team));
    throw new Error(`Não foi possível garantir a equipe "alunos" para ${orgName}.`);
  }
  return team;
}

async function addTeamMember(teamId, username) {
  return _fetch(`/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(username)}`, {
    method: 'PUT',
  });
}

async function createRepoIssue(owner, repo, title, body, dueDate) {
  const issueBody = {
    title,
    body: body || '',
  };
  if (dueDate) {
    issueBody.due_date = dueDate;
  }
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`, {
    method: 'POST',
    body: JSON.stringify(issueBody),
  });
}

async function listRepoIssues(owner, repo, createdBy) {
  let url = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?state=all`;
  if (createdBy) url += `&created_by=${encodeURIComponent(createdBy)}`;
  const res = await _fetch(url);
  return Array.isArray(res) ? res : [];
}

async function enableRepoIssues(owner, repo) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    method: 'PATCH',
    body: JSON.stringify({ has_issues: true, has_issue_deadlines: true }),
  });
}

async function createRepoTag(owner, repo, tagName, target) {
  try {
    return await _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag_name: tagName, target: target || 'HEAD' }),
    });
  } catch (err) {
    if (err.message && err.message.includes('404')) return null;
    throw err;
  }
}

async function listRepoTags(owner, repo) {
  const res = await _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tags`);
  return Array.isArray(res) ? res : [];
}

// ── Arquivos do repositório (API de conteúdo) ──

function _contentsPath(owner, repo, path) {
  const p = String(path || '').split('/').filter(Boolean).map(encodeURIComponent).join('/');
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${p ? '/' + p : ''}`;
}

function encodeBase64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function decodeBase64Utf8(b64) {
  const bin = atob(String(b64 || '').replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function _isNotFound(err) {
  return /404|not found|does not exist|object does not exist/i.test((err && err.message) || '');
}

// Lê um arquivo de texto. Retorna { path, sha, content } ou null se não existir.
async function getRepoFile(owner, repo, path) {
  try {
    const f = await _fetch(_contentsPath(owner, repo, path));
    if (!f || Array.isArray(f) || f.type !== 'file') return null;
    return { path: f.path, sha: f.sha, content: decodeBase64Utf8(f.content) };
  } catch (err) {
    if (_isNotFound(err)) return null;
    throw err;
  }
}

// Lista um diretório. Retorna [] se não existir.
async function listRepoDir(owner, repo, path) {
  try {
    const res = await _fetch(_contentsPath(owner, repo, path));
    return Array.isArray(res) ? res : [];
  } catch (err) {
    if (_isNotFound(err)) return [];
    throw err;
  }
}

// Grava vários arquivos num único commit.
// files: [{ path, content, sha? }] — com sha atualiza, sem sha cria; { path, sha, delete: true } apaga.
async function changeRepoFiles(owner, repo, files, message) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      files: files.map(f => f.delete
        ? { operation: 'delete', path: f.path, sha: f.sha }
        : { operation: f.sha ? 'update' : 'create', path: f.path, content: encodeBase64Utf8(f.content), ...(f.sha ? { sha: f.sha } : {}) }),
    }),
  });
}

// Cria ou atualiza um único arquivo.
async function putRepoFile(owner, repo, path, content, sha, message) {
  return _fetch(_contentsPath(owner, repo, path), {
    method: sha ? 'PUT' : 'POST',
    body: JSON.stringify({ content: encodeBase64Utf8(content), message, ...(sha ? { sha } : {}) }),
  });
}

async function deleteRepo(owner, repo) {
  return _fetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    method: 'DELETE',
  });
}

async function removeOrgMember(org, username) {
  return _fetch(`/orgs/${encodeURIComponent(org)}/members/${encodeURIComponent(username)}`, {
    method: 'DELETE',
  });
}

async function isTeamMember(teamId, username) {
  try {
    await _fetch(`/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(username)}`);
    return true;
  } catch (_) {
    return false;
  }
}

// ── Sincronização entre abas via BroadcastChannel ──
const AUTH_KEYS = ['oauth_access_token','oauth_refresh_token','oauth_token_expiry','gitea_url','gitea_base_url','oauth_client_id','student_email','student_gitea_user','student_full_name','teacher_email','teacher_gitea_user','teacher_full_name'];
const authChannel = new BroadcastChannel('s3lab-auth');

let _authResolved = !!sessionStorage.getItem('oauth_access_token');
let _authResolve;
const _authPromise = new Promise((r) => { _authResolve = r; });
if (_authResolved) _authResolve(true);

authChannel.addEventListener('message', (event) => {
  if (event.data.type === 'auth-request') {
    const data = {};
    for (const key of AUTH_KEYS) { const v = sessionStorage.getItem(key); if (v) data[key] = v; }
    if (data.oauth_access_token) authChannel.postMessage({ type: 'auth-data', payload: data });
  }
  if (event.data.type === 'auth-data') {
    for (const [k, v] of Object.entries(event.data.payload)) sessionStorage.setItem(k, v);
    if (!_authResolved) { _authResolved = true; _authResolve(true); }
  }
  if (event.data.type === 'auth-clear') {
    AUTH_KEYS.forEach(k => sessionStorage.removeItem(k));
    window.location.href = '../index.html';
  }
});

if (!_authResolved) {
  authChannel.postMessage({ type: 'auth-request' });
  setTimeout(() => { if (!_authResolved) { _authResolved = true; _authResolve(false); } }, 300);
}

async function waitForAuth() { return _authPromise; }

async function logout() {
  const logoutUrl = getForgejoLogoutUrl();
  try { await revokeOAuthToken(); } catch (_) {}
  AUTH_KEYS.forEach(k => sessionStorage.removeItem(k));
  authChannel.postMessage({ type: 'auth-clear' });
  window.location.href = logoutUrl;
}

window.logout = logout;

export { getToken, getBaseUrl, getGiteaUrl, getDisplayUrl, getForgejoLogoutUrl, CACHE_KEY_CLASSES, CACHE_KEY_TASKS, requireAuth, displayUserInfo, loadOwnerOrgs, getTaskReposForOrg, buildForkName, createForkSafe, createDeliveryIssue, acceptTask, listOrganizations, listOwnerOrganizations, listOrgRepos, listUserRepos, createFork, checkFork, listForks, listCommits, countCommitsSince, createOrganization, createOrgRepo, addTeamRepo, protectTaskBranch, addRepoCollaborator, deleteRepo, findUserByEmail, listOrgTeams, listOrgOwners, getTeamByName, createOrgTeam, ensureAlunosTeam, addTeamMember, removeOrgMember, getRepo, getRepoTopics, setRepoTopic, listTeamMembers, createRepoIssue, listRepoIssues, enableRepoIssues, createRepoTag, listRepoTags, waitForAuth, removeRepoTopic, getRepoFile, listRepoDir, changeRepoFiles, putRepoFile };
