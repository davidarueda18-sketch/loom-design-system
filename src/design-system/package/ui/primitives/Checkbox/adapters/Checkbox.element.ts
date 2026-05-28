import * as styles from '../Checkbox.css.ts';
import type { CheckboxState } from '../Checkbox.types.ts';
import { ICON_CHECK, ICON_DASH } from '../../../../icons/index.ts';

// ─── Law 8: module-level VE sheet cache ───────────────────────────────────────

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


// ─── LoomCheckbox — Template C (form-associated) ─────────────────────────────

class LoomCheckbox extends HTMLElement {
  // ─── Law 6: form association ─────────────────────────────────────────────
  static formAssociated = true;
  private readonly _internals: ElementInternals;

  // ─── Shadow DOM elements ─────────────────────────────────────────────────
  private _rootEl: HTMLDivElement | null = null;
  private _boxEl: HTMLDivElement | null = null;
  private _iconEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  // constructor is REQUIRED for form-associated elements
  constructor() {
    super();
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

  // ─── Getters / Setters — boolean attributes (Law 2) ──────────────────────

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

  // ─── Getters / Setters — string attributes (Law 2) ───────────────────────

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

  // ─── Event handlers — private readonly arrows (Law 7) ────────────────────

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
      // Law 6: delegatesFocus forwards host focus → first focusable element inside
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      // Law 8: adopt VE stylesheet into shadow root
      const sheets = [getVESheet(styles.box)].filter((s): s is CSSStyleSheet => s != null);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn(
          '[loom-checkbox] VE stylesheet not found — shadow styles will be missing. ' +
          'Ensure the VE bundle is loaded before the adapter.',
        );
      }

      // Outer flex row (root)
      const rootEl = document.createElement('div');
      rootEl.setAttribute('part', 'root');
      rootEl.classList.add(styles.root);
      this._rootEl = rootEl;

      // Visual box
      this._boxEl = document.createElement('div');
      this._boxEl.setAttribute('part', 'box');
      this._boxEl.classList.add(styles.box);

      // Icon container (check / dash)
      this._iconEl = document.createElement('div');
      this._iconEl.setAttribute('part', 'icon');
      this._iconEl.classList.add(styles.iconWrapper);
      this._boxEl.appendChild(this._iconEl);

      // Label text
      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.label);

      rootEl.appendChild(this._boxEl);
      rootEl.appendChild(this._labelEl);
      shadow.appendChild(rootEl);

      // Law 7: named references for cleanup in disconnectedCallback
      this._boxEl.addEventListener('click', this._handleClick);
      this._boxEl.addEventListener('keydown', this._handleKeydown);
    }

    // role + form state on first connect
    this.setAttribute('role', 'checkbox');
    this._sync();
  }

  // Law 7: remove listeners to prevent memory leaks
  disconnectedCallback(): void {
    this._boxEl?.removeEventListener('click', this._handleClick);
    this._boxEl?.removeEventListener('keydown', this._handleKeydown);
  }

  // Law 4: aria-* must bypass RAF — a11y cannot wait for the next frame
  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    this._scheduleSync();
  }

  // ─── Form lifecycle callbacks (Law 6 / Template C) ───────────────────────

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

  // ─── Batching (Law 4) ─────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Prev-state — one entry per token attribute (Law 4) ───────────────────

  private _prev: Record<string, string | null> = { boxState: null, boxShape: null };

  // ─── Sync (Laws 3, 4, 6) ─────────────────────────────────────────────────

  private _sync(): void {
    if (!this._rootEl || !this._boxEl || !this._iconEl || !this._labelEl) return;

    const isDisabled = this.disabled;
    const isChecked = this.checked;
    const isIndeterminate = this.indeterminate;
    const labelText = this.label;

    // Resolve visual state — Law 3: validate key in classMap
    let state: CheckboxState;
    if (isDisabled) state = 'disabled';
    else if (isIndeterminate) state = 'indeterminate';
    else if (isChecked) state = 'checked';
    else state = 'default';

    // Apply Vanilla Extract state variant — idempotent via _apply (Law 4)
    this._apply(this._boxEl, 'boxState', state, styles.boxState as Record<string, string>);

    // Shape variant — circle overrides default square border-radius
    this._apply(this._boxEl, 'boxShape', this.shape, styles.boxShape as Record<string, string>);

    // Disabled cursor on root row so the entire hit area shows not-allowed
    if (isDisabled) this._rootEl.classList.add(styles.rootDisabled);
    else this._rootEl.classList.remove(styles.rootDisabled);

    // Tab focus: disabled boxes are not focusable
    this._boxEl.setAttribute('tabindex', isDisabled ? '-1' : '0');

    // Icon: check / dash / empty — diff to avoid unnecessary innerHTML writes
    const nextIcon = isIndeterminate ? ICON_DASH : isChecked ? ICON_CHECK : '';
    if (this._iconEl.innerHTML !== nextIcon) this._iconEl.innerHTML = nextIcon;

    // Label
    this._labelEl.textContent = labelText ?? '';
    this._labelEl.hidden = labelText == null;
    if (isDisabled) this._labelEl.classList.add(styles.labelDisabled);
    else this._labelEl.classList.remove(styles.labelDisabled);

    // Form value — sync into ElementInternals
    this._internals.setFormValue(isChecked ? this.value : null);
    this._internals.setValidity({});

    // Accessibility
    this._syncA11y();
  }

  // Law 6: forward aria-* from host to box synchronously
  private _syncA11y(): void {
    // Host aria state
    const isChecked = this.checked;
    const isIndeterminate = this.indeterminate;
    const isDisabled = this.disabled;

    this.setAttribute('aria-checked', isIndeterminate ? 'mixed' : String(isChecked));
    if (isDisabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');

    // Forward aria-label/labelledby/describedby to the box part
    if (!this._boxEl) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._boxEl!.setAttribute(attr, val);
      else this._boxEl!.removeAttribute(attr);
    });
  }

  // Law 4: idempotent class swap with early-return on no-change
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
