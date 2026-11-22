// Questões individuais por tarefa.
//
// As questões ficam no próprio repositório da tarefa (o modelo dos alunos), em
// `questoes/*.md` — um arquivo por questão, o nome do arquivo é o identificador.
// O README.md do modelo tem um bloco marcado onde a questão sorteada entra:
//
//   <!-- s3lab:questao:inicio -->
//   > A sua questão será sorteada pelo professor e aparecerá aqui.
//   <!-- s3lab:questao:fim -->
//
// O sorteio é feito pelo professor: para cada fork ainda sem questão, escolhe uma
// das questões menos usadas e grava o bloco no README.md do fork (o professor é
// colaborador com escrita em todo fork). O identificador fica no próprio bloco
// (`s3lab:questao:inicio id=03`), que é o registro do sorteio — sortear de novo só
// atinge quem ainda não tem questão. Como o commit é do professor, ele não conta
// como commit do aluno no acompanhamento.

import { getRepoFile, listRepoDir, changeRepoFiles, putRepoFile, listForks, getRepo, setRepoTopic } from './gitea-api.js';

const QUESTIONS_DIR = 'questoes';
const README_PATH = 'README.md';
const QUESTIONS_TOPIC = 'questoes-individuais';

const BLOCK_RE = /<!--\s*s3lab:questao:inicio([^>]*)-->[\s\S]*?<!--\s*s3lab:questao:fim\s*-->/;
const PLACEHOLDER_BLOCK = [
  '<!-- s3lab:questao:inicio -->',
  '> A sua questão será sorteada pelo professor e aparecerá aqui.',
  '<!-- s3lab:questao:fim -->',
].join('\n');

const byNaturalName = (a, b) => a.localeCompare(b, 'pt-BR', { numeric: true });

// Lê as questões do repositório da tarefa: [{ id, path, sha, content }], ordenadas pelo nome.
async function loadTaskQuestions(owner, repo) {
  const entries = await listRepoDir(owner, repo, QUESTIONS_DIR);
  const files = entries
    .filter(e => e.type === 'file' && /\.md$/i.test(e.name))
    .sort((a, b) => byNaturalName(a.name, b.name));
  const questions = [];
  for (const e of files) {
    const f = await getRepoFile(owner, repo, e.path);
    if (f) questions.push({ id: e.name.replace(/\.md$/i, ''), path: f.path, sha: f.sha, content: f.content });
  }
  return questions;
}

function _nextFreeIds(usedIds, count) {
  const used = new Set(usedIds);
  const width = Math.max(2, String(used.size + count).length);
  const ids = [];
  for (let n = 1; ids.length < count; n++) {
    const id = String(n).padStart(width, '0');
    if (!used.has(id)) { ids.push(id); used.add(id); }
  }
  return ids;
}

/**
 * Grava as questões editadas no formulário em um único commit.
 * edited: [{ id?, content }] — `id` presente = questão que já existia no repositório.
 * Questões existentes que não vierem na lista são apagadas; as novas recebem o
 * próximo número livre (01.md, 02.md...). Garante também o bloco da questão no README.
 * Retorna o número de questões gravadas.
 */
async function saveTaskQuestions(owner, repo, edited) {
  const existing = await loadTaskQuestions(owner, repo);
  const existingById = new Map(existing.map(q => [q.id, q]));
  const keep = edited.filter(q => q.content.trim());
  const keptIds = new Set(keep.filter(q => q.id && existingById.has(q.id)).map(q => q.id));
  const newOnes = keep.filter(q => !q.id || !existingById.has(q.id));
  const newIds = _nextFreeIds(existing.map(q => q.id), newOnes.length);

  const files = [];
  for (const q of keep) {
    if (q.id && existingById.has(q.id)) {
      const old = existingById.get(q.id);
      if (old.content.trim() !== q.content.trim()) files.push({ path: old.path, sha: old.sha, content: q.content.trim() + '\n' });
    }
  }
  newOnes.forEach((q, i) => files.push({ path: `${QUESTIONS_DIR}/${newIds[i]}.md`, content: q.content.trim() + '\n' }));
  for (const old of existing) {
    if (!keptIds.has(old.id)) files.push({ path: old.path, sha: old.sha, delete: true });
  }

  const readme = await getRepoFile(owner, repo, README_PATH);
  if (!readme) {
    files.push({ path: README_PATH, content: `# ${repo}\n\n${PLACEHOLDER_BLOCK}\n` });
  } else if (!BLOCK_RE.test(readme.content)) {
    files.push({ path: README_PATH, sha: readme.sha, content: readme.content.replace(/\s*$/, '\n\n') + PLACEHOLDER_BLOCK + '\n' });
  }

  if (files.length) await changeRepoFiles(owner, repo, files, 'Questões individuais da tarefa');
  if (keep.length) await setRepoTopic(owner, repo, QUESTIONS_TOPIC);
  return keep.length;
}

// Identificador da questão já gravada no README de um fork, ou null.
function readAssignedQuestion(readmeContent) {
  const m = BLOCK_RE.exec(readmeContent || '');
  if (!m) return null;
  const id = /id=([\w.-]+)/.exec(m[1]);
  return id ? id[1] : null;
}

function applyQuestionToReadme(readmeContent, question) {
  const block = [
    `<!-- s3lab:questao:inicio id=${question.id} -->`,
    `## Sua questão (${question.id})`,
    '',
    question.content.trim(),
    '<!-- s3lab:questao:fim -->',
  ].join('\n');
  const content = readmeContent || '';
  if (BLOCK_RE.test(content)) return content.replace(BLOCK_RE, () => block);
  return (content ? content.replace(/\s*$/, '\n\n') : '') + block + '\n';
}

function _randomInt(max) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % max;
}

function _shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = _randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Sorteia questões para os forks que ainda não têm uma.
 * Cada fork sem questão recebe, ao acaso, uma das questões menos usadas — enquanto
 * houver questões sobrando, ninguém repete. Retorna
 * { questions, assignments: [{ login, forkName, questionId, status: 'existente'|'nova'|'erro', error? }], hidden }.
 */
async function distributeQuestions(owner, repo, onProgress = () => {}) {
  const questions = await loadTaskQuestions(owner, repo);
  if (!questions.length) throw new Error(`O repositório ${owner}/${repo} não tem questões em ${QUESTIONS_DIR}/.`);
  const questionById = new Map(questions.map(q => [q.id, q]));

  const forks = (await listForks(owner, repo)) || [];
  let hidden = 0;
  try { hidden = Math.max(0, ((await getRepo(owner, repo))?.forks_count ?? 0) - forks.length); } catch (_) {}

  const usage = new Map(questions.map(q => [q.id, 0]));
  const assignments = [];
  const pending = [];
  for (const [i, f] of forks.entries()) {
    const login = f.owner?.login;
    if (!login) continue;
    onProgress(`Lendo forks (${i + 1}/${forks.length})...`);
    try {
      const readme = await getRepoFile(login, f.name, README_PATH);
      const assigned = readAssignedQuestion(readme?.content);
      if (assigned) {
        if (usage.has(assigned)) usage.set(assigned, usage.get(assigned) + 1);
        assignments.push({ login, forkName: f.name, questionId: assigned, status: 'existente' });
      } else {
        pending.push({ login, forkName: f.name, readme });
      }
    } catch (err) {
      assignments.push({ login, forkName: f.name, questionId: null, status: 'erro', error: err.message });
    }
  }

  for (const [i, p] of _shuffle(pending).entries()) {
    onProgress(`Sorteando (${i + 1}/${pending.length})...`);
    const min = Math.min(...usage.values());
    const candidates = [...usage.keys()].filter(id => usage.get(id) === min);
    const question = questionById.get(candidates[_randomInt(candidates.length)]);
    try {
      const content = applyQuestionToReadme(p.readme?.content, question);
      await putRepoFile(p.login, p.forkName, README_PATH, content, p.readme?.sha, `Questão sorteada: ${question.id}`);
      usage.set(question.id, usage.get(question.id) + 1);
      assignments.push({ login: p.login, forkName: p.forkName, questionId: question.id, status: 'nova' });
    } catch (err) {
      assignments.push({ login: p.login, forkName: p.forkName, questionId: null, status: 'erro', error: err.message });
    }
  }

  assignments.sort((a, b) => byNaturalName(a.login, b.login));
  return { questions, assignments, hidden };
}

export { QUESTIONS_DIR, QUESTIONS_TOPIC, loadTaskQuestions, saveTaskQuestions, readAssignedQuestion, applyQuestionToReadme, distributeQuestions };
