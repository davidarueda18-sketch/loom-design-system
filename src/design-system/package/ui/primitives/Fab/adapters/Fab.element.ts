import * as styles from '../Fab.css.ts';
import type { FabSize, FabContent } from '../Fab.types.ts';

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

class LoomFab extends HTMLElement {
  private _inner: HTMLButtonElement | null = null;
  private _slot: HTMLSlotElement | null = null;
  private _labelSpan: HTMLSpanElement | null = null;

  static observedAttributes = [
    'size',
    'content',
    'label',
    'disabled',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  // ─── Getters / Setters ────────────────────────────────────────────────────

  get size(): FabSize {
    return (this.getAttribute('size') as FabSize) ?? 'md';
  }
  set size(val: FabSize) {
    this.setAttribute('size', val);
  }

  get content(): FabContent {
    return (this.getAttribute('content') as FabContent) ?? 'icon';
  }
  set content(val: FabContent) {
    this.setAttribute('content', val);
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    this.toggleAttribute('disabled', val);
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private readonly _handleClick = (event: MouseEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-click', { bubbles: true, composed: true, detail: {} }));
  };

  private readonly _handleFocus = (event: FocusEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-focus', { bubbles: true, composed: true, detail: {} }));
  };

  private readonly _handleBlur = (event: FocusEvent): void => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-blur', { bubbles: true, composed: true, detail: {} }));
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const adopted = getVEAdoptedStyleSheets();
      if (adopted.length > 0) {
        shadow.adoptedStyleSheets = adopted;
      } else {
        console.warn('[loom-fab] VE stylesheet not found - shadow styles will be missing.');
      }

      // Pre-create both content nodes; _sync() determines which is active
      this._slot = document.createElement('slot');
      this._labelSpan = document.createElement('span');
      this._labelSpan.setAttribute('part', 'label');

      this._inner = document.createElement('button');
      this._inner.type = 'button';
      this._inner.setAttribute('part', 'button');
      shadow.appendChild(this._inner);

      // Host gets layout class; inner button gets all visual styles
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

  attributeChangedCallback(name: string) {
    if (name.startsWith('aria-')) {
      this._syncA11y();
      return;
    }
    this._scheduleSync();
  }

  // ─── State tracking ───────────────────────────────────────────────────────

  private _prev: Record<string, string | null> = {
    size: null,
    textLabel: null,
  };

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._inner || !this._slot || !this._labelSpan) return;

    const sizeKey = this.getAttribute('size') ?? 'md';
    const content = (this.getAttribute('content') ?? 'icon') as FabContent;
    const label = this.getAttribute('label') ?? '';

    // Size class on inner button (controls width / height / border-radius)
    this._apply(this._inner, 'size', sizeKey, styles.size as Record<string, string>);

    // Disabled → native property forwarding (Law 2)
    this._inner.disabled = this.hasAttribute('disabled');

    if (content === 'icon') {
      // Remove text label span from shadow tree if present
      if (this._inner.contains(this._labelSpan)) {
        this._inner.removeChild(this._labelSpan);
      }
      // Strip textLabel class from detached span so it's clean on next content switch
      this._apply(this._labelSpan, 'textLabel', null, styles.textLabel as Record<string, string>);
      // Append slot for icon projection
      if (!this._inner.contains(this._slot)) {
        this._inner.appendChild(this._slot);
      }
      // aria-label on inner button carries the accessible name
      this._inner.setAttribute('aria-label', label);
    } else {
      // Remove slot if present
      if (this._inner.contains(this._slot)) {
        this._inner.removeChild(this._slot);
      }
      // No aria-label needed — text is visible
      this._inner.removeAttribute('aria-label');
      // Apply typography size class and update visible text
      this._apply(this._labelSpan, 'textLabel', sizeKey, styles.textLabel as Record<string, string>);
      this._labelSpan.textContent = label;
      if (!this._inner.contains(this._labelSpan)) {
        this._inner.appendChild(this._labelSpan);
      }
    }

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._inner) return;
    ['aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const value = this.getAttribute(attr);
      if (value) this._inner!.setAttribute(attr, value);
      else this._inner!.removeAttribute(attr);
    });
  }

  // ─── Idempotent class swap ────────────────────────────────────────────────

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

customElements.define('loom-fab', LoomFab);

declare global {
  interface HTMLElementTagNameMap {
    'loom-fab': LoomFab;
  }
}

export { LoomFab };
