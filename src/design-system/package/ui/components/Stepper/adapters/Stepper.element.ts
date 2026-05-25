import '../../../primitives/StepperStep/adapters/StepperStep.element.ts';
import * as styles from '../Stepper.css.ts';
import type { StepperState } from '../Stepper.types.ts';

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
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
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

// ─── LoomStepper ─────────────────────────────────────────────────────────────

class LoomStepper extends HTMLElement {
  static observedAttributes = ['steps', 'current'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get steps(): string[] {
    try {
      const parsed = JSON.parse(this.getAttribute('steps') ?? '[]');
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  set steps(val: string[] | string) {
    this.setAttribute('steps', Array.isArray(val) ? JSON.stringify(val) : val);
  }

  get current(): number {
    const val = parseInt(this.getAttribute('current') ?? '0', 10);
    return Number.isNaN(val) ? 0 : val;
  }
  set current(val: number) {
    this.setAttribute('current', String(val));
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-stepper] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }
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
    const shadow = this.shadowRoot;
    if (!shadow) return;

    const steps = this.steps;
    const current = this.current;

    // Clear and rebuild shadow contents
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

    steps.forEach((stepLabel, index) => {
      const state: StepperState =
        index < current ? 'completed' : index === current ? 'active' : 'default';

      const stepEl = document.createElement('loom-stepper-step');
      stepEl.setAttribute('step', String(index + 1));
      stepEl.setAttribute('label', stepLabel);
      stepEl.setAttribute('state', state);
      stepEl.style.cursor = 'pointer';
      stepEl.setAttribute('role', 'button');
      stepEl.setAttribute('tabindex', '0');
      stepEl.setAttribute('aria-label', `Paso ${index + 1}: ${stepLabel}`);

      stepEl.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('loom-stepper-change', {
            bubbles: true,
            composed: true,
            detail: { step: index },
          }),
        );
      });

      stepEl.addEventListener('keydown', (e: Event) => {
        const ke = e as KeyboardEvent;
        if (ke.key === 'Enter' || ke.key === ' ') {
          ke.preventDefault();
          this.dispatchEvent(
            new CustomEvent('loom-stepper-change', {
              bubbles: true,
              composed: true,
              detail: { step: index },
            }),
          );
        }
      });

      shadow.appendChild(stepEl);

      // Connector between steps (not after the last one)
      if (index < steps.length - 1) {
        const connectorState: StepperState =
          index < current ? 'completed' : index === current ? 'active' : 'default';

        const connectorEl = document.createElement('div');
        connectorEl.setAttribute('part', 'connector');
        connectorEl.classList.add(
          styles.connector,
          styles.connectorState[connectorState],
        );
        shadow.appendChild(connectorEl);
      }
    });
  }
}

customElements.define('loom-stepper', LoomStepper);

declare global {
  interface HTMLElementTagNameMap {
    'loom-stepper': LoomStepper;
  }
}

export { LoomStepper };
