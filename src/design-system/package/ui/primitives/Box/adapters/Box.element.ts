import * as styles from '../Box.css.ts';
import type { SpacingTokenKey } from '../../../../tokens/index.ts';

class LoomBox extends HTMLElement {
  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['padding', 'padding-x', 'padding-y'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get padding(): SpacingTokenKey | null {
    return this.getAttribute('padding') as SpacingTokenKey | null;
  }
  set padding(val: SpacingTokenKey | null) {
    if (val == null) this.removeAttribute('padding');
    else this.setAttribute('padding', val);
  }

  get paddingX(): SpacingTokenKey | null {
    return this.getAttribute('padding-x') as SpacingTokenKey | null;
  }
  set paddingX(val: SpacingTokenKey | null) {
    if (val == null) this.removeAttribute('padding-x');
    else this.setAttribute('padding-x', val);
  }

  get paddingY(): SpacingTokenKey | null {
    return this.getAttribute('padding-y') as SpacingTokenKey | null;
  }
  set paddingY(val: SpacingTokenKey | null) {
    if (val == null) this.removeAttribute('padding-y');
    else this.setAttribute('padding-y', val);
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  connectedCallback() {
    this.classList.add(styles.root);
    this._sync();
  }

  attributeChangedCallback() {
    this._sync();
  }

  // ─── State tracking (idempotent _sync) ───────────────────────────────────
  private _prev: Record<string, string | null> = {
    padding: null,
    paddingX: null,
    paddingY: null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    this._apply('padding',  this.getAttribute('padding'),   styles.padding);
    this._apply('paddingX', this.getAttribute('padding-x'), styles.paddingX);
    this._apply('paddingY', this.getAttribute('padding-y'), styles.paddingY);
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

customElements.define('loom-box', LoomBox);

declare global {
  interface HTMLElementTagNameMap {
    'loom-box': LoomBox;
  }
}

export { LoomBox };
