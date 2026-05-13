import * as styles from '../Text.css.ts';
import type { TextVariant } from '../Text.types.ts';
import { variantTokenMap } from '../Text.types.ts';
import type { TypographyTokenKey } from '../../../../tokens/index.ts';

// Pre-compute TextVariant → CSS class map so _apply can do a direct key lookup
const variantClassMap: Record<string, string> = Object.fromEntries(
  (Object.entries(variantTokenMap) as [TextVariant, TypographyTokenKey][]).map(
    ([v, k]) => [v, styles.variants[k]],
  ),
);

class LoomText extends HTMLElement {
  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['variant', 'align'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get variant(): TextVariant | null {
    return this.getAttribute('variant') as TextVariant | null;
  }
  set variant(val: TextVariant | null) {
    if (val == null) this.removeAttribute('variant');
    else this.setAttribute('variant', val);
  }

  get align(): string | null {
    return this.getAttribute('align');
  }
  set align(val: string | null) {
    if (val == null) this.removeAttribute('align');
    else this.setAttribute('align', val);
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
    align: null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    this._apply('variant', this.getAttribute('variant'), variantClassMap);
    this._apply('align', this.getAttribute('align'), styles.aligns as Record<string, string>);
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
