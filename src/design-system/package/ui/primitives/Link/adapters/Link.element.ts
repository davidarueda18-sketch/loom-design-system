import * as styles from '../Link.css.ts';
import type { LinkColor, LinkUnderline } from '../Link.types.ts';

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
  const sheets = [getVESheet(styles.root)].filter(
    (sheet): sheet is CSSStyleSheet => sheet != null,
  );
  return Array.from(new Set(sheets));
}

class LoomLink extends HTMLElement {
  private _inner: HTMLAnchorElement | null = null;
  private _slot: HTMLSlotElement | null = null;

  static observedAttributes = [
    'color',
    'underline',
    'href',
    'target',
    'rel',
    'download',
    'aria-disabled',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  get color(): LinkColor {
    return (this.getAttribute('color') as LinkColor) ?? 'default';
  }
  set color(val: LinkColor) {
    this.setAttribute('color', val);
  }

  get underline(): LinkUnderline {
    return (this.getAttribute('underline') as LinkUnderline) ?? 'always';
  }
  set underline(val: LinkUnderline) {
    this.setAttribute('underline', val);
  }

  get href(): string {
    return this.getAttribute('href') ?? '';
  }
  set href(val: string) {
    this.setAttribute('href', val);
  }

  get disabled(): boolean {
    return this.getAttribute('aria-disabled') === 'true';
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }

  private readonly _handleClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-click', {
      bubbles: true,
      composed: true,
      detail: { href: this.href },
    }));
  };

  private readonly _handleFocus = (event: FocusEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-focus', { bubbles: true, composed: true, detail: {} }));
  };

  private readonly _handleBlur = (event: FocusEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-blur', { bubbles: true, composed: true, detail: {} }));
  };

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const adopted = getVEAdoptedStyleSheets();
      if (adopted.length > 0) {
        shadow.adoptedStyleSheets = adopted;
      } else {
        console.warn('[loom-link] VE stylesheet not found - shadow styles will be missing.');
      }

      this._slot = document.createElement('slot');
      this._inner = document.createElement('a');
      this._inner.setAttribute('part', 'link');
      this._inner.classList.add(styles.root);
      this._inner.appendChild(this._slot);
      shadow.appendChild(this._inner);

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
      this._syncA11y();
      return;
    }
    this._scheduleSync();
  }

  private _prev: Record<string, string | null> = {
    color: null,
    underline: null,
  };

  private _sync(): void {
    if (!this._inner) return;

    const colorKey = this.getAttribute('color') ?? 'default';
    const underlineKey = this.getAttribute('underline') ?? 'always';

    this._apply(this._inner, 'color', colorKey, styles.color as Record<string, string>);
    this._apply(this._inner, 'underline', underlineKey, styles.underline as Record<string, string>);

    this._syncLinkAttrs();
    this._syncA11y();
  }

  private _syncLinkAttrs(): void {
    if (!this._inner) return;

    const disabled = this.disabled;
    const href = this.getAttribute('href');
    if (href && !disabled) this._inner.setAttribute('href', href);
    else this._inner.removeAttribute('href');

    ['target', 'rel', 'download'].forEach((attr) => {
      const value = this.getAttribute(attr);
      if (value) this._inner!.setAttribute(attr, value);
      else this._inner!.removeAttribute(attr);
    });

    if (disabled) {
      this._inner.setAttribute('aria-disabled', 'true');
      this._inner.tabIndex = -1;
    } else {
      this._inner.removeAttribute('aria-disabled');
      this._inner.removeAttribute('tabindex');
    }
  }

  private _syncA11y(): void {
    if (!this._inner) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const value = this.getAttribute(attr);
      if (value) this._inner!.setAttribute(attr, value);
      else this._inner!.removeAttribute(attr);
    });
    this._syncLinkAttrs();
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

customElements.define('loom-link', LoomLink);

declare global {
  interface HTMLElementTagNameMap {
    'loom-link': LoomLink;
  }
}

export { LoomLink };
