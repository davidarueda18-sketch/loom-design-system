import * as styles from '../Inline.css.ts';
import type { SpacingTokenKey } from '../../../../tokens/index.ts';
import type { InlineAlign, InlineJustify } from '../Inline.types.ts';

class LoomInline extends HTMLElement {
  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['gap', 'align', 'justify', 'wrap'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get gap(): SpacingTokenKey | null {
    return this.getAttribute('gap') as SpacingTokenKey | null;
  }
  set gap(val: SpacingTokenKey | null) {
    if (val == null) this.removeAttribute('gap');
    else this.setAttribute('gap', val);
  }

  get align(): InlineAlign | null {
    return this.getAttribute('align') as InlineAlign | null;
  }
  set align(val: InlineAlign | null) {
    if (val == null) this.removeAttribute('align');
    else this.setAttribute('align', val);
  }

  get justify(): InlineJustify | null {
    return this.getAttribute('justify') as InlineJustify | null;
  }
  set justify(val: InlineJustify | null) {
    if (val == null) this.removeAttribute('justify');
    else this.setAttribute('justify', val);
  }

  get wrap(): boolean {
    return this.hasAttribute('wrap');
  }
  set wrap(val: boolean) {
    if (val) this.setAttribute('wrap', '');
    else this.removeAttribute('wrap');
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
    gap:     null,
    align:   null,
    justify: null,
    wrap:    null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    // gap is optional — no default
    this._apply('gap',     this.getAttribute('gap'),                styles.gap     as Record<string, string>);
    // align and justify mirror the React adapter defaults
    this._apply('align',   this.getAttribute('align')   ?? 'center', styles.align   as Record<string, string>);
    this._apply('justify', this.getAttribute('justify') ?? 'start',  styles.justify as Record<string, string>);
    // wrap is a boolean toggle mapped to a synthetic key
    this._apply('wrap',    this.hasAttribute('wrap') ? 'on' : null, { on: styles.wrap });
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

customElements.define('loom-inline', LoomInline);

declare global {
  interface HTMLElementTagNameMap {
    'loom-inline': LoomInline;
  }
}

export { LoomInline };
