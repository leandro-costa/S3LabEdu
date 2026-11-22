const ICONS = {
  dashboard: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/>',
  turmas: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>',
  tarefas: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/>',
  acompanhamento: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
};

const STUDENT_TABS = [
  { href: 'dashboard.html', label: 'Minhas tarefas', id: 'dashboard' },
];
const TEACHER_TABS = [
  { href: 'turmas.html', label: 'Turmas', id: 'turmas' },
  { href: 'tarefas.html', label: 'Tarefas', id: 'tarefas' },
  { href: 'acompanhamento.html', label: 'Acompanhamento', id: 'acompanhamento' },
];

function icon(id) {
  const paths = ICONS[id];
  if (!paths) return '';
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

class TabNav extends HTMLElement {
  connectedCallback() {
    const role = this.getAttribute('role') || 'student';
    this._active = this.getAttribute('active') || '';
    this._tabs = role === 'teacher' ? TEACHER_TABS : STUDENT_TABS;
    const nav = document.createElement('nav');
    nav.className = 'tab-nav';
    nav.setAttribute('aria-label', 'Principal');
    nav.innerHTML = this._tabs.map(t => {
      const active = t.id === this._active;
      return `<a href="${t.href}"${active ? ' class="active" aria-current="page"' : ''}>${icon(t.id)}${t.label}</a>`;
    }).join('');
    this.appendChild(nav);
    this.renderLinks();
    window.addEventListener('popstate', () => this.renderLinks());
    window.addEventListener('org-changed', () => this.renderLinks());
  }

  renderLinks() {
    const qs = window.location.search;
    const links = this.querySelectorAll('nav a');
    links.forEach((a, i) => {
      if (this._tabs[i]) {
        a.href = this._tabs[i].href + qs;
      }
    });
  }
}

customElements.define('tab-nav', TabNav);
