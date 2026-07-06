import * as styles from '../Avatar.css.ts';
import { getAvatarColor, getInitials } from '../Avatar.utils.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { AvatarSize } from '../Avatar.types.ts';

const SIZES: readonly AvatarSize[] = ['sm', 'md', 'lg'];

class LoomAvatar extends HTMLElement {
  static observedAttributes = ['name', 'email', 'photo-url', 'size'] as const;

  get name(): string { return this.getAttribute('name') ?? ''; }
  set name(v: string) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }

  get email(): string { return this.getAttribute('email') ?? ''; }
  set email(v: string) { if (v) this.setAttribute('email', v); else this.removeAttribute('email'); }

  get photoUrl(): string { return this.getAttribute('photo-url') ?? ''; }
  set photoUrl(v: string) { if (v) this.setAttribute('photo-url', v); else this.removeAttribute('photo-url'); }

  get size(): AvatarSize {
    const v = this.getAttribute('size');
    return v && (SIZES as readonly string[]).includes(v) ? (v as AvatarSize) : 'md';
  }
  set size(v: AvatarSize) { this.setAttribute('size', v); }

  private _imgEl: HTMLImageElement | null = null;
  private _initialsEl: HTMLSpanElement | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.root);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;

      this._imgEl = document.createElement('img');
      this._imgEl.classList.add(styles.img);
      this._imgEl.setAttribute('part', 'img');
      this._imgEl.addEventListener('error', () => {
        if (this._imgEl) this._imgEl.hidden = true;
        if (this._initialsEl) this._initialsEl.hidden = false;
      });

      this._initialsEl = document.createElement('span');
      this._initialsEl.setAttribute('part', 'initials');

      shadow.appendChild(this._imgEl);
      shadow.appendChild(this._initialsEl);
    }
    this.classList.add(styles.root);
    if (!this.hasAttribute('role')) this.setAttribute('role', 'img');
    this._sync();
  }

  attributeChangedCallback(): void { this._scheduleSync(); }

  private _syncScheduled = false;
  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => { this._syncScheduled = false; this._sync(); });
  }

  private _sync(): void {
    if (!this._imgEl || !this._initialsEl) return;

    const sz = this.size;
    SIZES.forEach((s) => this.classList.toggle(styles.size[s], s === sz));

    const initials = getInitials(this.name);
    const color = getAvatarColor(this.email || this.name);

    const url = this.photoUrl;
    if (url) {
      this._imgEl.src = url;
      this._imgEl.alt = this.name || this.email || 'Avatar';
      this._imgEl.hidden = false;
      this._initialsEl.hidden = true;
    } else {
      this._imgEl.hidden = true;
      this._imgEl.src = '';
      this._initialsEl.hidden = false;
      this._initialsEl.textContent = initials;
      this.style.backgroundColor = color;
    }

    this.setAttribute('aria-label', this.name || this.email || 'Avatar');
  }
}

customElements.define('loom-avatar', LoomAvatar);

declare global {
  interface HTMLElementTagNameMap { 'loom-avatar': LoomAvatar; }
}

export { LoomAvatar };
