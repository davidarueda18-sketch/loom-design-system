import '../../../primitives/TabItem/adapters/TabItem.element.ts';
import * as styles from '../TabGroup.css.ts';

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
        display: block;
        box-sizing: border-box;
      }
      :host([hidden]) { display: none; }
    `);
    _hostSheet = sheet;
    return sheet;
  } catch {
    return null;
  }
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  const seen = new Set<CSSStyleSheet>();
  const result: CSSStyleSheet[] = [];
  for (const sheet of [getVESheet(styles.root), getHostSheet()]) {
    if (sheet && !seen.has(sheet)) {
      seen.add(sheet);
      result.push(sheet);
    }
  }
  return result;
}

// ─── LoomTabGroup ─────────────────────────────────────────────────────────────

class LoomTabGroup extends HTMLElement {
  // ─── Shadow DOM elements ─────────────────────────────────────────────────
  private _slotEl: HTMLSlotElement | null = null;

  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = ['active'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get active(): string {
    return this.getAttribute('active') ?? '';
  }
  set active(val: string) {
    this.setAttribute('active', val);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private _getTabItems(): Element[] {
    if (!this._slotEl) return [];
    return Array.from(this._slotEl.assignedElements()).filter(
      (el) => el.tagName.toLowerCase() === 'loom-tab-item',
    );
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private readonly _handleSlotChange = (): void => {
    this._sync();
  };

  private readonly _handleTabItemSelect = (e: Event): void => {
    const detail = (e as CustomEvent<{ value: string }>).detail;
    const newValue = detail.value;
    if (newValue === this.active) return;
    this.active = newValue;
    this.dispatchEvent(
      new CustomEvent('loom-tab-group-change', {
        bubbles: true,
        composed: true,
        detail: { value: newValue },
      }),
    );
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      }

      const rootEl = document.createElement('div');
      rootEl.setAttribute('part', 'root');
      rootEl.setAttribute('role', 'tablist');
      rootEl.classList.add(styles.root);

      const slotEl = document.createElement('slot');
      rootEl.appendChild(slotEl);
      shadow.appendChild(rootEl);
      this._slotEl = slotEl;

      slotEl.addEventListener('slotchange', this._handleSlotChange);
      this.addEventListener('loom-tab-item-select', this._handleTabItemSelect);
    }

    this._sync();
  }

  disconnectedCallback(): void {
    this._slotEl?.removeEventListener('slotchange', this._handleSlotChange);
    this.removeEventListener('loom-tab-item-select', this._handleTabItemSelect);
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
    const activeValue = this.active;
    for (const item of this._getTabItems()) {
      const itemValue = item.getAttribute('value') ?? '';
      item.toggleAttribute('active', itemValue === activeValue);
    }
  }
}

customElements.define('loom-tab-group', LoomTabGroup);

export { LoomTabGroup };
