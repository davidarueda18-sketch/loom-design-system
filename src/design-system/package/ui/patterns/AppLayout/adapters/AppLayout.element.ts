import * as styles from '../AppLayout.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { AppLayoutDrawerToggleEventDetail } from '../AppLayout.types.ts';

// ─── LoomAppLayout ────────────────────────────────────────────────────────────
// Structural app-shell pattern. Composes a `loom-sidebar` (slot="sidebar") and a
// `loom-navbar` (slot="navbar") around a scrollable content region (default slot).
// On desktop the content reflows automatically as the slotted sidebar reserves and
// animates its own width. When `responsive` is set, below `mobile-breakpoint` the
// sidebar becomes an off-canvas drawer driven by the built-in hamburger.

const HAMBURGER_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
  '</svg>';

/** Minimal structural view of the slotted sidebar — avoids coupling to its module. */
interface CollapsibleSidebar extends HTMLElement {
  toggle?: () => void;
  collapsed?: boolean;
}

class LoomAppLayout extends HTMLElement {
  static observedAttributes = ['responsive', 'mobile-breakpoint', 'menu-button'] as const;

  // ─── Getters / Setters ──────────────────────────────────────────────────────

  get responsive(): boolean {
    return this.hasAttribute('responsive');
  }
  set responsive(value: boolean) {
    this.toggleAttribute('responsive', value);
  }

  get mobileBreakpoint(): string {
    return this.getAttribute('mobile-breakpoint') ?? '768px';
  }
  set mobileBreakpoint(value: string) {
    if (value) this.setAttribute('mobile-breakpoint', value);
    else this.removeAttribute('mobile-breakpoint');
  }

  get menuButton(): string {
    return this.getAttribute('menu-button') ?? 'auto';
  }
  set menuButton(value: string) {
    if (value) this.setAttribute('menu-button', value);
    else this.removeAttribute('menu-button');
  }

  // ─── Shadow DOM elements ──────────────────────────────────────────────────────

  private _menuToggleEl: HTMLButtonElement | null = null;
  private _scrimEl:      HTMLDivElement | null = null;

  // ─── State ────────────────────────────────────────────────────────────────────

  private _isMobile = false;
  private _drawerOpen = false;
  private _mql: MediaQueryList | null = null;

  // ─── Lifecycle ──────────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-app-layout] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      // ── Sidebar dock (left column / off-canvas drawer) ──────────────────────────
      const dock = document.createElement('div');
      dock.classList.add(styles.sidebarDock);
      dock.setAttribute('part', 'sidebar-dock');
      const sidebarSlot = document.createElement('slot');
      sidebarSlot.name = 'sidebar';
      dock.appendChild(sidebarSlot);

      // ── Scrim (mobile backdrop) ─────────────────────────────────────────────────
      this._scrimEl = document.createElement('div');
      this._scrimEl.classList.add(styles.scrim);
      this._scrimEl.setAttribute('part', 'scrim');
      this._scrimEl.setAttribute('aria-hidden', 'true');
      this._scrimEl.addEventListener('click', this._handleScrimClick);

      // ── Main column ──────────────────────────────────────────────────────────────
      const main = document.createElement('div');
      main.classList.add(styles.main);
      main.setAttribute('part', 'main');

      const topbar = document.createElement('div');
      topbar.classList.add(styles.topbar);
      topbar.setAttribute('part', 'topbar');

      this._menuToggleEl = document.createElement('button');
      this._menuToggleEl.type = 'button';
      this._menuToggleEl.classList.add(styles.menuToggle);
      this._menuToggleEl.setAttribute('part', 'menu-toggle');
      this._menuToggleEl.setAttribute('aria-label', 'Alternar navegación');
      this._menuToggleEl.innerHTML = HAMBURGER_SVG;
      this._menuToggleEl.addEventListener('click', this._handleMenuClick);

      const navbarSlot = document.createElement('slot');
      navbarSlot.name = 'navbar';

      topbar.appendChild(this._menuToggleEl);
      topbar.appendChild(navbarSlot);

      const content = document.createElement('div');
      content.classList.add(styles.content);
      content.setAttribute('part', 'content');
      content.appendChild(document.createElement('slot')); // default — page content

      main.appendChild(topbar);
      main.appendChild(content);

      shadow.appendChild(dock);
      shadow.appendChild(this._scrimEl);
      shadow.appendChild(main);
    }

    this.classList.add(styles.host);
    document.addEventListener('keydown', this._handleKeydown);
    // Auto-close the drawer when a sidebar item is chosen on mobile.
    this.addEventListener('loom-sidebar-select', this._handleSidebarSelect);

    this._setupMediaQuery();
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this._handleKeydown);
    this.removeEventListener('loom-sidebar-select', this._handleSidebarSelect);
    this._teardownMediaQuery();
  }

  attributeChangedCallback(name: string): void {
    if (name === 'responsive' || name === 'mobile-breakpoint') {
      this._setupMediaQuery();
    }
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────────

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
    this._syncMenuButton();
  }

  // ─── Responsive (matchMedia) ────────────────────────────────────────────────────

  private readonly _handleMqlChange = (event: MediaQueryListEvent): void => {
    this._setMobile(event.matches);
  };

  private _setupMediaQuery(): void {
    this._teardownMediaQuery();
    if (!this.responsive) {
      this._setMobile(false);
      return;
    }
    this._mql = window.matchMedia(`(max-width: ${this.mobileBreakpoint})`);
    this._mql.addEventListener('change', this._handleMqlChange);
    this._setMobile(this._mql.matches);
  }

  private _teardownMediaQuery(): void {
    if (this._mql) {
      this._mql.removeEventListener('change', this._handleMqlChange);
      this._mql = null;
    }
  }

  private _setMobile(isMobile: boolean): void {
    this._isMobile = isMobile;
    this.toggleAttribute('data-mobile', isMobile);
    // Leaving mobile must not strand an open drawer.
    if (!isMobile && this._drawerOpen) this.closeDrawer();
    this._syncMenuButton();
  }

  // ─── Hamburger ───────────────────────────────────────────────────────────────────

  private _syncMenuButton(): void {
    if (!this._menuToggleEl) return;
    const mode = this.menuButton;
    const visible = mode === 'always' || (mode !== 'never' && this._isMobile);
    this._menuToggleEl.hidden = !visible;
    if (this._isMobile) {
      this._menuToggleEl.setAttribute('aria-expanded', String(this._drawerOpen));
    } else {
      this._menuToggleEl.removeAttribute('aria-expanded');
    }
  }

  private readonly _handleMenuClick = (): void => {
    if (this._isMobile) {
      this.toggleDrawer();
    } else {
      this._sidebar()?.toggle?.();
    }
  };

  private _sidebar(): CollapsibleSidebar | null {
    return this.querySelector<CollapsibleSidebar>('loom-sidebar');
  }

  // ─── Drawer (mobile) ──────────────────────────────────────────────────────────────

  openDrawer(): void {
    if (this._drawerOpen) return;
    this._drawerOpen = true;
    this.toggleAttribute('data-drawer-open', true);
    this._syncMenuButton();
    this._emitDrawerToggle(true);
  }

  closeDrawer(): void {
    if (!this._drawerOpen) return;
    this._drawerOpen = false;
    this.toggleAttribute('data-drawer-open', false);
    this._syncMenuButton();
    this._emitDrawerToggle(false);
  }

  toggleDrawer(): void {
    if (this._drawerOpen) this.closeDrawer();
    else this.openDrawer();
  }

  private _emitDrawerToggle(open: boolean): void {
    this.dispatchEvent(
      new CustomEvent<AppLayoutDrawerToggleEventDetail>('loom-app-layout-drawer-toggle', {
        bubbles: true,
        composed: true,
        detail: { open },
      }),
    );
  }

  private readonly _handleScrimClick = (): void => {
    this.closeDrawer();
  };

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this._drawerOpen) this.closeDrawer();
  };

  private readonly _handleSidebarSelect = (): void => {
    if (this._isMobile && this._drawerOpen) this.closeDrawer();
  };
}

customElements.define('loom-app-layout', LoomAppLayout);

declare global {
  interface HTMLElementTagNameMap {
    'loom-app-layout': LoomAppLayout;
  }
}

export { LoomAppLayout };
