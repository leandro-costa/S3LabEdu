// Filtro de turma (org) compartilhado pelas telas do professor.
// A turma selecionada fica na URL (?org=) — propagada pelas abas do tab-nav —
// e também no sessionStorage, para sobreviver a navegações sem query string.

const STORAGE_KEY = 'teacher_selected_org';

function readStored() {
  try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch (_) { return ''; }
}

function writeStored(org) {
  try {
    if (org && org !== 'all') sessionStorage.setItem(STORAGE_KEY, org);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

function replaceQuery(params) {
  const qs = params.toString();
  history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
  window.dispatchEvent(new CustomEvent('org-changed'));
}

/**
 * Turma selecionada: URL (?org=) → sessionStorage → 'all'.
 * Se `orgs` for informado, descarta turmas que não existem mais.
 * Quando o valor vem do sessionStorage, ele é gravado na URL para que
 * os links das abas o levem adiante.
 */
function getSelectedOrg(orgs) {
  const params = new URLSearchParams(window.location.search);
  let org = params.get('org') || readStored() || 'all';
  if (org !== 'all' && Array.isArray(orgs) && !orgs.some(o => o.username === org)) {
    org = 'all';
  }
  writeStored(org);
  const urlOrg = params.get('org');
  if ((org === 'all' && urlOrg) || (org !== 'all' && urlOrg !== org)) {
    if (org === 'all') params.delete('org'); else params.set('org', org);
    replaceQuery(params);
  }
  return org;
}

/** Troca a turma selecionada. Remove `task`, que pertence à turma anterior. */
function setSelectedOrg(org) {
  const params = new URLSearchParams(window.location.search);
  if (!org || org === 'all') params.delete('org'); else params.set('org', org);
  params.delete('task');
  writeStored(org);
  replaceQuery(params);
}

/** Lembra a turma sem mexer na URL (ex.: página de alunos de uma turma). */
function rememberOrg(org) {
  writeStored(org);
}

/** HTML do combo de turma, no mesmo estilo dos demais filtros. */
function orgSelectHtml({ id, orgs, selected, label = 'Turma', allowAll = true, onchange = 'orgChanged(this)' }) {
  return `
    <div class="form-group" style="min-width:200px">
      <label for="${id}">${label}</label>
      <select id="${id}" onchange="${onchange}">
        ${allowAll ? `<option value="all" ${selected === 'all' ? 'selected' : ''}>Todas as turmas</option>` : ''}
        ${orgs.map(o => `<option value="${o.username}" ${o.username === selected ? 'selected' : ''}>${o.username}</option>`).join('')}
      </select>
    </div>`;
}

export { getSelectedOrg, setSelectedOrg, rememberOrg, orgSelectHtml };
