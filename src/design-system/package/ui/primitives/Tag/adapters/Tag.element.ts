import * as styles from '../Tag.css.ts';
import type { TagValue } from '../Tag.types.ts';

// ─── SVG icon paths (heroicons 16/solid) ─────────────────────────────────────

const SVG_POSITIVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z"/></svg>`;
const SVG_NEGATIVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.22 4.22a.75.75 0 0 1 1.06 0L6 7.94l2.761-2.762a.75.75 0 0 1 1.158.12 24.9 24.9 0 0 1 2.718 5.556l.729-1.261a.75.75 0 0 1 1.299.75l-1.591 2.755a.75.75 0 0 1-1.025.275l-2.756-1.591a.75.75 0 1 1 .75-1.3l1.097.634a23.417 23.417 0 0 0-1.984-4.211L6.53 9.53a.75.75 0 0 1-1.06 0L1.22 5.28a.75.75 0 0 1 0-1.06Z"/></svg>`;
const SVG_NEUTRAL  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"/></svg>`;

const ICON_SVGS: Record<TagValue, string> = {
  positive: SVG_POSITIVE,
  negative: SVG_NEGATIVE,
  neutral:  SVG_NEUTRAL,
};

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

// ─── LoomTag ──────────────────────────────────────────────────────────────────

class LoomTag extends HTMLElement {
  static observedAttributes = ['value', 'label', 'show-icon'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get value(): TagValue {
    return (this.getAttribute('value') as TagValue) ?? 'positive';
  }
  set value(val: TagValue) {
    this.setAttribute('value', val);
  }

  get label(): string | null {
    return this.getAttribute('label');
  }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
  }

  get showIcon(): boolean {
    return this.getAttribute('show-icon') !== 'false';
  }
  set showIcon(val: boolean) {
    this.setAttribute('show-icon', String(val));
  }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _iconEl!: HTMLSpanElement;
  private _labelEl!: HTMLSpanElement;

  // ─── Prev-state (for idempotent _sync) ───────────────────────────────────

  private _prev: Record<string, string | null> = { value: null };

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = getAdoptedStyleSheets();

      this._iconEl = document.createElement('span');
      this._iconEl.setAttribute('part', 'icon');
      this._iconEl.setAttribute('aria-hidden', 'true');
      this._iconEl.classList.add(styles.iconWrapper);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');

      shadow.appendChild(this._iconEl);
      shadow.appendChild(this._labelEl);

      this.classList.add(styles.root);
    }
    this._sync();
  }

  attributeChangedCallback(): void {
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
    const val      = this.value;
    const label    = this.label;
    const showIcon = this.showIcon;

    this._applyTo(this, this._prev, 'value', val, styles.value as Record<string, string>);

    if (this._iconEl) {
      if (showIcon) {
        this._iconEl.innerHTML = ICON_SVGS[val] ?? '';
        if (!this._iconEl.isConnected) {
          this.shadowRoot?.insertBefore(this._iconEl, this._labelEl);
        }
      } else {
        this._iconEl.remove();
        this._iconEl.innerHTML = '';
      }
    }

    if (this._labelEl) {
      this._labelEl.textContent = label ?? '';
      this._labelEl.hidden = label == null;
    }
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

customElements.define('loom-tag', LoomTag);

declare global {
  interface HTMLElementTagNameMap {
    'loom-tag': LoomTag;
  }
}

export { LoomTag };
