import * as styles from '../Divider.css.ts';
import type {
  DividerOrientation,
  DividerLabelPosition,
  DividerColor,
  DividerThickness,
  DividerLineStyle,
} from '../Divider.types.ts';

// ─── VE stylesheet adoption (same pattern as Icon) ───────────────────────────

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
      // Cross-origin stylesheets are not readable.
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

let _hostSheet: CSSStyleSheet | null = null;

function getHostSheet(): CSSStyleSheet | null {
  if (_hostSheet) return _hostSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        display: flex;
        align-items: center;
        box-sizing: border-box;
      }
    `);
    _hostSheet = sheet;
    return sheet;
  } catch {
    return null;
  }
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  return [getVESheet(styles.root), getHostSheet()]
    .filter((s): s is CSSStyleSheet => s != null);
}

// ─── LoomDivider ─────────────────────────────────────────────────────────────

class LoomDivider extends HTMLElement {
  static observedAttributes = [
    'orientation',
    'label',
    'label-position',
    'color',
    'thickness',
    'line-style',
  ] as const;

  // ─── Getters / setters ───────────────────────────────────────────────────

  get orientation(): DividerOrientation {
    return (this.getAttribute('orientation') as DividerOrientation) ?? 'horizontal';
  }
  set orientation(v: DividerOrientation) { this.setAttribute('orientation', v); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(v: string) {
    if (v) this.setAttribute('label', v);
    else this.removeAttribute('label');
  }

  get labelPosition(): DividerLabelPosition {
    return (this.getAttribute('label-position') as DividerLabelPosition) ?? 'center';
  }
  set labelPosition(v: DividerLabelPosition) { this.setAttribute('label-position', v); }

  get color(): DividerColor {
    return (this.getAttribute('color') as DividerColor) ?? 'borderDefault';
  }
  set color(v: DividerColor) { this.setAttribute('color', v); }

  get thickness(): DividerThickness {
    return (this.getAttribute('thickness') as DividerThickness) ?? 'thin';
  }
  set thickness(v: DividerThickness) { this.setAttribute('thickness', v); }

  get lineStyle(): DividerLineStyle {
    return (this.getAttribute('line-style') as DividerLineStyle) ?? 'solid';
  }
  set lineStyle(v: DividerLineStyle) { this.setAttribute('line-style', v); }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _lineStart!: HTMLSpanElement;
  private _labelEl!: HTMLSpanElement;
  private _lineEnd!: HTMLSpanElement;

  // ─── Prev-state maps (one per element for idempotent _sync) ──────────────

  private _hostPrev:      Record<string, string | null> = {};
  private _lineStartPrev: Record<string, string | null> = {};
  private _lineEndPrev:   Record<string, string | null> = {};
  private _labelPrev:     Record<string, string | null> = {};

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = getAdoptedStyleSheets();

      this._lineStart = document.createElement('span');
      this._lineStart.setAttribute('part', 'line line-start');
      this._lineStart.setAttribute('aria-hidden', 'true');
      this._lineStart.classList.add(styles.line);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.label);

      this._lineEnd = document.createElement('span');
      this._lineEnd.setAttribute('part', 'line line-end');
      this._lineEnd.setAttribute('aria-hidden', 'true');
      this._lineEnd.classList.add(styles.line);

      shadow.appendChild(this._lineStart);
      shadow.appendChild(this._labelEl);
      shadow.appendChild(this._lineEnd);

      this.classList.add(styles.root);
    }
    this._sync();
  }

  attributeChangedCallback(): void {
    this._scheduleSync();
  }

  // ─── Sync ────────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  private _sync(): void {
    const orientation    = this.orientation;
    const label          = this.label;
    const labelPosition  = this.labelPosition;
    const color          = this.color;
    const thickness      = this.thickness;
    const lineStyle      = this.lineStyle;

    const isVertical = orientation === 'vertical';
    const hasLabel   = Boolean(label);

    // Host: orientation + color
    this._applyTo(this, this._hostPrev, 'orientation', orientation, styles.orientations);
    this._applyTo(this, this._hostPrev, 'color', color, styles.colors);

    // Host: a11y
    this.setAttribute('role', 'separator');
    this.setAttribute('aria-orientation', orientation);
    if (hasLabel) this.setAttribute('aria-label', label);
    else this.removeAttribute('aria-label');

    // Line segment variant maps depend on orientation
    const thicknessMap = isVertical ? styles.thicknessV : styles.thicknessH;
    const lineStyleMap = isVertical ? styles.lineStyleV : styles.lineStyleH;

    // Line start: always visible
    this._applyTo(this._lineStart, this._lineStartPrev, 'thickness',  thickness,  thicknessMap);
    this._applyTo(this._lineStart, this._lineStartPrev, 'lineStyle',  lineStyle,  lineStyleMap);
    const startSize = (hasLabel && labelPosition === 'start') ? 'fixed' : 'grow';
    this._applyTo(this._lineStart, this._lineStartPrev, 'size', startSize, styles.lineSize);

    // Label
    this._labelEl.textContent = label;
    this._labelEl.hidden = !hasLabel;
    this._applyTo(
      this._labelEl, this._labelPrev, 'rotate',
      isVertical && hasLabel ? 'vertical' : null,
      { vertical: styles.labelVertical },
    );

    // Line end: only shown when there is a label
    this._lineEnd.hidden = !hasLabel;
    if (hasLabel) {
      this._applyTo(this._lineEnd, this._lineEndPrev, 'thickness',  thickness,  thicknessMap);
      this._applyTo(this._lineEnd, this._lineEndPrev, 'lineStyle',  lineStyle,  lineStyleMap);
      const endSize = (labelPosition === 'end') ? 'fixed' : 'grow';
      this._applyTo(this._lineEnd, this._lineEndPrev, 'size', endSize, styles.lineSize);
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
    if (old)  el.classList.remove(old);
    if (next) el.classList.add(next);
    prev[prop] = next;
  }
}

customElements.define('loom-divider', LoomDivider);

declare global {
  interface HTMLElementTagNameMap {
    'loom-divider': LoomDivider;
  }
}

export { LoomDivider };
