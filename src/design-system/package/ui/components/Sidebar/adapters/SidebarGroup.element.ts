import * as styles from '../SidebarGroup.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { SidebarGroupToggleEventDetail } from '../Sidebar.types.ts';

let _optionsIdCounter = 0;

class LoomSidebarGroup extends HTMLElement {
  static observedAttributes = ['group-id', 'label', 'show-icon', 'selected', 'expanded', 'disabled'] as const;

  get groupId(): string {
    return this.getAttribute('group-id') ?? '';
  }
  set groupId(value: string) {
    if (value) this.setAttribute('group-id', value);
    else this.removeAttribute('group-id');
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(value: string) {
    if (value) this.setAttribute('label', value);
    else this.removeAttribute('label');
  }

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

  get expanded(): boolean {
    return this.hasAttribute('expanded');
  }
  set expanded(value: boolean) {
    this.toggleAttribute('expanded', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  private _headerEl: HTMLDivElement | null = null;
  private _indicatorEl: HTMLSpanElement | null = null;
  private _boxEl: HTMLDivElement | null = null;
  private _iconWrapEl: HTMLSpanElement | null = null;
  private _iconSlot: HTMLSlotElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _chevronEl: HTMLSpanElement | null = null;
  private _optionsEl: HTMLDivElement | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
      this._build(shadow);
    }
    this.classList.add(styles.host);
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
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
    this._headerEl = document.createElement('div');
    this._headerEl.classList.add(styles.header);
    this._headerEl.setAttribute('part', 'header');

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

    this._chevronEl = document.createElement('span');
    this._chevronEl.classList.add(styles.chevron);
    this._chevronEl.setAttribute('part', 'chevron');
    this._chevronEl.setAttribute('aria-hidden', 'true');
    const chevronSlot = document.createElement('slot');
    chevronSlot.name = 'chevron';
    chevronSlot.classList.add(styles.chevronSlot);
    this._chevronEl.appendChild(chevronSlot);

    this._boxEl.appendChild(this._iconWrapEl);
    this._boxEl.appendChild(this._labelEl);
    this._boxEl.appendChild(this._chevronEl);
    this._headerEl.appendChild(this._indicatorEl);
    this._headerEl.appendChild(this._boxEl);

    this._optionsEl = document.createElement('div');
    this._optionsEl.classList.add(styles.options);
    this._optionsEl.setAttribute('part', 'options');
    this._optionsEl.setAttribute('role', 'group');
    if (!this._optionsEl.id) this._optionsEl.id = `loom-sidebar-options-${++_optionsIdCounter}`;
    this._optionsEl.appendChild(document.createElement('slot'));

    shadow.appendChild(this._headerEl);
    shadow.appendChild(this._optionsEl);
  }

  attributeChangedCallback(name: string): void {
    if (name === 'selected' || name === 'expanded' || name === 'disabled') this._syncA11y();
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
    if (!this._boxEl || !this._labelEl || !this._iconWrapEl || !this._indicatorEl || !this._chevronEl || !this._optionsEl) {
      return;
    }
    const collapsed = this._resolveCollapsed();
    const showOptions = this.expanded && !collapsed;

    this._labelEl.textContent = this.label;
    this._iconWrapEl.hidden = !this.showIcon || !this._hasAssignedIcon();
    this._labelEl.hidden = collapsed;
    this._chevronEl.hidden = collapsed;

    this._boxEl.classList.toggle(styles.boxSelected, this.selected);
    this._boxEl.classList.toggle(styles.boxCollapsed, collapsed);
    this._indicatorEl.classList.toggle(styles.indicatorVisible, this.selected);
    this._chevronEl.classList.toggle(styles.chevronExpanded, this.expanded);
    this._optionsEl.classList.toggle(styles.optionsExpanded, showOptions);
    this.classList.toggle(styles.disabled, this.disabled);

    if (this.interactive() && !this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');

    this._syncA11y(collapsed);
  }

  private _syncA11y(collapsed = this._resolveCollapsed()): void {
    if (!collapsed) this.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');
    else this.removeAttribute('aria-expanded');
    if (this._optionsEl?.id) this.setAttribute('aria-controls', this._optionsEl.id);
    if (this.selected) this.setAttribute('aria-current', 'page');
    else this.removeAttribute('aria-current');
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
    if (collapsed && this.label) {
      this.setAttribute('aria-label', this.label);
      this.setAttribute('title', this.label);
    } else {
      this.removeAttribute('aria-label');
      this.removeAttribute('title');
    }
  }

  private _toggle(): void {
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(
      new CustomEvent<SidebarGroupToggleEventDetail>('loom-sidebar-group-toggle', {
        bubbles: true,
        composed: true,
        detail: { groupId: this.groupId, expanded: this.expanded },
      }),
    );
  }

  private readonly _handleClick = (event: MouseEvent): void => {
    // Ignore clicks coming from slotted subitems.
    const target = event.target as HTMLElement | null;
    if (target && target.closest('loom-sidebar-subitem')) return;
    this._toggle();
  };

  private readonly _handleIconSlotChange = (): void => {
    this._scheduleSync();
  };

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (event.target !== this || this.disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._toggle();
    } else if (event.key === 'ArrowRight' && !this.expanded) {
      event.preventDefault();
      this._toggle();
    } else if (event.key === 'ArrowLeft' && this.expanded) {
      event.preventDefault();
      this._toggle();
    }
  };
}

customElements.define('loom-sidebar-group', LoomSidebarGroup);

declare global {
  interface HTMLElementTagNameMap {
    'loom-sidebar-group': LoomSidebarGroup;
  }
}

export { LoomSidebarGroup };
