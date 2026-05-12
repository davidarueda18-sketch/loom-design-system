import * as styles from '../Text.css.ts';
import type { TypographyTokenKey } from '../../../../tokens/index.ts';

class LoomText extends HTMLElement {
  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['variant'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get variant(): TypographyTokenKey | null {
    return this.getAttribute('variant') as TypographyTokenKey | null;
  }
  set variant(val: TypographyTokenKey | null) {
    if (val == null) this.removeAttribute('variant');
    else this.setAttribute('variant', val);
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  connectedCallback() {
    this.classList.add(styles.root);
    this._sync();
  }

  attributeChangedCallback() {
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

  // ─── State tracking (idempotent _sync) ───────────────────────────────────
  private _prev: Record<string, string | null> = {
    variant: null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    this._apply('variant', this.getAttribute('variant'), styles.variants as Record<string, string>);
  }

  private _apply(
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const prev = this._prev[prop] ?? null;
    if (next === prev) return;
    if (prev) this.classList.remove(prev);
    if (next) this.classList.add(next);
    this._prev[prop] = next;
  }
}

customElements.define('loom-text', LoomText);

declare global {
  interface HTMLElementTagNameMap {
    'loom-text': LoomText;
  }
}

export { LoomText };
