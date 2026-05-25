import * as styles from '../StepperStep.css.ts';
import { spacingVars } from '../../../../tokens/index.ts';
import type { StepperStepState } from '../StepperStep.types.ts';

const VALID_STATES = new Set<StepperStepState>(['default', 'active', 'completed']);

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

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

let _hostSheet: CSSStyleSheet | null = null;

function getHostSheet(): CSSStyleSheet | null {
  if (_hostSheet) return _hostSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${spacingVars.xs};
        width: fit-content;
        min-width: min-content;
        max-width: 96px;
        flex-shrink: 0;
        box-sizing: border-box;
      }

      :host([hidden]) {
        display: none;
      }
    `);
    _hostSheet = sheet;
    return sheet;
  } catch {
    return null;
  }
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  return [getVESheet(styles.root), getHostSheet()].filter((s): s is CSSStyleSheet => s != null);
}

// ─── LoomStepperStep ──────────────────────────────────────────────────────────

class LoomStepperStep extends HTMLElement {
  static observedAttributes = ['step', 'label', 'state'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get step(): string {
    return this.getAttribute('step') ?? '1';
  }
  set step(val: string) {
    this.setAttribute('step', val);
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  get state(): StepperStepState {
    const val = this.getAttribute('state') as StepperStepState;
    return VALID_STATES.has(val) ? val : 'default';
  }
  set state(val: StepperStepState) {
    this.setAttribute('state', val);
  }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _circleEl: HTMLDivElement | null = null;
  private _numberEl: HTMLSpanElement | null = null;
  private _checkEl: HTMLSpanElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  // ─── Prev-state (for idempotent _sync) ───────────────────────────────────

  private _prev: Record<string, string | null> = { circleState: null, numberState: null, labelState: null };

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-stepper-step] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      this._circleEl = document.createElement('div');
      this._circleEl.setAttribute('part', 'circle');
      this._circleEl.classList.add(styles.circle);

      this._numberEl = document.createElement('span');
      this._numberEl.setAttribute('part', 'number');
      this._numberEl.classList.add(styles.number);

      this._checkEl = document.createElement('span');
      this._checkEl.setAttribute('part', 'check');
      this._checkEl.setAttribute('aria-hidden', 'true');
      this._checkEl.innerHTML = CHECK_SVG;

      this._circleEl.appendChild(this._numberEl);
      this._circleEl.appendChild(this._checkEl);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.label);

      shadow.appendChild(this._circleEl);
      shadow.appendChild(this._labelEl);

      this.classList.add(styles.root);
    }
    this._sync();
  }

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
    if (!this._circleEl || !this._numberEl || !this._checkEl || !this._labelEl) return;

    const stepState = this.state;
    const isCompleted = stepState === 'completed';

    this._applyTo(this._circleEl, this._prev, 'circleState', stepState, styles.circleState as Record<string, string>);
    this._applyTo(this._numberEl, this._prev, 'numberState', stepState, styles.numberState as Record<string, string>);
    this._applyTo(this._labelEl, this._prev, 'labelState', stepState, styles.labelState as Record<string, string>);

    this._numberEl.textContent = this.step;
    this._numberEl.hidden = isCompleted;
    this._checkEl.hidden = !isCompleted;

    this._labelEl.textContent = this.label;

    this._syncA11y();
  }

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

customElements.define('loom-stepper-step', LoomStepperStep);

declare global {
  interface HTMLElementTagNameMap {
    'loom-stepper-step': LoomStepperStep;
  }
}

export { LoomStepperStep };
