import * as styles from '../IconButton.css.ts';
import type { IconButtonVariant, IconButtonSize } from '../IconButton.types.ts';

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(sourceSheet: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const constructedSheet = new CSSStyleSheet();
    const cssText = Array.from(sourceSheet.cssRules).map(r => r.cssText).join('\n');
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
      if (Array.from(sheet.cssRules).some(r => r.cssText.includes(anchorClass))) {
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

function getVEAdoptedStyleSheets(): CSSStyleSheet[] {
  const sheets = [getVESheet(styles.root)].filter((s): s is CSSStyleSheet => s != null);
  return Array.from(new Set(sheets));
}

class LoomIconButton extends HTMLElement {
  private _inner: HTMLButtonElement | null = null;
  private _wasEverSelected = false;

  static observedAttributes = [
    'variant',
    'size',
    'disabled',
    'selected',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  get variant(): IconButtonVariant {
    return (this.getAttribute('variant') as IconButtonVariant) ?? 'filled';
  }
  set variant(val: IconButtonVariant) { this.setAttribute('variant', val); }

  get size(): IconButtonSize {
    return (this.getAttribute('size') as IconButtonSize) ?? 'md';
  }
  set size(val: IconButtonSize) { this.setAttribute('size', val); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { this.toggleAttribute('disabled', val); }

  get selected(): boolean { return this.hasAttribute('selected'); }
  set selected(val: boolean) { this.toggleAttribute('selected', val); }

  private readonly _handleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-click', {
      bubbles: true, composed: true, detail: {},
    }));
    this.dispatchEvent(new CustomEvent('loom-toggle', {
      bubbles: true, composed: true, detail: { selected: !this.selected },
    }));
  };

  private readonly _handleFocus = (e: FocusEvent): void => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-focus', {
      bubbles: true, composed: true, detail: {},
    }));
  };

  private readonly _handleBlur = (e: FocusEvent): void => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-blur', {
      bubbles: true, composed: true, detail: {},
    }));
  };

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const adopted = getVEAdoptedStyleSheets();
      if (adopted.length > 0) {
        shadow.adoptedStyleSheets = adopted;
      } else {
        console.warn('[loom-icon-button] VE stylesheet not found — shadow styles will be missing.');
      }

      this._inner = document.createElement('button');
      this._inner.type = 'button';
      this._inner.setAttribute('part', 'button');
      this._inner.appendChild(document.createElement('slot'));
      shadow.appendChild(this._inner);

      this.classList.add(styles.host);
      this._inner.classList.add(styles.root);

      this._inner.addEventListener('click', this._handleClick);
      this._inner.addEventListener('focus', this._handleFocus);
      this._inner.addEventListener('blur', this._handleBlur);
    }
    this._sync();
  }

  disconnectedCallback() {
    this._inner?.removeEventListener('click', this._handleClick);
    this._inner?.removeEventListener('focus', this._handleFocus);
    this._inner?.removeEventListener('blur', this._handleBlur);
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

  attributeChangedCallback(name: string) {
    if (name.startsWith('aria-')) {
      // Forward ARIA updates immediately to keep assistive metadata in sync.
      this._syncA11y();
      return;
    }
    this._scheduleSync();
  }

  private _prev: Record<string, string | null> = { variant: null, size: null };

  private _sync(): void {
    if (!this._inner) return;

    const variantKey = this.getAttribute('variant') ?? 'filled';
    const sizeKey    = this.getAttribute('size') ?? 'md';

    this._apply(this._inner, 'variant', variantKey, styles.variant as Record<string, string>);
    this._apply(this._inner, 'size',    sizeKey,    styles.size    as Record<string, string>);

    this._inner.disabled = this.hasAttribute('disabled');

    // Keeps button semantics neutral until selected is actually used as a toggle signal.
    const isSelected = this.hasAttribute('selected');
    if (isSelected) {
      this._wasEverSelected = true;
      this._inner.setAttribute('aria-pressed', 'true');
    } else if (this._wasEverSelected) {
      this._inner.setAttribute('aria-pressed', 'false');
    }

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._inner) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach(attr => {
      const val = this.getAttribute(attr);
      if (val) this._inner!.setAttribute(attr, val);
      else this._inner!.removeAttribute(attr);
    });
  }

  private _apply(
    target: Element,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const prev = this._prev[prop] ?? null;
    if (next === prev) return;
    if (prev) target.classList.remove(prev);
    if (next) target.classList.add(next);
    this._prev[prop] = next;
  }
}

customElements.define('loom-icon-button', LoomIconButton);

declare global {
  interface HTMLElementTagNameMap {
    'loom-icon-button': LoomIconButton;
  }
}

export { LoomIconButton };
