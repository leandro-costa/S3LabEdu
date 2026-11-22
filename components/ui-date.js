class UiDate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() { return ['value', 'locale', 'format', 'fallback']; }

  attributeChangedCallback() { this.render(); }

  connectedCallback() { this.render(); }

  render() {
    const valueAttr = this.getAttribute('value');
    const locale = this.getAttribute('locale') || 'pt-BR';
    const format = this.getAttribute('format') || 'short';
    const fallback = this.getAttribute('fallback') || '-';

    if (!this.hasAttribute('value')) {
      this.shadowRoot.innerHTML = this._format(new Date(), format, locale);
      return;
    }

    if (!valueAttr || valueAttr.trim() === '') {
      this.shadowRoot.textContent = fallback;
      return;
    }

    const date = new Date(valueAttr);
    if (isNaN(date.getTime())) {
      this.shadowRoot.textContent = fallback;
      return;
    }

    this.shadowRoot.innerHTML = this._format(date, format, locale);
  }

  _format(date, format, locale) {
    switch (format) {
      case 'short':
        return new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(date);
      case 'long':
        return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
      case 'year':
        return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
      case 'relative':
        return this._formatRelative(date, locale);
      default:
        return new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(date);
    }
  }

  _formatRelative(date, locale) {
    const now = new Date();
    const diffMs = date - now;
    const absMs = Math.abs(diffMs);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (absMs < 60_000) return rtf.format(0, 'second');

    const units = [
      { name: 'minute', ms: 60_000 },
      { name: 'hour', ms: 3_600_000 },
      { name: 'day', ms: 86_400_000 },
      { name: 'week', ms: 604_800_000 },
      { name: 'month', ms: 2_592_000_000 },
      { name: 'year', ms: 31_536_000_000 },
    ];

    for (const unit of units) {
      if (absMs < unit.ms * 2) continue;
      const value = Math.round(absMs / unit.ms);
      if (value >= 2) {
        const sign = diffMs < 0 ? -value : value;
        return rtf.format(sign, unit.name);
      }
    }

    const days = Math.round(absMs / 86_400_000);
    const sign = diffMs < 0 ? -days : days;
    return rtf.format(sign || 0, 'day');
  }
}

customElements.define('ui-date', UiDate);
