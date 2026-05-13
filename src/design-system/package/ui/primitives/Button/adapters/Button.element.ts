import * as styles from '../Button.css.ts';
import * as textStyles from '../../Text/Text.css.ts';
import type { ButtonVariant, ButtonSize } from '../Button.types.ts';
import type { TextVariant } from '../../Text/Text.types.ts';
import { variantTokenMap } from '../../Text/Text.types.ts';

const labelVariant: Record<ButtonSize, TextVariant> = {
  sm: 'label-sm',
  md: 'label-md',
  lg: 'label-lg',
};

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

function getVEAdoptedStyleSheets(): CSSStyleSheet[] {
  const sheets = [
    getVESheet(styles.root),
    getVESheet(textStyles.variants[variantTokenMap[labelVariant.md]]),
  ].filter((sheet): sheet is CSSStyleSheet => sheet != null);
  return Array.from(new Set(sheets));
}

class LoomButton extends HTMLElement {
  private _inner: HTMLButtonElement | null = null;
  private _label: HTMLSpanElement | null = null;

  static observedAttributes = [
    'variant',
    'size',
    'disabled',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  get variant(): ButtonVariant {
    return (this.getAttribute('variant') as ButtonVariant) ?? 'primary';
  }
  set variant(val: ButtonVariant) {
    this.setAttribute('variant', val);
  }

  get size(): ButtonSize {
    return (this.getAttribute('size') as ButtonSize) ?? 'md';
  }
  set size(val: ButtonSize) {
    this.setAttribute('size', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    this.toggleAttribute('disabled', val);
  }

  private readonly _handleClick = (event: MouseEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-click', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  };

  private readonly _handleFocus = (event: FocusEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-focus', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  };

  private readonly _handleBlur = (event: FocusEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-blur', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  };

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
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const adopted = getVEAdoptedStyleSheets();
      if (adopted.length > 0) {
        shadow.adoptedStyleSheets = adopted;
      } else {
        console.warn('[loom-button] VE stylesheet not found - shadow styles will be missing.');
      }

      this._label = document.createElement('span');
      this._label.setAttribute('part', 'label');
      this._label.appendChild(document.createElement('slot'));

      this._inner = document.createElement('button');
      this._inner.type = 'button';
      this._inner.setAttribute('part', 'button');
      this._inner.appendChild(this._label);
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

  attributeChangedCallback(name: string) {
    if (name.startsWith('aria-')) {
      this._syncA11y();
      return;
    }
    this._scheduleSync();
  }

  private _prev: Record<string, string | null> = {
    variant: null,
    size: null,
    typographyKey: null,
  };

  private _sync(): void {
    if (!this._inner || !this._label) return;

    const variantKey = this.getAttribute('variant') ?? 'primary';
    const sizeKey = this.getAttribute('size') ?? 'md';

    this._apply(this._inner, 'variant', variantKey, styles.variant as Record<string, string>);
    this._apply(this._inner, 'size', sizeKey, styles.size as Record<string, string>);
    this._inner.disabled = this.hasAttribute('disabled');

    const textVariant = sizeKey in labelVariant
      ? labelVariant[sizeKey as ButtonSize]
      : labelVariant.md;
    const tokenKey = variantTokenMap[textVariant];
    this._apply(this._label, 'typographyKey', tokenKey, textStyles.variants as Record<string, string>);

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._inner) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const value = this.getAttribute(attr);
      if (value) this._inner?.setAttribute(attr, value);
      else this._inner?.removeAttribute(attr);
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

customElements.define('loom-button', LoomButton);

declare global {
  interface HTMLElementTagNameMap {
    'loom-button': LoomButton;
  }
}

export { LoomButton };
