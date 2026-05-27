import * as styles from '../Toggle.css.ts';

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

// ─── LoomToggle — form-associated custom element ──────────────────────────────

class LoomToggle extends HTMLElement {
  // ─── Law 6: form association ─────────────────────────────────────────────
  static formAssociated = true;
  private readonly _internals: ElementInternals;

  // ─── Shadow DOM elements ─────────────────────────────────────────────────
  private _rootEl: HTMLDivElement | null = null;
  private _trackEl: HTMLDivElement | null = null;
  private _thumbEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = [
    'checked',
    'disabled',
    'label',
    'name',
    'value',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  // ─── Boolean getters/setters ──────────────────────────────────────────────

  get checked(): boolean {
    return this.hasAttribute('checked');
  }
  set checked(val: boolean) {
    this.toggleAttribute('checked', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    this.toggleAttribute('disabled', val);
  }

  // ─── String getters/setters ───────────────────────────────────────────────

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

  // ─── Event handlers ───────────────────────────────────────────────────────

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

      // Law 8: adopt VE stylesheet
      const sheets = [getVESheet(styles.track)].filter((s): s is CSSStyleSheet => s != null);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn(
          '[loom-toggle] VE stylesheet not found — shadow styles will be missing. ' +
            'Ensure the VE bundle is loaded before the adapter.',
        );
      }

      // Root flex row
      const rootEl = document.createElement('div');
      rootEl.setAttribute('part', 'root');
      rootEl.classList.add(styles.root);
      this._rootEl = rootEl;

      // Track (pill) — receives focus, click, keydown
      this._trackEl = document.createElement('div');
      this._trackEl.setAttribute('part', 'track');
      this._trackEl.classList.add(styles.track);

      // Thumb (circle) — purely visual, no interaction
      this._thumbEl = document.createElement('div');
      this._thumbEl.setAttribute('part', 'thumb');
      this._thumbEl.classList.add(styles.thumb);
      this._trackEl.appendChild(this._thumbEl);

      // Label
      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.label);

      rootEl.appendChild(this._trackEl);
      rootEl.appendChild(this._labelEl);
      shadow.appendChild(rootEl);

      this._trackEl.addEventListener('click', this._handleClick);
      this._trackEl.addEventListener('keydown', this._handleKeydown);
    }

    this.setAttribute('role', 'switch');
    this._sync();
  }

  disconnectedCallback(): void {
    this._trackEl?.removeEventListener('click', this._handleClick);
    this._trackEl?.removeEventListener('keydown', this._handleKeydown);
  }

  // Law 4: aria-* bypass RAF
  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    this._scheduleSync();
  }

  // ─── Form lifecycle ───────────────────────────────────────────────────────

  formResetCallback(): void {
    this.checked = false;
    this._internals.setFormValue(null);
    this._internals.setValidity({});
    this._sync();
  }

  formStateRestoreCallback(state: string | null): void {
    this.checked = state !== null;
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
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Prev-state ───────────────────────────────────────────────────────────

  private _prev: Record<string, string | null> = {
    trackState: null,
    thumbState: null,
  };

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._rootEl || !this._trackEl || !this._thumbEl || !this._labelEl) return;

    const isDisabled = this.disabled;
    const isChecked = this.checked;
    const labelText = this.label;

    // Track state
    const trackKey = isDisabled ? 'disabled' : isChecked ? 'on' : 'off';
    this._apply(this._trackEl, 'trackState', trackKey, styles.trackState as Record<string, string>);

    // Thumb state (4 variants: off, on, disabledOff, disabledOn)
    const thumbKey = isDisabled
      ? isChecked ? 'disabledOn' : 'disabledOff'
      : isChecked ? 'on' : 'off';
    this._apply(this._thumbEl, 'thumbState', thumbKey, styles.thumbState as Record<string, string>);

    // Root cursor
    if (isDisabled) this._rootEl.classList.add(styles.rootDisabled);
    else this._rootEl.classList.remove(styles.rootDisabled);

    // Focus: disabled tracks are not focusable
    this._trackEl.setAttribute('tabindex', isDisabled ? '-1' : '0');

    // Label
    this._labelEl.textContent = labelText ?? '';
    this._labelEl.hidden = labelText == null;

    if (isDisabled) {
      this._labelEl.classList.add(styles.labelDisabled);
      this._labelEl.classList.remove(styles.labelOn);
    } else if (isChecked) {
      this._labelEl.classList.add(styles.labelOn);
      this._labelEl.classList.remove(styles.labelDisabled);
    } else {
      this._labelEl.classList.remove(styles.labelOn, styles.labelDisabled);
    }

    // Form value
    this._internals.setFormValue(isChecked ? this.value : null);
    this._internals.setValidity({});

    this._syncA11y();
  }

  private _syncA11y(): void {
    const isChecked = this.checked;
    const isDisabled = this.disabled;

    this.setAttribute('aria-checked', String(isChecked));
    if (isDisabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');

    if (!this._trackEl) return;
    (['aria-label', 'aria-labelledby', 'aria-describedby'] as const).forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._trackEl!.setAttribute(attr, val);
      else this._trackEl!.removeAttribute(attr);
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
    if (prev) target.classList.remove(...prev.split(/\s+/).filter(Boolean));
    if (next) target.classList.add(...next.split(/\s+/).filter(Boolean));
    this._prev[prop] = next;
  }

  // ─── Internal toggle ──────────────────────────────────────────────────────

  private _toggle(): void {
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent('loom-toggle-change', {
        bubbles: true,
        composed: true,
        detail: { checked: this.checked },
      }),
    );
  }
}

customElements.define('loom-toggle', LoomToggle);

declare global {
  interface HTMLElementTagNameMap {
    'loom-toggle': LoomToggle;
  }
}

export { LoomToggle };
