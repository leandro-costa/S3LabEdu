const BRAND_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/></svg>`;

const template = document.createElement('template');
template.innerHTML = `
  <header class="app-topbar">
    <div class="app-brand">
      <span class="app-brand-mark">${BRAND_ICON}</span>
      <span class="app-brand-name">S3Lab<span>Edu</span></span>
      <span class="app-brand-context" id="title"></span>
    </div>
    <div class="app-user">
      <div class="app-user-chip">
        <span class="app-user-text"><strong id="name-display"></strong><small id="gitea-display"></small></span>
        <span class="app-avatar" id="avatar" aria-hidden="true"></span>
      </div>
      <button id="logout-btn" class="btn btn-sm btn-secondary" type="button">Sair</button>
    </div>
  </header>
`;

function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

class PageHeader extends HTMLElement {
  connectedCallback() {
    this.appendChild(template.content.cloneNode(true));
    const role = this.getAttribute('role') || 'student';
    this.querySelector('#title').textContent = this.getAttribute('title') || '';
    const name = sessionStorage.getItem(role + '_full_name') || sessionStorage.getItem(role + '_email') || '';
    const login = sessionStorage.getItem(role + '_gitea_user') || '';
    this.querySelector('#name-display').textContent = name || login;
    this.querySelector('#gitea-display').textContent = login;
    this.querySelector('#avatar').textContent = initials(name || login);
    const btn = this.querySelector('#logout-btn');
    if (btn) btn.addEventListener('click', () => { window.logout(); });
  }
}

customElements.define('page-header', PageHeader);
