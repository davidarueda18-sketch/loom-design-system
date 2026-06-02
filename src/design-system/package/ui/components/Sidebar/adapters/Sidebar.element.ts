import * as styles from '../Sidebar.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type {
  SidebarToggleEventDetail,
  SidebarSelectEventDetail,
  SidebarItemSelectEventDetail,
} from '../Sidebar.types.ts';

const SELECTABLE_SELECTOR = 'loom-sidebar-item, loom-sidebar-group, loom-sidebar-subitem';

const DEFAULT_TOGGLE_LABEL = 'Alternar navegación';

/** Built-in collapse/expand affordance. Baked into the component so consumers never wire it. */
const TOGGLE_ICON_SVG = `
<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)">
    <path d="m.5 12.5v-10c0-1.1045695.8954305-2 2-2h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2z"></path>
    <path d="m2.5 12.5v-10c0-1.1045695.8954305-2 2-2h-2c-1 0-2 .8954305-2 2v10c0 1.1045695 1 2 2 2h2c-1.1045695 0-2-.8954305-2-2z" fill="currentColor"></path>
    <path d="m7.5 10.5-3-3 3-3"></path>
    <path d="m12.5 7.5h-8"></path>
  </g>
</svg>`.trim();

interface SidebarRow extends HTMLElement {
  interactive?: () => boolean;
  requestSync?: () => void;
}

class LoomSidebar extends HTMLElement {
  static observedAttributes = ['collapsed', 'label', 'logo-src', 'compact-logo-src', 'logo-alt', 'toggle-label'] as const;

  get collapsed(): boolean {
    return this.hasAttribute('collapsed');
  }
  set collapsed(value: boolean) {
    this.toggleAttribute('collapsed', value);
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(value: string) {
    if (value) this.setAttribute('label', value);
    else this.removeAttribute('label');
  }

  get logoSrc(): string {
    return this.getAttribute('logo-src') ?? '';
  }
  set logoSrc(value: string) {
    if (value) this.setAttribute('logo-src', value);
    else this.removeAttribute('logo-src');
  }

  get compactLogoSrc(): string {
    return this.getAttribute('compact-logo-src') ?? '';
  }
  set compactLogoSrc(value: string) {
    if (value) this.setAttribute('compact-logo-src', value);
    else this.removeAttribute('compact-logo-src');
  }

  get logoAlt(): string {
    return this.getAttribute('logo-alt') ?? '';
  }
  set logoAlt(value: string) {
    if (value) this.setAttribute('logo-alt', value);
    else this.removeAttribute('logo-alt');
  }

  /** Accessible label for the built-in collapse/expand toggle. */
  get toggleLabel(): string {
    return this.getAttribute('toggle-label') || DEFAULT_TOGGLE_LABEL;
  }
  set toggleLabel(value: string) {
    if (value) this.setAttribute('toggle-label', value);
    else this.removeAttribute('toggle-label');
  }

  private _containerEl: HTMLDivElement | null = null;
  private _headerEl: HTMLDivElement | null = null;
  private _logoEl: HTMLImageElement | null = null;
  private _toggleEl: HTMLButtonElement | null = null;
  private _dividerEl: HTMLDivElement | null = null;
  private _navEl: HTMLDivElement | null = null;
  private _footerEl: HTMLDivElement | null = null;
  private _footerSlot: HTMLSlotElement | null = null;
  private _activeIndex = 0;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
      this._build(shadow);
    }
    this.classList.add(styles.host);
    if (!this.hasAttribute('role')) this.setAttribute('role', 'navigation');

    this.addEventListener('loom-sidebar-item-select', this._handleItemSelect as EventListener);
    this.addEventListener('loom-sidebar-group-toggle', this._handleGroupToggle);
    this.addEventListener('keydown', this._handleKeydown);

    this._sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener('loom-sidebar-item-select', this._handleItemSelect as EventListener);
    this.removeEventListener('loom-sidebar-group-toggle', this._handleGroupToggle);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _build(shadow: ShadowRoot): void {
    this._containerEl = document.createElement('div');
    this._containerEl.classList.add(styles.container);

    this._headerEl = document.createElement('div');
    this._headerEl.classList.add(styles.header);
    this._headerEl.setAttribute('part', 'header');
    this._logoEl = document.createElement('img');
    this._logoEl.classList.add(styles.logo);
    this._logoEl.setAttribute('part', 'logo');
    this._logoEl.hidden = true;

    this._toggleEl = document.createElement('button');
    this._toggleEl.type = 'button';
    this._toggleEl.classList.add(styles.toggle);
    this._toggleEl.setAttribute('part', 'toggle');
    this._toggleEl.setAttribute('aria-label', this.toggleLabel);
    this._toggleEl.innerHTML = TOGGLE_ICON_SVG;
    this._toggleEl.addEventListener('click', this._handleToggleClick);

    this._headerEl.appendChild(this._logoEl);
    this._headerEl.appendChild(this._toggleEl);

    this._dividerEl = document.createElement('div');
    this._dividerEl.classList.add(styles.divider);
    this._dividerEl.setAttribute('part', 'divider');
    this._dividerEl.setAttribute('aria-hidden', 'true');

    this._navEl = document.createElement('div');
    this._navEl.classList.add(styles.nav);
    this._navEl.setAttribute('part', 'nav');
    const navSlot = document.createElement('slot');
    navSlot.addEventListener('slotchange', this._handleSlotChange);
    this._navEl.appendChild(navSlot);

    this._footerEl = document.createElement('div');
    this._footerEl.classList.add(styles.footer);
    this._footerEl.setAttribute('part', 'footer');
    this._footerSlot = document.createElement('slot');
    this._footerSlot.name = 'footer';
    this._footerSlot.addEventListener('slotchange', this._handleSlotChange);
    this._footerEl.appendChild(this._footerSlot);

    this._containerEl.appendChild(this._headerEl);
    this._containerEl.appendChild(this._dividerEl);
    this._containerEl.appendChild(this._navEl);
    this._containerEl.appendChild(this._footerEl);
    shadow.appendChild(this._containerEl);
  }

  private readonly _handleSlotChange = (): void => {
    this._scheduleSync();
  };

  attributeChangedCallback(): void {
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

  private _hasAssigned(slot: HTMLSlotElement | null): boolean {
    return !!slot && slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() !== '';
      return true;
    });
  }

  private _allRows(): SidebarRow[] {
    return Array.from(this.querySelectorAll<SidebarRow>(SELECTABLE_SELECTOR));
  }

  private _focusableRows(): SidebarRow[] {
    return this._allRows().filter((row) => {
      if (row.hasAttribute('disabled')) return false;
      // Subitems are only focusable when their group is expanded and the rail is open.
      if (row.tagName.toLowerCase() === 'loom-sidebar-subitem') {
        if (this.collapsed) return false;
        const group = row.closest('loom-sidebar-group');
        if (group && !group.hasAttribute('expanded')) return false;
      }
      return true;
    });
  }

  private _sync(): void {
    if (!this._containerEl) return;
    this.classList.toggle(styles.hostCollapsed, this.collapsed);

    const logoSrc = this.collapsed && this.compactLogoSrc ? this.compactLogoSrc : this.logoSrc;
    if (this._logoEl) {
      this._logoEl.hidden = !logoSrc;
      if (logoSrc) this._logoEl.src = logoSrc;
      else this._logoEl.removeAttribute('src');
      this._logoEl.alt = this.logoAlt;
    }

    // The built-in toggle always renders, so the header (and its divider) are always present.
    if (this._toggleEl) this._toggleEl.setAttribute('aria-label', this.toggleLabel);
    if (this._footerEl) this._footerEl.hidden = !this._hasAssigned(this._footerSlot);

    // Let children re-resolve the collapsed ancestor state.
    this._allRows().forEach((row) => row.requestSync?.());

    this._updateRoving();
    this._syncA11y();
  }

  private _syncA11y(): void {
    if (this.label) this.setAttribute('aria-label', this.label);
    else this.removeAttribute('aria-label');
  }

  private _updateRoving(): void {
    const rows = this._focusableRows();
    if (rows.length === 0) return;
    if (this._activeIndex >= rows.length) this._activeIndex = 0;
    rows.forEach((row, i) => row.setAttribute('tabindex', i === this._activeIndex ? '0' : '-1'));
  }

  private readonly _handleItemSelect = (event: CustomEvent<SidebarItemSelectEventDetail>): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Single selection: clear all, then mark the activated row (+ its parent group).
    this._allRows().forEach((row) => {
      if (row !== target) row.removeAttribute('selected');
    });
    target.setAttribute('selected', '');

    if (target.tagName.toLowerCase() === 'loom-sidebar-subitem') {
      const group = target.closest('loom-sidebar-group');
      group?.setAttribute('selected', '');
    }

    this.dispatchEvent(
      new CustomEvent<SidebarSelectEventDetail>('loom-sidebar-select', {
        bubbles: true,
        composed: true,
        detail: { id: event.detail.itemId },
      }),
    );
  };

  private readonly _handleGroupToggle = (): void => {
    // Expanding/collapsing a group changes the focusable set.
    this._scheduleSync();
  };

  /** Toggles the collapsed (rail) state and emits `loom-sidebar-toggle`. */
  toggle(): void {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(
      new CustomEvent<SidebarToggleEventDetail>('loom-sidebar-toggle', {
        bubbles: true,
        composed: true,
        detail: { collapsed: this.collapsed },
      }),
    );
  }

  private readonly _handleToggleClick = (): void => {
    this.toggle();
  };

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }
    const rows = this._focusableRows();
    if (rows.length === 0) return;

    let next: number;
    if (event.key === 'ArrowDown') next = Math.min(rows.length - 1, this._activeIndex + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, this._activeIndex - 1);
    else if (event.key === 'Home') next = 0;
    else next = rows.length - 1;

    event.preventDefault();
    this._activeIndex = next;
    this._updateRoving();
    rows[next].focus();
  };
}

customElements.define('loom-sidebar', LoomSidebar);

declare global {
  interface HTMLElementTagNameMap {
    'loom-sidebar': LoomSidebar;
  }
}

export { LoomSidebar };
