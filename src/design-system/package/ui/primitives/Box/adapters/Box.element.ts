import * as styles from '../Box.css.ts';
import type { SpacingTokenKey } from '../../../../tokens/index.ts';
import type { BoxDisplay } from '../Box.types.ts';
import { BOX_DISPLAYS } from '../Box.types.ts';

const VALID_DISPLAYS = new Set<BoxDisplay>(BOX_DISPLAYS);
const displayClassKeyMap: Record<BoxDisplay, keyof typeof styles.display> = {
  block: 'block',
  inline: 'inline',
  'inline-block': 'inlineBlock',
  flex: 'flex',
  'inline-flex': 'inlineFlex',
  grid: 'grid',
  'inline-grid': 'inlineGrid',
  contents: 'contents',
  none: 'none',
};

class LoomBox extends HTMLElement {
  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['display', 'padding', 'padding-x', 'padding-y'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get display(): BoxDisplay | null {
    const val = this.getAttribute('display') as BoxDisplay | null;
    return val != null && VALID_DISPLAYS.has(val) ? val : null;
  }
  set display(val: BoxDisplay | null) {
    if (val == null) this.removeAttribute('display');
    else this.setAttribute('display', val);
  }

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
    display: null,
    padding: null,
    paddingX: null,
    paddingY: null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    const display = this.display;
    this._apply('display', display == null ? null : displayClassKeyMap[display], styles.display);
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
