class UiForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .form-wrapper { background: var(--color-surface-card, #fff); border: 1px solid var(--color-border, var(--color-primary-lighter, #BEE3F8)); border-radius: 12px; padding: 24px; }
        ::slotted(.form-group) { margin-bottom: 16px; }
        ::slotted(.form-group:last-child) { margin-bottom: 0; }
        ::slotted(.form-actions) { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-surface, #EDF2F7); }
      </style>
      <div class="form-wrapper">
        <slot></slot>
      </div>`;
  }
}
customElements.define('ui-form', UiForm);
