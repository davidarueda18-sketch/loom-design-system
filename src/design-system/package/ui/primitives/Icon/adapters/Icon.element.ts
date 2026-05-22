import * as styles from '../Icon.css.ts';
import type { IconSize, IconColor } from '../Icon.types.ts';
import { colorVars } from '../../../../tokens/index.ts';

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(sourceSheet: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const constructedSheet = new CSSStyleSheet();
    const cssText = Array.from(sourceSheet.cssRules)
      .map((rule) => rule.cssText)
      .join('\n');
    constructedSheet.replaceSync(cssText);
    return constructedSheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((rule) => rule.cssText.includes(anchorClass))) {
        _sheetCache[anchorClass] = cloneAsConstructedSheet(sheet as CSSStyleSheet);
        return _sheetCache[anchorClass];
      }
    } catch {
      // Cross-origin stylesheets are not readable and should be skipped.
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

let _slottedSheet: CSSStyleSheet | null = null;

function getSlottedSvgSheet(): CSSStyleSheet | null {
  if (_slottedSheet) return _slottedSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        flex-shrink: 0;
        line-height: 0;
        color: inherit;
      }
      ::slotted(svg) {
        width: 100% !important;
        height: 100% !important;
        display: block;
        fill: currentColor;
        stroke: currentColor;
      }
    `);
    _slottedSheet = sheet;
    return sheet;
  } catch {
    return null;
  }
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  const sheets = [getVESheet(styles.root), getSlottedSvgSheet()]
    .filter((sheet): sheet is CSSStyleSheet => sheet != null);
  return Array.from(new Set(sheets));
}

const isColorTokenKey = (key: string): key is IconColor =>
  key in (colorVars as Record<string, string>);

class LoomIcon extends HTMLElement {
  static observedAttributes = ['size', 'color', 'label'] as const;

  get size(): IconSize {
    return (this.getAttribute('size') as IconSize) ?? 'md';
  }
  set size(val: IconSize) {
    this.setAttribute('size', val);
  }

  get color(): IconColor | null {
    return this.getAttribute('color') as IconColor | null;
  }
  set color(val: IconColor | null) {
    if (val == null) this.removeAttribute('color');
    else this.setAttribute('color', val);
  }

  get label(): string | null {
    return this.getAttribute('label');
  }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
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

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const adopted = getAdoptedStyleSheets();
      if (adopted.length > 0) {
        shadow.adoptedStyleSheets = adopted;
      } else {
        console.warn('[loom-icon] VE stylesheet not found - shadow styles will be missing.');
      }

      shadow.appendChild(document.createElement('slot'));

      this.classList.add(styles.root);
    }
    this._sync();
  }

  attributeChangedCallback() {
    this._scheduleSync();
  }

  private _prev: Record<string, string | null> = {
    size: null,
  };

  private _sync(): void {
    const sizeKey = this.getAttribute('size') ?? 'md';
    this._apply('size', sizeKey, styles.size as Record<string, string>);
    this._syncColor();
    this._syncA11y();
  }

  private _syncColor(): void {
    const key = this.getAttribute('color');
    if (key && isColorTokenKey(key)) {
      this.style.color = (colorVars as Record<string, string>)[key];
    } else {
      this.style.removeProperty('color');
    }
  }

  private _syncA11y(): void {
    const label = this.getAttribute('label');
    if (label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
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

customElements.define('loom-icon', LoomIcon);

declare global {
  interface HTMLElementTagNameMap {
    'loom-icon': LoomIcon;
  }
}

export { LoomIcon };
