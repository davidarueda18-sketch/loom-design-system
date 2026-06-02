import * as styles from '../SidebarItem.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type {
  SidebarItemClickEventDetail,
  SidebarItemSelectEventDetail,
} from '../Sidebar.types.ts';

class LoomSidebarItem extends HTMLElement {
  static observedAttributes = ['item-id', 'label', 'show-icon', 'selected', 'disabled', 'href'] as const;

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

  /** Defaults to true; hide the icon slot only with `show-icon="false"`. */
  get showIcon(): boolean {
    const value = this.getAttribute('show-icon');
    return value === null || value === '' || value === 'true';
  }
  set showIcon(value: boolean) {
    this.setAttribute('show-icon', value ? 'true' : 'false');
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

  get href(): string {
    return this.getAttribute('href') ?? '';
  }
  set href(value: string) {
    if (value) this.setAttribute('href', value);
    else this.removeAttribute('href');
  }

  private _rootEl: HTMLDivElement | null = null;
  private _indicatorEl: HTMLSpanElement | null = null;
  private _boxEl: HTMLDivElement | null = null;
  private _iconWrapEl: HTMLSpanElement | null = null;
  private _iconSlot: HTMLSlotElement | null = null;
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
    this._iconSlot?.addEventListener('slotchange', this._handleIconSlotChange);
    this._sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
    this._iconSlot?.removeEventListener('slotchange', this._handleIconSlotChange);
  }

  private _build(shadow: ShadowRoot): void {
    this._rootEl = document.createElement('div');
    this._rootEl.classList.add(styles.root);
    this._rootEl.setAttribute('part', 'root');

    this._indicatorEl = document.createElement('span');
    this._indicatorEl.classList.add(styles.indicator);
    this._indicatorEl.setAttribute('part', 'indicator');
    this._indicatorEl.setAttribute('aria-hidden', 'true');

    this._boxEl = document.createElement('div');
    this._boxEl.classList.add(styles.box);
    this._boxEl.setAttribute('part', 'box');

    this._iconWrapEl = document.createElement('span');
    this._iconWrapEl.classList.add(styles.iconWrap);
    this._iconWrapEl.setAttribute('part', 'icon');
    this._iconSlot = document.createElement('slot');
    this._iconSlot.name = 'icon';
    this._iconSlot.classList.add(styles.iconSlot);
    this._iconWrapEl.appendChild(this._iconSlot);

    this._labelEl = document.createElement('span');
    this._labelEl.classList.add(styles.label);
    this._labelEl.setAttribute('part', 'label');

    this._boxEl.appendChild(this._iconWrapEl);
    this._boxEl.appendChild(this._labelEl);
    this._rootEl.appendChild(this._indicatorEl);
    this._rootEl.appendChild(this._boxEl);
    shadow.appendChild(this._rootEl);
  }

  attributeChangedCallback(name: string): void {
    if (name === 'selected' || name === 'disabled') this._syncA11y();
    this._scheduleSync();
  }

  /** Called by the parent sidebar to re-resolve ancestor state (collapsed) and roving. */
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

  private _resolveCollapsed(): boolean {
    return this.closest('loom-sidebar')?.hasAttribute('collapsed') ?? false;
  }

  private _hasAssignedIcon(): boolean {
    return this._iconSlot?.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() !== '';
      return true;
    }) ?? false;
  }

  /** A focusable, non-disabled row. */
  interactive(): boolean {
    return !this.disabled;
  }

  private _sync(): void {
    if (!this._boxEl || !this._labelEl || !this._iconWrapEl || !this._indicatorEl) return;
    const collapsed = this._resolveCollapsed();

    this._labelEl.textContent = this.label;
    this._iconWrapEl.hidden = !this.showIcon || !this._hasAssignedIcon();

    this._boxEl.classList.toggle(styles.boxSelected, this.selected);
    this._boxEl.classList.toggle(styles.boxCollapsed, collapsed);
    this._indicatorEl.classList.toggle(styles.indicatorVisible, this.selected);
    this._labelEl.hidden = collapsed;
    this._rootEl?.classList.toggle(styles.disabled, this.disabled);

    if (this.interactive() && !this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');

    this._syncA11y(collapsed);
  }

  private _syncA11y(collapsed = this._resolveCollapsed()): void {
    if (this.selected) this.setAttribute('aria-current', 'page');
    else this.removeAttribute('aria-current');
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
    // Collapsed rail hides the label → expose it as the accessible name + tooltip.
    if (collapsed && this.label) {
      this.setAttribute('aria-label', this.label);
      this.setAttribute('title', this.label);
    } else {
      this.removeAttribute('aria-label');
      this.removeAttribute('title');
    }
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

  private readonly _handleIconSlotChange = (): void => {
    this._scheduleSync();
  };

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (event.target !== this) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._activate();
    }
  };
}

customElements.define('loom-sidebar-item', LoomSidebarItem);

declare global {
  interface HTMLElementTagNameMap {
    'loom-sidebar-item': LoomSidebarItem;
  }
}

export { LoomSidebarItem };
