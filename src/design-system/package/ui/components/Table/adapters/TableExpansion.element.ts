import * as styles from '../Expansion.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';

class LoomTableExpansion extends HTMLElement {
  static observedAttributes = ['expanded'] as const;

  get expanded(): boolean {
    return this.hasAttribute('expanded');
  }
  set expanded(value: boolean) {
    this.toggleAttribute('expanded', value);
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;

      const inner = document.createElement('div');
      inner.classList.add(styles.inner);

      const panel = document.createElement('div');
      panel.classList.add(styles.panel);
      panel.setAttribute('part', 'panel');
      panel.appendChild(document.createElement('slot'));

      inner.appendChild(panel);
      shadow.appendChild(inner);
    }
    this.classList.add(styles.host);
    if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
    this._sync();
  }

  attributeChangedCallback(): void {
    this._syncA11y();
    this._scheduleSync();
  }

  private _syncScheduled = false;
  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  private _sync(): void {
    this.classList.toggle(styles.expanded, this.expanded);
  }

  private _syncA11y(): void {
    this.setAttribute('aria-hidden', this.expanded ? 'false' : 'true');
  }
}

customElements.define('loom-table-expansion', LoomTableExpansion);

declare global {
  interface HTMLElementTagNameMap {
    'loom-table-expansion': LoomTableExpansion;
  }
}

export { LoomTableExpansion };
