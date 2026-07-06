import * as styles from '../AvatarGroup.css.ts';
import * as avatarStyles from '../Avatar.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { AvatarSize } from '../Avatar.types.ts';
import './Avatar.element.ts';

const SIZES: readonly AvatarSize[] = ['sm', 'md', 'lg'];
const SIZE_PX: Record<AvatarSize, string> = { sm: '24px', md: '32px', lg: '40px' };
const FONT_SIZE: Record<AvatarSize, string> = { sm: '10px', md: '11px', lg: '12px' };

class LoomAvatarGroup extends HTMLElement {
  static observedAttributes = ['max', 'size'] as const;

  get max(): number {
    const v = Number(this.getAttribute('max'));
    return Number.isFinite(v) && v > 0 ? v : Infinity;
  }
  set max(v: number) { this.setAttribute('max', String(v)); }

  get size(): AvatarSize {
    const v = this.getAttribute('size');
    return v && (SIZES as readonly string[]).includes(v) ? (v as AvatarSize) : 'md';
  }
  set size(v: AvatarSize) { this.setAttribute('size', v); }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.root, avatarStyles.root);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
      const slot = document.createElement('slot');
      shadow.appendChild(slot);
      slot.addEventListener('slotchange', () => this._scheduleSync());
    }
    this.classList.add(styles.root);
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
    const avatars = Array.from(this.querySelectorAll<HTMLElement>(':scope > loom-avatar'));
    const max = this.max;
    const sz = this.size;

    avatars.forEach((av, i) => {
      av.classList.add(styles.item);
      (av as unknown as { size: AvatarSize }).size = sz;
      if (i >= max) av.hidden = true;
      else av.hidden = false;
    });

    // Remove previous overflow badge if any
    this.querySelectorAll('[data-avatar-overflow]').forEach((el) => el.remove());

    const hidden = avatars.length - max;
    if (hidden > 0) {
      const badge = document.createElement('span');
      badge.dataset.avatarOverflow = '';
      badge.classList.add(styles.overflow);
      badge.textContent = `+${hidden}`;
      badge.style.width = SIZE_PX[sz];
      badge.style.height = SIZE_PX[sz];
      badge.style.fontSize = FONT_SIZE[sz];
      this.appendChild(badge);
    }
  }
}

customElements.define('loom-avatar-group', LoomAvatarGroup);

declare global {
  interface HTMLElementTagNameMap { 'loom-avatar-group': LoomAvatarGroup; }
}

export { LoomAvatarGroup };
