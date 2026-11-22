class UiInline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() { return ['gap', 'align']; }

  attributeChangedCallback() { this.render(); }

  connectedCallback() { this.render(); }

  render() {
    const gap = this.getAttribute('gap') || '4px';
    const align = this.getAttribute('align') || 'center';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: flex; flex-wrap: wrap; align-items: ${align}; gap: ${gap}; }
      </style>
      <slot></slot>`;
  }
}
customElements.define('ui-inline', UiInline);
