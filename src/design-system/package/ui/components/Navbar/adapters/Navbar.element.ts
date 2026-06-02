import * as styles from '../Navbar.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';

// ─── LoomNavbar ───────────────────────────────────────────────────────────────
// Presentational top navigation bar: bold `application` title + decorative
// divider + light `section` subtitle on the left, and a default slot for action
// elements (e.g. loom-icon-button) on the right. No custom events, no form.

class LoomNavbar extends HTMLElement {
  static observedAttributes = ['application', 'section'] as const;

  // ─── Getters / Setters ─────────────────────────────────────────────────────

  get application(): string {
    return this.getAttribute('application') ?? '';
  }
  set application(val: string) {
    if (val) this.setAttribute('application', val);
    else this.removeAttribute('application');
  }

  get section(): string {
    return this.getAttribute('section') ?? '';
  }
  set section(val: string) {
    if (val) this.setAttribute('section', val);
    else this.removeAttribute('section');
  }

  // ─── Shadow DOM elements ────────────────────────────────────────────────────

  private _applicationEl: HTMLSpanElement | null = null;
  private _dividerEl:     HTMLSpanElement | null = null;
  private _sectionEl:     HTMLSpanElement | null = null;

  // ─── State ──────────────────────────────────────────────────────────────────

  private _hasConsumerLabel = false;

  // ─── Lifecycle ────────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-navbar] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      const container = document.createElement('div');
      container.classList.add(styles.container);
      container.setAttribute('part', 'container');

      // ── Hero (left) ─────────────────────────────────────────────────────────
      const hero = document.createElement('div');
      hero.classList.add(styles.hero);
      hero.setAttribute('part', 'hero');

      this._applicationEl = document.createElement('span');
      this._applicationEl.classList.add(styles.application);
      this._applicationEl.setAttribute('part', 'application');

      this._dividerEl = document.createElement('span');
      this._dividerEl.classList.add(styles.divider);
      this._dividerEl.setAttribute('part', 'divider');
      this._dividerEl.setAttribute('aria-hidden', 'true');
      this._dividerEl.hidden = true;

      this._sectionEl = document.createElement('span');
      this._sectionEl.classList.add(styles.section);
      this._sectionEl.setAttribute('part', 'section');
      this._sectionEl.hidden = true;

      hero.appendChild(this._applicationEl);
      hero.appendChild(this._dividerEl);
      hero.appendChild(this._sectionEl);

      // ── Options (right) ───────────────────────────────────────────────────────
      const options = document.createElement('div');
      options.classList.add(styles.options);
      options.setAttribute('part', 'options');
      options.appendChild(document.createElement('slot'));

      container.appendChild(hero);
      container.appendChild(options);
      shadow.appendChild(container);
    }

    this._hasConsumerLabel = this.hasAttribute('aria-label');
    if (!this.hasAttribute('role')) this.setAttribute('role', 'navigation');

    this.classList.add(styles.host);
    this._sync();
  }

  attributeChangedCallback(): void {
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

  // ─── Sync ───────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._applicationEl || !this._dividerEl || !this._sectionEl) return;

    const application = this.application;
    this._applicationEl.textContent = application;

    const hasSection = this.hasAttribute('section') && this.section.length > 0;
    this._dividerEl.hidden = !hasSection;
    this._sectionEl.hidden = !hasSection;
    this._sectionEl.textContent = hasSection ? this.section : '';

    // Mirror `application` as the navigation landmark's accessible name unless
    // the consumer supplied their own aria-label.
    if (!this._hasConsumerLabel) {
      if (application) this.setAttribute('aria-label', application);
      else this.removeAttribute('aria-label');
    }
  }
}

customElements.define('loom-navbar', LoomNavbar);

declare global {
  interface HTMLElementTagNameMap {
    'loom-navbar': LoomNavbar;
  }
}

export { LoomNavbar };
