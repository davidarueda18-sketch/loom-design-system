import * as styles from '../SidebarSubitem.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type {
  SidebarItemClickEventDetail,
  SidebarItemSelectEventDetail,
} from '../Sidebar.types.ts';

class LoomSidebarSubitem extends HTMLElement {
  static observedAttributes = ['item-id', 'label', 'selected', 'disabled'] as const;

  get itemId(): string {
    return this.getAttribute('item-id') ?? '';
  }
  set itemId(value: string) {
    if (value) this.setAttribute('item-id', value);
    else this.removeAttribute('item-id');
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(value: string) {
    if (value) this.setAttribute('label', value);
    else this.removeAttribute('label');
  }

  get selected(): boolean {
    return this.hasAttribute('selected');
  }
  set selected(value: boolean) {
    this.toggleAttribute('selected', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  private _rootEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
      this._build(shadow);
    }
    this.classList.add(styles.host);
    if (!this.hasAttribute('role')) this.setAttribute('role', 'link');
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);
    this._sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _build(shadow: ShadowRoot): void {
    this._rootEl = document.createElement('div');
    this._rootEl.classList.add(styles.root);
    this._rootEl.setAttribute('part', 'root');

    const connector = document.createElement('span');
    connector.classList.add(styles.connector);
    connector.setAttribute('part', 'connector');
    connector.setAttribute('aria-hidden', 'true');

    this._labelEl = document.createElement('span');
    this._labelEl.classList.add(styles.label);
    this._labelEl.setAttribute('part', 'label');

    this._rootEl.appendChild(connector);
    this._rootEl.appendChild(this._labelEl);
    shadow.appendChild(this._rootEl);
  }

  attributeChangedCallback(name: string): void {
    if (name === 'selected' || name === 'disabled') this._syncA11y();
    this._scheduleSync();
  }

  /** Called by the parent to re-resolve roving/selection. */
  requestSync(): void {
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
    if (!this._rootEl || !this._labelEl) return;
    this._labelEl.textContent = this.label;
    this._rootEl.classList.toggle(styles.selected, this.selected);
    this._rootEl.classList.toggle(styles.disabled, this.disabled);
    if (this.interactive() && !this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
    this._syncA11y();
  }

  /** A focusable, non-disabled row. */
  interactive(): boolean {
    return !this.disabled;
  }

  private _syncA11y(): void {
    if (this.selected) this.setAttribute('aria-current', 'page');
    else this.removeAttribute('aria-current');
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }

  private _activate(): void {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent<SidebarItemClickEventDetail>('loom-sidebar-item-click', {
        bubbles: true,
        composed: true,
        detail: { itemId: this.itemId },
      }),
    );
    this.dispatchEvent(
      new CustomEvent<SidebarItemSelectEventDetail>('loom-sidebar-item-select', {
        bubbles: true,
        composed: true,
        detail: { itemId: this.itemId, selected: true },
      }),
    );
  }

  private readonly _handleClick = (): void => {
    this._activate();
  };

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (event.target !== this) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._activate();
    }
  };
}

customElements.define('loom-sidebar-subitem', LoomSidebarSubitem);

declare global {
  interface HTMLElementTagNameMap {
    'loom-sidebar-subitem': LoomSidebarSubitem;
  }
}

export { LoomSidebarSubitem };
