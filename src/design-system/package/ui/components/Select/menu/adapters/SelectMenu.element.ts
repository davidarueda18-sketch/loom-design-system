import '../../../../primitives/Icon/adapters/Icon.element.ts';
import * as styles from '../SelectMenu.css.ts';
import { ICON_CHECK } from '../../../../../icons/index.ts';

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

// ─── LoomSelectOption ─────────────────────────────────────────────────────────

class LoomSelectOption extends HTMLElement {
  static observedAttributes = [
    'value',
    'label',
    'disabled',
    'description',
    'leading-icon',
    'selected',
    'data-focused',
  ] as const;

  private _rowEl: HTMLDivElement | null = null;
  private _leadingIconEl: HTMLSpanElement | null = null;
  private _textContainerEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _descriptionEl: HTMLSpanElement | null = null;
  private _checkEl: HTMLSpanElement | null = null;

  // ─── Getters / Setters ────────────────────────────────────────────────────

  get value(): string { return this.getAttribute('value') ?? ''; }
  set value(val: string) { this.setAttribute('value', val); }

  get label(): string | null { return this.getAttribute('label'); }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
  }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { this.toggleAttribute('disabled', val); }

  get selected(): boolean { return this.hasAttribute('selected'); }
  set selected(val: boolean) { this.toggleAttribute('selected', val); }

  get description(): string | null { return this.getAttribute('description'); }
  set description(val: string | null) {
    if (val == null) this.removeAttribute('description');
    else this.setAttribute('description', val);
  }

  get leadingIcon(): string | null { return this.getAttribute('leading-icon'); }
  set leadingIcon(val: string | null) {
    if (val == null) this.removeAttribute('leading-icon');
    else this.setAttribute('leading-icon', val);
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private readonly _handleClick = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('loom-option-select', {
        bubbles: true,
        composed: true,
        detail: { value: this.value, label: this.label ?? this.textContent?.trim() ?? '' },
      }),
    );
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = [getVESheet(styles.optionRow)].filter((s): s is CSSStyleSheet => s != null);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;

      this._rowEl = document.createElement('div');
      this._rowEl.setAttribute('part', 'row');
      this._rowEl.classList.add(styles.optionRow);

      this._leadingIconEl = document.createElement('span');
      this._leadingIconEl.setAttribute('part', 'leading');
      this._leadingIconEl.classList.add(styles.optionLeadingIcon);
      this._leadingIconEl.hidden = true;

      this._textContainerEl = document.createElement('div');
      this._textContainerEl.setAttribute('part', 'text-container');
      this._textContainerEl.classList.add(styles.optionTextContainer);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');
      this._labelEl.classList.add(styles.optionLabel);

      this._descriptionEl = document.createElement('span');
      this._descriptionEl.setAttribute('part', 'description');
      this._descriptionEl.classList.add(styles.optionDescription);
      this._descriptionEl.hidden = true;

      this._textContainerEl.appendChild(this._labelEl);
      this._textContainerEl.appendChild(this._descriptionEl);
      this._rowEl.appendChild(this._leadingIconEl);
      this._rowEl.appendChild(this._textContainerEl);
      shadow.appendChild(this._rowEl);

      this._rowEl.addEventListener('click', this._handleClick);
    }

    this.setAttribute('role', 'option');
    this.setAttribute('tabindex', '-1');
    this._sync();
  }

  disconnectedCallback(): void {
    this._rowEl?.removeEventListener('click', this._handleClick);
  }

  attributeChangedCallback(): void {
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    // Option state can change in bursts when the parent select updates selection/focus.
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Prev state ───────────────────────────────────────────────────────────

  private _prev: Record<string, string | null> = { rowState: null };

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
    if (!this._rowEl) return;

    const isDisabled = this.disabled;
    const isSelected = this.selected;
    const isFocused = this.hasAttribute('data-focused');
    const labelText = this.label ?? this.textContent?.trim() ?? '';
    const descText = this.description;
    const leadingIconName = this.leadingIcon;

    const state = isDisabled ? 'disabled' : isSelected ? 'selected' : 'default';
    this._apply(this._rowEl, 'rowState', state, styles.optionRowState as Record<string, string>);

    // Parent select owns keyboard navigation and marks the active option with data-focused.
    if (isFocused) this._rowEl.classList.add(styles.optionRowFocused);
    else this._rowEl.classList.remove(styles.optionRowFocused);

    if (this._labelEl) {
      this._labelEl.textContent = labelText;
      if (isSelected) this._labelEl.classList.add(styles.optionLabelSelected);
      else this._labelEl.classList.remove(styles.optionLabelSelected);
    }

    if (this._descriptionEl) {
      this._descriptionEl.textContent = descText ?? '';
      this._descriptionEl.hidden = !descText;
    }

    if (this._leadingIconEl) {
      if (leadingIconName) {
        this._leadingIconEl.hidden = false;
        const existing = this._leadingIconEl.querySelector('loom-icon');
        if (!existing || existing.getAttribute('name') !== leadingIconName) {
          const iconEl = document.createElement('loom-icon');
          iconEl.setAttribute('name', leadingIconName);
          iconEl.setAttribute('size', 'sm');
          this._leadingIconEl.innerHTML = '';
          this._leadingIconEl.appendChild(iconEl);
        }
      } else {
        this._leadingIconEl.hidden = true;
        this._leadingIconEl.innerHTML = '';
      }
    }

    // Render the check mark only when selected so unselected rows keep their natural spacing.
    if (isSelected) {
      if (!this._checkEl) {
        this._checkEl = document.createElement('span');
        this._checkEl.setAttribute('part', 'check');
        this._checkEl.classList.add(styles.optionCheck);
        this._checkEl.innerHTML = ICON_CHECK;
        this._rowEl.appendChild(this._checkEl);
      }
    } else {
      if (this._checkEl) {
        this._checkEl.remove();
        this._checkEl = null;
      }
    }

    this.setAttribute('aria-selected', String(isSelected));
    if (isDisabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }
}

customElements.define('loom-select-option', LoomSelectOption);

declare global {
  interface HTMLElementTagNameMap {
    'loom-select-option': LoomSelectOption;
  }
}

// ─── LoomSelectMenu ───────────────────────────────────────────────────────────

class LoomSelectMenu extends HTMLElement {
  // Minimal container: loom-select owns behaviour, listbox state, and styling.
}

customElements.define('loom-select-menu', LoomSelectMenu);

declare global {
  interface HTMLElementTagNameMap {
    'loom-select-menu': LoomSelectMenu;
  }
}

export { LoomSelectOption, LoomSelectMenu };
