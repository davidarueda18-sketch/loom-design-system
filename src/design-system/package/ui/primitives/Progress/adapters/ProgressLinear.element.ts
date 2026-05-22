import * as styles from '../ProgressLinear.css.ts';
import type {
  ProgressThickness,
  ProgressShape,
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
      :host { display: flex; flex-direction: column; box-sizing: border-box; }
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// ─── LoomProgressLinear ─────────────────────────────────────────────────────

class LoomProgressLinear extends HTMLElement {
  static observedAttributes = [
    'value',
    'max',
    'indeterminate',
    'thickness',
    'color',
    'shape',
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

  get color(): ProgressColor {
    return (this.getAttribute('color') as ProgressColor) ?? 'brandAccent';
  }
  set color(v: ProgressColor) { this.setAttribute('color', v); }

  get shape(): ProgressShape {
    return (this.getAttribute('shape') as ProgressShape) ?? 'flat';
  }
  set shape(v: ProgressShape) { this.setAttribute('shape', v); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(v: string) {
    if (v) this.setAttribute('label', v);
    else this.removeAttribute('label');
  }

  get showValue(): boolean { return this.hasAttribute('show-value'); }
  set showValue(v: boolean) { this.toggleAttribute('show-value', v); }

  // ─── Shadow DOM elements ────────────────────────────────────────────────

  private _trackHost!:  HTMLDivElement;
  private _trackBg!:    HTMLDivElement;
  private _active!:     HTMLDivElement;
  private _stop!:       HTMLDivElement;
  private _labelRow!:   HTMLDivElement;
  private _labelText!:  HTMLSpanElement;
  private _labelValue!: HTMLSpanElement;

  // ─── Prev-state (per element, for idempotent _sync) ─────────────────────

  private _hostPrev:      Record<string, string | null> = {};
  private _trackBgPrev:   Record<string, string | null> = {};
  private _activePrev:    Record<string, string | null> = {};
  private _stopPrev:      Record<string, string | null> = {};

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = getAdoptedStyleSheets();

      this._trackHost = document.createElement('div');
      this._trackHost.setAttribute('part', 'track-host');
      this._trackHost.classList.add(styles.trackHost);

      this._trackBg = document.createElement('div');
      this._trackBg.setAttribute('part', 'track');
      this._trackBg.setAttribute('aria-hidden', 'true');

      this._active = document.createElement('div');
      this._active.setAttribute('part', 'active');
      this._active.setAttribute('aria-hidden', 'true');

      this._stop = document.createElement('div');
      this._stop.setAttribute('part', 'stop');
      this._stop.setAttribute('aria-hidden', 'true');

      this._trackHost.appendChild(this._trackBg);
      this._trackHost.appendChild(this._active);
      this._trackHost.appendChild(this._stop);

      this._labelRow = document.createElement('div');
      this._labelRow.setAttribute('part', 'label-row');
      this._labelRow.classList.add(styles.labelRow);

      this._labelText = document.createElement('span');
      this._labelText.setAttribute('part', 'label');
      this._labelText.classList.add(styles.labelText);

      this._labelValue = document.createElement('span');
      this._labelValue.setAttribute('part', 'value');
      this._labelValue.classList.add(styles.labelValue);

      this._labelRow.appendChild(this._labelText);
      this._labelRow.appendChild(this._labelValue);

      shadow.appendChild(this._trackHost);
      shadow.appendChild(this._labelRow);

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
    const color         = this.color;
    const shape         = this.shape;
    const label         = this.label;
    const showValue     = this.showValue;
    const value         = this.value;
    const max           = this.max;
    const isIndeterminate = this.indeterminate || value == null;

    const ratio   = isIndeterminate ? 0 : clamp(value! / max, 0, 1);
    const percent = Math.round(ratio * 100);

    // Host: color
    this._applyTo(this, this._hostPrev, 'color', color, styles.colors);

    // Track background: thickness variant + (wave shape)
    this._applyTo(this._trackBg, this._trackBgPrev, 'thickness', thickness, styles.trackBg);
    this._applyTo(this._trackBg, this._trackBgPrev, 'shape',
      shape === 'wave' ? thickness : null, styles.wave);

    // Active: thickness variant + (wave shape) + (indeterminate animation)
    this._applyTo(this._active, this._activePrev, 'thickness', thickness, styles.active);
    this._applyTo(this._active, this._activePrev, 'shape',
      shape === 'wave' ? thickness : null, styles.wave);
    this._applyTo(this._active, this._activePrev, 'indeterminate',
      isIndeterminate ? thickness : null, styles.indeterminate);

    // Active width — only set on determinate, leave class-driven on indeterminate
    if (isIndeterminate) {
      this._active.style.removeProperty('width');
    } else {
      this._active.style.width = `${ratio * 100}%`;
    }

    // Stop: thickness variant
    this._applyTo(this._stop, this._stopPrev, 'thickness', thickness, styles.stop);

    // Label row
    const showCaption = Boolean(label) || (showValue && !isIndeterminate);
    this._labelRow.hidden = !showCaption;
    this._labelText.textContent = label;
    this._labelText.hidden = !label;
    if (showValue && !isIndeterminate) {
      this._labelValue.textContent = `${percent}%`;
      this._labelValue.hidden = false;
    } else {
      this._labelValue.textContent = '';
      this._labelValue.hidden = true;
    }

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
    if (old)  el.classList.remove(...old.split(/\s+/).filter(Boolean));
    if (next) el.classList.add(...next.split(/\s+/).filter(Boolean));
    prev[prop] = next;
  }
}

customElements.define('loom-progress-linear', LoomProgressLinear);

declare global {
  interface HTMLElementTagNameMap {
    'loom-progress-linear': LoomProgressLinear;
  }
}

export { LoomProgressLinear };
