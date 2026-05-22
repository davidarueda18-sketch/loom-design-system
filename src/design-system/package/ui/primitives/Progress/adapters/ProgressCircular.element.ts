import * as styles from '../ProgressCircular.css.ts';
import type {
  ProgressThickness,
  ProgressCircularSize,
  ProgressColor,
} from '../Progress.types.ts';

// ─── VE stylesheet adoption (same pattern as Divider) ───────────────────────

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

let _hostSheet: CSSStyleSheet | null = null;

function getHostSheet(): CSSStyleSheet | null {
  if (_hostSheet) return _hostSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host { display: inline-flex; align-items: center; justify-content: center; position: relative; }
      :host([hidden]) { display: none; }
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

// ─── SVG geometry constants ──────────────────────────────────────────────────

const SVG_NS  = 'http://www.w3.org/2000/svg';
const VIEWBOX = 44;
const CENTER  = VIEWBOX / 2;
const RADIUS  = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// ─── LoomProgressCircular ───────────────────────────────────────────────────

class LoomProgressCircular extends HTMLElement {
  static observedAttributes = [
    'value',
    'max',
    'indeterminate',
    'thickness',
    'size',
    'color',
    'label',
    'show-value',
    'aria-label',
  ] as const;

  // ─── Getters / setters ──────────────────────────────────────────────────

  get value(): number | null {
    const raw = this.getAttribute('value');
    return raw == null ? null : Number(raw);
  }
  set value(v: number | null) {
    if (v == null) this.removeAttribute('value');
    else this.setAttribute('value', String(v));
  }

  get max(): number {
    const raw = this.getAttribute('max');
    return raw == null ? 100 : Number(raw);
  }
  set max(v: number) { this.setAttribute('max', String(v)); }

  get indeterminate(): boolean { return this.hasAttribute('indeterminate'); }
  set indeterminate(v: boolean) { this.toggleAttribute('indeterminate', v); }

  get thickness(): ProgressThickness {
    return (this.getAttribute('thickness') as ProgressThickness) ?? 'sm';
  }
  set thickness(v: ProgressThickness) { this.setAttribute('thickness', v); }

  get size(): ProgressCircularSize {
    return (this.getAttribute('size') as ProgressCircularSize) ?? 'md';
  }
  set size(v: ProgressCircularSize) { this.setAttribute('size', v); }

  get color(): ProgressColor {
    return (this.getAttribute('color') as ProgressColor) ?? 'brandAccent';
  }
  set color(v: ProgressColor) { this.setAttribute('color', v); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(v: string) {
    if (v) this.setAttribute('label', v);
    else this.removeAttribute('label');
  }

  get showValue(): boolean { return this.hasAttribute('show-value'); }
  set showValue(v: boolean) { this.toggleAttribute('show-value', v); }

  // ─── Shadow DOM elements ────────────────────────────────────────────────

  private _svg!:        SVGSVGElement;
  private _track!:      SVGCircleElement;
  private _active!:     SVGCircleElement;
  private _label!:      HTMLSpanElement;

  // ─── Prev-state (per element, for idempotent _sync) ─────────────────────

  private _hostPrev:   Record<string, string | null> = {};
  private _svgPrev:    Record<string, string | null> = {};
  private _trackPrev:  Record<string, string | null> = {};
  private _activePrev: Record<string, string | null> = {};

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = getAdoptedStyleSheets();

      this._svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
      this._svg.setAttribute('viewBox', `0 0 ${VIEWBOX} ${VIEWBOX}`);
      this._svg.setAttribute('part', 'ring');
      this._svg.setAttribute('aria-hidden', 'true');
      this._svg.classList.add(styles.svg);

      this._track = document.createElementNS(SVG_NS, 'circle') as SVGCircleElement;
      this._track.setAttribute('cx', String(CENTER));
      this._track.setAttribute('cy', String(CENTER));
      this._track.setAttribute('r',  String(RADIUS));
      this._track.setAttribute('part', 'track');
      this._track.classList.add(styles.track);

      this._active = document.createElementNS(SVG_NS, 'circle') as SVGCircleElement;
      this._active.setAttribute('cx', String(CENTER));
      this._active.setAttribute('cy', String(CENTER));
      this._active.setAttribute('r',  String(RADIUS));
      this._active.setAttribute('part', 'active');
      this._active.classList.add(styles.active);

      this._svg.appendChild(this._track);
      this._svg.appendChild(this._active);

      this._label = document.createElement('span');
      this._label.setAttribute('part', 'label');
      this._label.classList.add(styles.label);

      shadow.appendChild(this._svg);
      shadow.appendChild(this._label);

      this.classList.add(styles.root);
    }
    this._sync();
  }

  attributeChangedCallback(): void {
    this._scheduleSync();
  }

  // ─── Sync ───────────────────────────────────────────────────────────────

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
    const thickness     = this.thickness;
    const size          = this.size;
    const color         = this.color;
    const label         = this.label;
    const showValue     = this.showValue;
    const value         = this.value;
    const max           = this.max;
    const isIndeterminate = this.indeterminate || value == null;

    const ratio   = isIndeterminate ? 0 : clamp(value! / max, 0, 1);
    const percent = Math.round(ratio * 100);

    // Host: size + color
    this._applyTo(this, this._hostPrev, 'size',  size,  styles.sizes);
    this._applyTo(this, this._hostPrev, 'color', color, styles.colors);

    // SVG: indeterminate rotation animation
    this._applyTo(this._svg, this._svgPrev, 'indeterminate',
      isIndeterminate ? 'on' : null, { on: styles.svgIndeterminate });

    // Track + active: thickness
    this._applyTo(this._track,  this._trackPrev,  'thickness', thickness, styles.thickness);
    this._applyTo(this._active, this._activePrev, 'thickness', thickness, styles.thickness);

    // Active: indeterminate dasharray animation
    this._applyTo(this._active, this._activePrev, 'indeterminate',
      isIndeterminate ? 'on' : null, { on: styles.activeIndeterminate });

    if (isIndeterminate) {
      // Animation drives stroke-dasharray/offset; clear inline attrs so CSS can take over.
      this._active.removeAttribute('stroke-dasharray');
      this._active.removeAttribute('stroke-dashoffset');
      this._active.removeAttribute('transform');
    } else {
      this._active.setAttribute('stroke-dasharray',  String(CIRCUMFERENCE));
      this._active.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE * (1 - ratio)));
      this._active.setAttribute('transform', `rotate(-90 ${CENTER} ${CENTER})`);
    }

    // Label
    const captionText = showValue && !isIndeterminate ? `${percent}%` : label;
    this._label.textContent = captionText;
    this._label.hidden = !captionText;

    // ARIA on host
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', String(max));
    if (isIndeterminate) {
      this.removeAttribute('aria-valuenow');
      this.setAttribute('aria-busy', 'true');
    } else {
      this.setAttribute('aria-valuenow', String(Math.round(ratio * max)));
      this.removeAttribute('aria-busy');
    }
    const hostAriaLabel = this.getAttribute('aria-label');
    if (!hostAriaLabel && label) this.setAttribute('aria-label', label);
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

customElements.define('loom-progress-circular', LoomProgressCircular);

declare global {
  interface HTMLElementTagNameMap {
    'loom-progress-circular': LoomProgressCircular;
  }
}

export { LoomProgressCircular };
