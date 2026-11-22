class UiModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() { return ['open', 'title']; }

  attributeChangedCallback() { this.render(); }

  connectedCallback() { this.render(); }

  close() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close'));
  }

  render() {
    const open = this.hasAttribute('open');
    const title = this.getAttribute('title') || '';
    this.shadowRoot.innerHTML = `
      <style>
        .overlay { display: ${open ? 'flex' : 'none'}; position: fixed; inset: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: var(--color-surface-card, #fff); border-radius: 12px; width: 90%; max-width: 560px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 16px 48px rgba(0,0,0,0.2); }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 16px; border-bottom: 1px solid var(--color-primary-lighter, #BEE3F8); }
        .header h2 { font-size: 1.1rem; color: var(--color-primary-dark, #1A365D); margin: 0; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-secondary, #4A5568); padding: 0; line-height: 1; }
        .close-btn:hover { color: var(--color-text, #1A202C); }
        .body { padding: 20px 24px; overflow-y: auto; flex: 1; }
        .footer { display: flex; gap: 8px; justify-content: flex-end; padding: 16px 24px 20px; border-top: 1px solid var(--color-primary-lighter, #BEE3F8); }
      </style>
      <div class="overlay" onclick="if(event.target===this)this.getRootNode().host.close()">
        <div class="modal">
          <div class="header">
            <h2>${title}</h2>
            <button class="close-btn" onclick="this.getRootNode().host.close()">&times;</button>
          </div>
          <div class="body"><slot name="body"></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>`;
  }
}
customElements.define('ui-modal', UiModal);
