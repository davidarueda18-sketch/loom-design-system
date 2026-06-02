import '../menu/adapters/SelectMenu.element.ts';
import * as styles from '../Select.css.ts';
import * as menuStyles from '../menu/SelectMenu.css.ts';
import type { SelectState, SelectChangeEventDetail } from '../Select.types.ts';
import { ICON_CHEVRON_DOWN } from '../../../../icons/index.ts';

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
        position: relative;
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
  // Deduplicate because Vite/VE can merge component styles into a shared stylesheet.
  const seen = new Set<CSSStyleSheet>();
  const result: CSSStyleSheet[] = [];
  for (const sheet of [
    getVESheet(styles.trigger),
    getVESheet(menuStyles.panel),
    getHostSheet(),
  ]) {
    if (sheet && !seen.has(sheet)) {
      seen.add(sheet);
      result.push(sheet);
    }
  }
  return result;
}



// ─── LoomSelect ──────────────────────────────────────────────────────────────

class LoomSelect extends HTMLElement {
  static formAssociated = true;
  private readonly _internals: ElementInternals;

  // ─── Shadow DOM elements ─────────────────────────────────────────────────
  private _labelEl: HTMLDivElement | null = null;
  private _triggerEl: HTMLButtonElement | null = null;
  private _valueEl: HTMLSpanElement | null = null;
  private _chevronEl: HTMLSpanElement | null = null;
  private _menuEl: HTMLElement | null = null;
  private _slotEl: HTMLSlotElement | null = null;
  private _errorEl: HTMLDivElement | null = null;

  // ─── Internal state ───────────────────────────────────────────────────────
  private _open = false;
  private _activeIndex = -1;
  private _uid = `select-${Math.random().toString(36).slice(2, 8)}`;

  constructor() {
    super();
    // ElementInternals makes the selected value participate in native FormData.
    this._internals = this.attachInternals();
  }

  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = [
    'label',
    'placeholder',
    'value',
    'name',
    'disabled',
    'readonly',
    'error',
    'error-message',
    'open',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  // ─── Getters / Setters ────────────────────────────────────────────────────

  get label(): string | null { return this.getAttribute('label'); }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
  }

  get placeholder(): string | null { return this.getAttribute('placeholder'); }
  set placeholder(val: string | null) {
    if (val == null) this.removeAttribute('placeholder');
    else this.setAttribute('placeholder', val);
  }

  get value(): string { return this.getAttribute('value') ?? ''; }
  set value(val: string) { this.setAttribute('value', val); }

  get name(): string | null { return this.getAttribute('name'); }
  set name(val: string | null) {
    if (val == null) this.removeAttribute('name');
    else this.setAttribute('name', val);
  }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { this.toggleAttribute('disabled', val); }

  get error(): boolean { return this.hasAttribute('error'); }
  set error(val: boolean) { this.toggleAttribute('error', val); }

  get errorMessage(): string | null { return this.getAttribute('error-message'); }
  set errorMessage(val: string | null) {
    if (val == null) this.removeAttribute('error-message');
    else this.setAttribute('error-message', val);
  }

  get open(): boolean { return this._open; }
  set open(val: boolean) {
    this._open = val;
    this.toggleAttribute('open', val);
    this._scheduleSync();
  }

  // ─── Event handlers (Law 7: named private arrows for cleanup) ────────────

  private readonly _handleTriggerClick = (): void => {
    if (this.disabled) return;
    if (this._open) this._closeMenu();
    else this._openMenu();
  };

  private readonly _handleTriggerKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this._open) this._openMenu();
        else this._navigateOptions('next');
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this._open) this._navigateOptions('prev');
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (!this._open) {
          this._openMenu();
        } else if (this._activeIndex >= 0) {
          const opts = this._getEnabledOptions();
          const active = opts[this._activeIndex];
          if (active) {
            const val = active.getAttribute('value') ?? '';
            const lbl = active.getAttribute('label') ?? active.textContent?.trim() ?? '';
            this._selectValue(val, lbl);
          }
        }
        break;
      case 'Home':
        e.preventDefault();
        if (this._open) this._navigateOptions('first');
        break;
      case 'End':
        e.preventDefault();
        if (this._open) this._navigateOptions('last');
        break;
      case 'Escape':
        e.preventDefault();
        this._closeMenu();
        break;
    }
  };

  private readonly _handleOptionSelect = (e: Event): void => {
    const detail = (e as CustomEvent<SelectChangeEventDetail>).detail;
    this._selectValue(detail.value, detail.label);
  };

  private readonly _handleFocusOut = (e: FocusEvent): void => {
    if (!this._open) return;
    if (!this.contains(e.relatedTarget as Node | null)) {
      this._closeMenu();
    }
  };

  private readonly _handleSlotChange = (): void => {
    this._updateOptions();
    this._updateDisplayValue();
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;

      this._labelEl = document.createElement('div');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.label);
      this._labelEl.hidden = true;

      this._triggerEl = document.createElement('button');
      this._triggerEl.type = 'button';
      this._triggerEl.setAttribute('part', 'trigger');
      this._triggerEl.classList.add(styles.trigger);
      this._triggerEl.setAttribute('role', 'combobox');
      this._triggerEl.setAttribute('aria-expanded', 'false');
      this._triggerEl.setAttribute('aria-haspopup', 'listbox');
      this._triggerEl.setAttribute('aria-controls', `${this._uid}-listbox`);

      this._valueEl = document.createElement('span');
      this._valueEl.setAttribute('part', 'value');
      this._valueEl.classList.add(styles.value, styles.valuePlaceholder);

      this._chevronEl = document.createElement('span');
      this._chevronEl.setAttribute('part', 'chevron');
      this._chevronEl.classList.add(styles.chevron);
      this._chevronEl.setAttribute('aria-hidden', 'true');
      this._chevronEl.innerHTML = ICON_CHEVRON_DOWN;

      this._triggerEl.appendChild(this._valueEl);
      this._triggerEl.appendChild(this._chevronEl);

      this._menuEl = document.createElement('loom-select-menu');
      this._menuEl.setAttribute('part', 'menu');
      this._menuEl.id = `${this._uid}-listbox`;
      this._menuEl.setAttribute('role', 'listbox');
      this._menuEl.classList.add(menuStyles.panel);
      this._menuEl.hidden = true;

      this._slotEl = document.createElement('slot');
      this._menuEl.appendChild(this._slotEl);

      this._errorEl = document.createElement('div');
      this._errorEl.setAttribute('part', 'error');
      this._errorEl.classList.add(styles.errorMessage);
      this._errorEl.hidden = true;

      shadow.appendChild(this._labelEl);
      shadow.appendChild(this._triggerEl);
      shadow.appendChild(this._menuEl);
      shadow.appendChild(this._errorEl);

      this._triggerEl.addEventListener('click', this._handleTriggerClick);
      this._triggerEl.addEventListener('keydown', this._handleTriggerKeydown);
      this._slotEl.addEventListener('slotchange', this._handleSlotChange);
      this.addEventListener('loom-option-select', this._handleOptionSelect);
      this.addEventListener('focusout', this._handleFocusOut);
    }

    this._sync();
  }

  disconnectedCallback(): void {
    this._triggerEl?.removeEventListener('click', this._handleTriggerClick);
    this._triggerEl?.removeEventListener('keydown', this._handleTriggerKeydown);
    this._slotEl?.removeEventListener('slotchange', this._handleSlotChange);
    this.removeEventListener('loom-option-select', this._handleOptionSelect);
    this.removeEventListener('focusout', this._handleFocusOut);
  }

  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    if (name === 'open') {
      this._open = this.hasAttribute('open');
      if (!this._open) this._clearFocusedOption();
    }
    this._scheduleSync();
  }

  // ─── Form lifecycle ──────────────────────────────────────────────────────

  formResetCallback(): void {
    this.value = '';
    this._internals.setFormValue(null);
    this._internals.setValidity({});
    this._updateOptions();
    this._updateDisplayValue();
    this._closeMenu();
  }

  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
    this._internals.setFormValue(state);
    this._updateOptions();
    this._updateDisplayValue();
  }

  checkValidity(): boolean { return this._internals.checkValidity(); }
  reportValidity(): boolean { return this._internals.reportValidity(); }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    // Batch attribute/property churn before mutating classes and ARIA state.
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Prev-state tracking ─────────────────────────────────────────────────

  private _prev: Record<string, string | null> = { triggerState: null };

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

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._triggerEl) return;

    let state: SelectState;
    if (this.disabled) state = 'disabled';
    else if (this._open) state = 'open';
    else if (this.error) state = 'error';
    else state = 'default';

    this._apply(this._triggerEl, 'triggerState', state, styles.triggerState as Record<string, string>);

    if (this._labelEl) {
      const lbl = this.label ?? '';
      this._labelEl.textContent = lbl;
      this._labelEl.hidden = !lbl;
    }

    this._updateDisplayValue();

    if (this._open) this._chevronEl?.classList.add(styles.chevronOpen);
    else this._chevronEl?.classList.remove(styles.chevronOpen);

    if (this._menuEl) this._menuEl.hidden = !this._open;

    this._triggerEl.disabled = this.disabled;
    this._triggerEl.setAttribute('aria-expanded', String(this._open));

    if (this._errorEl) {
      const errText = this.errorMessage ?? '';
      this._errorEl.textContent = errText;
      this._errorEl.hidden = !(this.error && errText);
    }

    this._internals.setFormValue(this.value || null);
    this._internals.setValidity({});

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._triggerEl) return;
    // Public ARIA labels live on the host but assistive tech targets the combobox button.
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._triggerEl!.setAttribute(attr, val);
      else this._triggerEl!.removeAttribute(attr);
    });
  }

  // ─── Options helpers ──────────────────────────────────────────────────────

  private _getAllOptions(): HTMLElement[] {
    if (!this._slotEl) return [];
    return Array.from(this._slotEl.assignedElements()).filter(
      (el): el is HTMLElement => el.tagName.toLowerCase() === 'loom-select-option',
    );
  }

  private _getEnabledOptions(): HTMLElement[] {
    return this._getAllOptions().filter((opt) => !opt.hasAttribute('disabled'));
  }

  private _updateOptions(): void {
    const options = this._getAllOptions();
    const current = this.value;
    options.forEach((opt, i) => {
      // Stable ids are required for aria-activedescendant during keyboard navigation.
      if (!opt.id) opt.id = `${this._uid}-opt-${i}`;
      if (current !== '' && opt.getAttribute('value') === current) {
        opt.setAttribute('selected', '');
      } else {
        opt.removeAttribute('selected');
      }
    });
  }

  private _updateDisplayValue(): void {
    if (!this._valueEl) return;
    const options = this._getAllOptions();
    const selected = options.find(
      (opt) => this.value !== '' && opt.getAttribute('value') === this.value,
    );
    const lbl = selected?.getAttribute('label') ?? selected?.textContent?.trim() ?? '';
    this._valueEl.textContent = lbl || this.placeholder || '';
    if (lbl) this._valueEl.classList.remove(styles.valuePlaceholder);
    else this._valueEl.classList.add(styles.valuePlaceholder);
  }

  // ─── Open / close ─────────────────────────────────────────────────────────

  private _openMenu(): void {
    this._open = true;
    this.setAttribute('open', '');
    this._activeIndex = -1;

    // Pre-focus the selected option so keyboard users resume from the current value.
    const enabled = this._getEnabledOptions();
    const all = this._getAllOptions();
    const selectedOpt = all.find((opt) => opt.hasAttribute('selected'));
    if (selectedOpt) {
      const idx = enabled.indexOf(selectedOpt);
      if (idx >= 0) this._setFocusedOption(idx);
    }

    this._sync();

    this.dispatchEvent(
      new CustomEvent('loom-select-open', {
        bubbles: true,
        composed: true,
        detail: { open: true },
      }),
    );
  }

  private _closeMenu(): void {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute('open');
    this._clearFocusedOption();
    this._sync();
    this._triggerEl?.focus();

    this.dispatchEvent(
      new CustomEvent('loom-select-close', {
        bubbles: true,
        composed: true,
        detail: { open: false },
      }),
    );
  }

  // ─── Keyboard navigation ──────────────────────────────────────────────────

  private _setFocusedOption(index: number): void {
    const options = this._getEnabledOptions();
    options.forEach((opt, i) => {
      if (i === index) opt.setAttribute('data-focused', '');
      else opt.removeAttribute('data-focused');
    });
    this._activeIndex = index;

    const activeOpt = options[index];
    if (activeOpt && this._triggerEl) {
      this._triggerEl.setAttribute('aria-activedescendant', activeOpt.id || '');
    }

    activeOpt?.scrollIntoView?.({ block: 'nearest' });
  }

  private _clearFocusedOption(): void {
    this._getAllOptions().forEach((opt) => opt.removeAttribute('data-focused'));
    this._activeIndex = -1;
    this._triggerEl?.removeAttribute('aria-activedescendant');
  }

  private _navigateOptions(direction: 'next' | 'prev' | 'first' | 'last'): void {
    const options = this._getEnabledOptions();
    if (options.length === 0) return;

    let next: number;
    const curr = this._activeIndex;
    if (direction === 'next') next = curr < options.length - 1 ? curr + 1 : 0;
    else if (direction === 'prev') next = curr > 0 ? curr - 1 : options.length - 1;
    else if (direction === 'first') next = 0;
    else next = options.length - 1;

    this._setFocusedOption(next);
  }

  // ─── Select a value ───────────────────────────────────────────────────────

  private _selectValue(value: string, label: string): void {
    this.value = value;
    this._updateOptions();
    this._updateDisplayValue();
    this._internals.setFormValue(value || null);

    this.dispatchEvent(
      new CustomEvent<SelectChangeEventDetail>('loom-select-change', {
        bubbles: true,
        composed: true,
        detail: { value, label },
      }),
    );

    this._closeMenu();
  }
}

customElements.define('loom-select', LoomSelect);

declare global {
  interface HTMLElementTagNameMap {
    'loom-select': LoomSelect;
  }
}

export { LoomSelect };
