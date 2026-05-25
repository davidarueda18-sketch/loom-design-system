import * as styles from '../Badge.css.ts';
import type { BadgeState } from '../Badge.types.ts';

const VALID_STATES = new Set<BadgeState>(['default', 'progress', 'success', 'warning', 'danger', 'info']);

// ─── VE stylesheet adoption ───────────────────────────────────────────────────

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(source: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Array.from(source.cssRules).map((r) => r.cssText).join('\n'));
    return sheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((r) => r.cssText.includes(anchorClass))) {
        _sheetCache[anchorClass] = cloneAsConstructedSheet(sheet as CSSStyleSheet);
        return _sheetCache[anchorClass];
      }
    } catch {
      // cross-origin stylesheet — skip
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  return [getVESheet(styles.root)].filter((s): s is CSSStyleSheet => s != null);
}

// ─── LoomBadge ────────────────────────────────────────────────────────────────

class LoomBadge extends HTMLElement {
  static observedAttributes = ['state', 'label'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get state(): BadgeState {
    const val = this.getAttribute('state') as BadgeState;
    return VALID_STATES.has(val) ? val : 'default';
  }
  set state(val: BadgeState) {
    this.setAttribute('state', val);
  }

  get label(): string | null {
    return this.getAttribute('label');
  }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
  }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _dotEl: HTMLSpanElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  // ─── Prev-state (for idempotent _sync) ───────────────────────────────────

  private _prev: Record<string, string | null> = { state: null };

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-badge] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      this._dotEl = document.createElement('span');
      this._dotEl.setAttribute('part', 'dot');
      this._dotEl.setAttribute('aria-hidden', 'true');
      this._dotEl.classList.add(styles.dot);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');

      shadow.appendChild(this._dotEl);
      shadow.appendChild(this._labelEl);

      this.classList.add(styles.root);
    }
    this._sync();
  }

  // Law 4: name-aware routing — aria-* must bypass RAF for synchronous a11y
  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._dotEl || !this._labelEl) return;

    const badgeState = this.state;
    const label = this.label;

    this._applyTo(this, this._prev, 'state', badgeState, styles.state as Record<string, string>);

    this._labelEl.textContent = label ?? '';
    this._labelEl.hidden = label == null;

    this._syncA11y();
  }

  // Forward any future aria-* attributes from host to label part
  private _syncA11y(): void {
    if (!this._labelEl) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._labelEl!.setAttribute(attr, val);
      else this._labelEl!.removeAttribute(attr);
    });
  }

  private _applyTo(
    el: Element,
    prev: Record<string, string | null>,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const old  = prev[prop] ?? null;
    if (next === old) return;
    if (old)  el.classList.remove(...old.split(/\s+/).filter(Boolean));
    if (next) el.classList.add(...next.split(/\s+/).filter(Boolean));
    prev[prop] = next;
  }
}

customElements.define('loom-badge', LoomBadge);

declare global {
  interface HTMLElementTagNameMap {
    'loom-badge': LoomBadge;
  }
}

export { LoomBadge };
