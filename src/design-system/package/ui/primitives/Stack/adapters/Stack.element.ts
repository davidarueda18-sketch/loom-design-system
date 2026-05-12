import * as styles from '../Stack.css.ts';
import type { SpacingTokenKey } from '../../../../tokens/index.ts';
import type { StackAlign, StackJustify } from '../Stack.types.ts';

class LoomStack extends HTMLElement {
  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['gap', 'align', 'justify'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get gap(): SpacingTokenKey | null {
    return this.getAttribute('gap') as SpacingTokenKey | null;
  }
  set gap(val: SpacingTokenKey | null) {
    if (val == null) this.removeAttribute('gap');
    else this.setAttribute('gap', val);
  }

  get align(): StackAlign | null {
    return this.getAttribute('align') as StackAlign | null;
  }
  set align(val: StackAlign | null) {
    if (val == null) this.removeAttribute('align');
    else this.setAttribute('align', val);
  }

  get justify(): StackJustify | null {
    return this.getAttribute('justify') as StackJustify | null;
  }
  set justify(val: StackJustify | null) {
    if (val == null) this.removeAttribute('justify');
    else this.setAttribute('justify', val);
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
    gap:     null,
    align:   null,
    justify: null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    // gap is optional — no default
    this._apply('gap',     this.getAttribute('gap'),                 styles.gap     as Record<string, string>);
    // align and justify mirror the React adapter defaults
    this._apply('align',   this.getAttribute('align')   ?? 'stretch', styles.align   as Record<string, string>);
    this._apply('justify', this.getAttribute('justify') ?? 'start',   styles.justify as Record<string, string>);
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

customElements.define('loom-stack', LoomStack);

declare global {
  interface HTMLElementTagNameMap {
    'loom-stack': LoomStack;
  }
}

export { LoomStack };
