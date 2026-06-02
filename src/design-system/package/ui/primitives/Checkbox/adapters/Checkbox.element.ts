import * as styles from '../Checkbox.css.ts';
import type { CheckboxState } from '../Checkbox.types.ts';
import { ICON_CHECK, ICON_DASH } from '../../../../icons/index.ts';

// ─── VE stylesheet adoption ─────────────────────────────────────────────────

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


// ─── LoomCheckbox ───────────────────────────────────────────────────────────

class LoomCheckbox extends HTMLElement {
  static formAssociated = true;
  private readonly _internals: ElementInternals;

  // ─── Shadow DOM elements ─────────────────────────────────────────────────
  private _rootEl: HTMLDivElement | null = null;
  private _boxEl: HTMLDivElement | null = null;
  private _iconEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  constructor() {
    super();
    // ElementInternals keeps checkbox value in native form submission.
    this._internals = this.attachInternals();
  }

  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = [
    'checked',
    'indeterminate',
    'disabled',
    'label',
    'name',
    'value',
    'shape',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get checked(): boolean {
    return this.hasAttribute('checked');
  }
  set checked(val: boolean) {
    this.toggleAttribute('checked', val);
  }

  get indeterminate(): boolean {
    return this.hasAttribute('indeterminate');
  }
  set indeterminate(val: boolean) {
    this.toggleAttribute('indeterminate', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    this.toggleAttribute('disabled', val);
  }

  get label(): string | null {
    return this.getAttribute('label');
  }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
  }

  get name(): string | null {
    return this.getAttribute('name');
  }
  set name(val: string | null) {
    if (val == null) this.removeAttribute('name');
    else this.setAttribute('name', val);
  }

  get value(): string {
    return this.getAttribute('value') ?? 'on';
  }
  set value(val: string) {
    this.setAttribute('value', val);
  }

  get shape(): string | null {
    return this.getAttribute('shape');
  }
  set shape(val: string | null) {
    if (val == null) this.removeAttribute('shape');
    else this.setAttribute('shape', val);
  }

  // ─── Event handlers ──────────────────────────────────────────────────────

  private readonly _handleClick = (): void => {
    if (this.disabled) return;
    this._toggle();
  };

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._toggle();
    }
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const sheets = [getVESheet(styles.box)].filter((s): s is CSSStyleSheet => s != null);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn(
          '[loom-checkbox] VE stylesheet not found — shadow styles will be missing. ' +
          'Ensure the VE bundle is loaded before the adapter.',
        );
      }

      const rootEl = document.createElement('div');
      rootEl.setAttribute('part', 'root');
      rootEl.classList.add(styles.root);
      this._rootEl = rootEl;

      this._boxEl = document.createElement('div');
      this._boxEl.setAttribute('part', 'box');
      this._boxEl.classList.add(styles.box);

      this._iconEl = document.createElement('div');
      this._iconEl.setAttribute('part', 'icon');
      this._iconEl.classList.add(styles.iconWrapper);
      this._boxEl.appendChild(this._iconEl);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.label);

      rootEl.appendChild(this._boxEl);
      rootEl.appendChild(this._labelEl);
      shadow.appendChild(rootEl);

      this._boxEl.addEventListener('click', this._handleClick);
      this._boxEl.addEventListener('keydown', this._handleKeydown);
    }

    this.setAttribute('role', 'checkbox');
    this._sync();
  }

  disconnectedCallback(): void {
    this._boxEl?.removeEventListener('click', this._handleClick);
    this._boxEl?.removeEventListener('keydown', this._handleKeydown);
  }

  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    this._scheduleSync();
  }

  // ─── Form lifecycle callbacks ────────────────────────────────────────────

  formResetCallback(): void {
    this.checked = false;
    this.indeterminate = false;
    this._internals.setFormValue(null);
    this._internals.setValidity({});
    this._sync();
  }

  formStateRestoreCallback(state: string | null): void {
    this.checked = state === 'checked';
    this._internals.setFormValue(state);
  }

  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    // Batch class/aria updates when multiple attributes flip in the same tick.
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Prev-state tracking ─────────────────────────────────────────────────

  private _prev: Record<string, string | null> = { boxState: null, boxShape: null };

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._rootEl || !this._boxEl || !this._iconEl || !this._labelEl) return;

    const isDisabled = this.disabled;
    const isChecked = this.checked;
    const isIndeterminate = this.indeterminate;
    const labelText = this.label;

    let state: CheckboxState;
    if (isDisabled) state = 'disabled';
    else if (isIndeterminate) state = 'indeterminate';
    else if (isChecked) state = 'checked';
    else state = 'default';

    this._apply(this._boxEl, 'boxState', state, styles.boxState as Record<string, string>);

    this._apply(this._boxEl, 'boxShape', this.shape, styles.boxShape as Record<string, string>);

    if (isDisabled) this._rootEl.classList.add(styles.rootDisabled);
    else this._rootEl.classList.remove(styles.rootDisabled);

    this._boxEl.setAttribute('tabindex', isDisabled ? '-1' : '0');

    const nextIcon = isIndeterminate ? ICON_DASH : isChecked ? ICON_CHECK : '';
    if (this._iconEl.innerHTML !== nextIcon) this._iconEl.innerHTML = nextIcon;

    this._labelEl.textContent = labelText ?? '';
    this._labelEl.hidden = labelText == null;
    if (isDisabled) this._labelEl.classList.add(styles.labelDisabled);
    else this._labelEl.classList.remove(styles.labelDisabled);

    this._internals.setFormValue(isChecked ? this.value : null);
    this._internals.setValidity({});

    this._syncA11y();
  }

  private _syncA11y(): void {
    const isChecked = this.checked;
    const isIndeterminate = this.indeterminate;
    const isDisabled = this.disabled;

    this.setAttribute('aria-checked', isIndeterminate ? 'mixed' : String(isChecked));
    if (isDisabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');

    // Forward aria-* from the host to the focusable internal box element.
    if (!this._boxEl) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._boxEl!.setAttribute(attr, val);
      else this._boxEl!.removeAttribute(attr);
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
    if (prev) target.classList.remove(...prev.split(/\s+/).filter(Boolean));
    if (next) target.classList.add(...next.split(/\s+/).filter(Boolean));
    this._prev[prop] = next;
  }

  // ─── Internal toggle ──────────────────────────────────────────────────────

  private _toggle(): void {
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    this.dispatchEvent(
      new CustomEvent('loom-checkbox-change', {
        bubbles: true,
        composed: true,
        detail: { checked: this.checked, indeterminate: this.indeterminate },
      }),
    );
  }
}

customElements.define('loom-checkbox', LoomCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'loom-checkbox': LoomCheckbox;
  }
}

export { LoomCheckbox };
