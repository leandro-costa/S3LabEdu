const ICON_CHECK = '<path d="m5 12 5 5 9-10"/>';
const ICON_CLOCK = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>';
const ICON_DASH = '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>';

// Cores diferem também em claridade (Entregue escuro, Aceita/Pendente claros) e
// cada status tem ícone próprio, para não depender só da cor.
const STATUS_MAP = {
  'entregue': { bg: 'var(--color-primary, #0F766E)', color: '#fff', label: 'Entregue', icon: ICON_CHECK },
  'aceita': { bg: 'var(--color-info-bg, #DBEAFE)', color: 'var(--color-info, #1E40AF)', label: 'Aceita, sem entrega', icon: ICON_CLOCK },
  'pendente': { bg: 'var(--color-warning-bg, #FEF3C7)', color: 'var(--color-warning, #92400E)', label: 'Pendente', icon: ICON_DASH },
  'default': { bg: 'var(--color-surface, #F3F4F6)', color: '#374151', label: 'Desconhecido', icon: '' },
};

class UiStatusBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() { return ['status', 'label']; }

  attributeChangedCallback() { this.render(); }

  connectedCallback() { this.render(); }

  render() {
    let status = (this.getAttribute('status') || 'default').toLowerCase();
    const commitMatch = status.match(/^(\d+)\s*commits?$/);
    let config;
    if (commitMatch) {
      const count = parseInt(commitMatch[1], 10);
      config = { bg: 'var(--color-surface, #F3F4F6)', color: '#374151', label: `${count} commit${count > 1 ? 's' : ''}`, icon: '' };
    } else {
      config = STATUS_MAP[status] || STATUS_MAP.default;
    }
    const label = this.getAttribute('label') || config.label;
    const icon = config.icon
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${config.icon}</svg>`
      : '';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        span { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-family: inherit; font-size: 12px; font-weight: 600; background: ${config.bg}; color: ${config.color}; white-space: nowrap; }
        svg { flex: none; }
      </style>
      <span>${icon}${label}</span>`;
  }
}
customElements.define('ui-status-badge', UiStatusBadge);
