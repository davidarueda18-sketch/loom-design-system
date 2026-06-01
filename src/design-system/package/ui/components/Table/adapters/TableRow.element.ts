import * as styles from '../Row.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type {
  TableRowClickEventDetail,
  TableRowSelectEventDetail,
  TableRowToggleEventDetail,
} from '../Table.types.ts';

const INTERACTIVE_ZONE_SELECTOR =
  '[data-row-interactive-zone],loom-checkbox,loom-radio,button,a,loom-button,loom-icon-button,loom-link,loom-fab,input,select,textarea';

let _expansionIdCounter = 0;

class LoomTableRow extends HTMLElement {
  static observedAttributes = [
    'row-id',
    'header',
    'selected',
    'expandable',
    'expanded',
    'interactive',
    'disabled',
  ] as const;

  get rowId(): string {
    return this.getAttribute('row-id') ?? '';
  }
  set rowId(value: string) {
    if (value) this.setAttribute('row-id', value);
    else this.removeAttribute('row-id');
  }

  get header(): boolean {
    return this.hasAttribute('header');
  }
  set header(value: boolean) {
    this.toggleAttribute('header', value);
  }

  get selected(): boolean {
    return this.hasAttribute('selected');
  }
  set selected(value: boolean) {
    this.toggleAttribute('selected', value);
  }

  get expandable(): boolean {
    return this.hasAttribute('expandable');
  }
  set expandable(value: boolean) {
    this.toggleAttribute('expandable', value);
  }

  get expanded(): boolean {
    return this.hasAttribute('expanded');
  }
  set expanded(value: boolean) {
    this.toggleAttribute('expanded', value);
  }

  get interactive(): boolean {
    return this.hasAttribute('interactive');
  }
  set interactive(value: boolean) {
    this.toggleAttribute('interactive', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  private _selectionWrapEl: HTMLDivElement | null = null;
  private _checkboxEl: HTMLElement | null = null;
  private _toggleWrapEl: HTMLDivElement | null = null;
  private _toggleBtnEl: HTMLButtonElement | null = null;
  private _expansionEl: HTMLElement | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.host);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
      this._build(shadow);
    }
    this.classList.add(styles.host);
    this.setAttribute('role', 'row');
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);
    this._sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
    this._checkboxEl?.removeEventListener('loom-checkbox-change', this._handleCheckboxChange);
    this._toggleBtnEl?.removeEventListener('click', this._handleToggleClick);
  }

  private _build(shadow: ShadowRoot): void {
    this._selectionWrapEl = document.createElement('div');
    this._selectionWrapEl.classList.add(styles.control);
    this._selectionWrapEl.setAttribute('part', 'selection');
    this._selectionWrapEl.dataset.rowInteractiveZone = '';

    this._checkboxEl = document.createElement('loom-checkbox');
    this._checkboxEl.addEventListener('loom-checkbox-change', this._handleCheckboxChange);
    this._selectionWrapEl.appendChild(this._checkboxEl);

    this._toggleWrapEl = document.createElement('div');
    this._toggleWrapEl.classList.add(styles.control);
    this._toggleWrapEl.setAttribute('part', 'toggle');
    this._toggleWrapEl.dataset.rowInteractiveZone = '';

    this._toggleBtnEl = document.createElement('button');
    this._toggleBtnEl.type = 'button';
    this._toggleBtnEl.classList.add(styles.toggleButton);
    this._toggleBtnEl.textContent = '⌄';
    this._toggleBtnEl.addEventListener('click', this._handleToggleClick);
    this._toggleWrapEl.appendChild(this._toggleBtnEl);

    const cellsSlot = document.createElement('slot');
    const expansionSlot = document.createElement('slot');
    expansionSlot.name = 'expansion';

    shadow.appendChild(this._selectionWrapEl);
    shadow.appendChild(this._toggleWrapEl);
    shadow.appendChild(cellsSlot);
    shadow.appendChild(expansionSlot);
  }

  attributeChangedCallback(name: string): void {
    if (name === 'selected' || name === 'expanded' || name === 'disabled') {
      this._syncA11y();
    }
    this._scheduleSync();
  }

  /** Called by the parent table to re-resolve ancestor-derived state (selectable, layout). */
  requestSync(): void {
    this._scheduleSync();
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

  private _selectableMode(): string {
    return this.closest('loom-table')?.getAttribute('selectable') ?? 'none';
  }

  private _expandColumnReserved(): boolean {
    return this.closest('loom-table')?.hasAttribute('expandable') ?? false;
  }

  private _layout(): string {
    return this.closest('loom-table')?.getAttribute('layout') ?? 'auto';
  }

  /** Adopts the nested `loom-table-expansion`, wiring ids and aria for the toggle. */
  private _resolveExpansion(): HTMLElement | null {
    const expansion = this.querySelector(':scope > loom-table-expansion');
    if (expansion instanceof HTMLElement) {
      expansion.setAttribute('slot', 'expansion');
      if (!expansion.id) expansion.id = `loom-table-expansion-${++_expansionIdCounter}`;
      return expansion;
    }
    return null;
  }

  private _sync(): void {
    if (!this._selectionWrapEl || !this._toggleWrapEl || !this._toggleBtnEl || !this._checkboxEl) return;

    const mode = this._selectableMode();
    const showCheckbox = mode === 'multiple';
    this._selectionWrapEl.hidden = !showCheckbox;
    if (showCheckbox) {
      this._checkboxEl.setAttribute(
        'aria-label',
        this.header ? 'Seleccionar todas las filas' : `Seleccionar fila ${this.rowId || ''}`.trim(),
      );
    }

    const showToggle = this._expandColumnReserved();
    this._toggleWrapEl.hidden = !showToggle;
    this._toggleBtnEl.hidden = !this.expandable;

    this._expansionEl = this._resolveExpansion();
    if (this._expansionEl) {
      this._expansionEl.toggleAttribute('expanded', this.expanded);
      if (!this._expansionEl.hasAttribute('aria-label')) {
        this._expansionEl.setAttribute('aria-label', 'Detalle de fila');
      }
    }

    this._toggleBtnEl.classList.toggle(styles.toggleExpanded, this.expanded);

    this.classList.toggle(styles.selected, this.selected && !this.header);
    this.classList.toggle(styles.interactive, this.interactive && !this.disabled);
    this.classList.toggle(styles.disabled, this.disabled);

    // Responsive: forced stacked vs auto (container-query) card layout.
    const layout = this._layout();
    this.classList.toggle(styles.forcedStack, layout === 'stacked' && !this.header);
    this.classList.toggle(styles.autoStack, layout === 'auto' && !this.header);

    // Roving tabindex baseline (Table manages focus movement).
    if (this.interactive && !this.disabled) {
      if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
    }

    this._syncCheckboxState();
    this._syncA11y();
  }

  private _syncCheckboxState(): void {
    if (!this._checkboxEl || this.header) return;
    if (this.selected) this._checkboxEl.setAttribute('checked', '');
    else this._checkboxEl.removeAttribute('checked');
  }

  private _syncA11y(): void {
    const mode = this._selectableMode();
    if (mode !== 'none' && !this.header) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    } else {
      this.removeAttribute('aria-selected');
    }
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');

    if (this._toggleBtnEl) {
      this._toggleBtnEl.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');
      this._toggleBtnEl.setAttribute('aria-label', this.expanded ? 'Contraer fila' : 'Expandir fila');
      if (this._expansionEl?.id) this._toggleBtnEl.setAttribute('aria-controls', this._expansionEl.id);
    }
  }

  /** Called by the parent table to reflect select-all state on the header checkbox. */
  setSelectAllVisual(checked: boolean, indeterminate: boolean): void {
    if (!this._checkboxEl) return;
    this._checkboxEl.toggleAttribute('checked', checked);
    this._checkboxEl.toggleAttribute('indeterminate', indeterminate);
  }

  private readonly _handleCheckboxChange = (event: Event): void => {
    const detail = (event as CustomEvent<{ checked: boolean }>).detail;
    const checked = !!detail?.checked;
    if (this.header) {
      this.dispatchEvent(
        new CustomEvent('loom-table-header-select-all', {
          bubbles: true,
          composed: true,
          detail: { checked },
        }),
      );
      return;
    }
    this.selected = checked;
    this.dispatchEvent(
      new CustomEvent<TableRowSelectEventDetail>('loom-table-row-select', {
        bubbles: true,
        composed: true,
        detail: { rowId: this.rowId, selected: checked },
      }),
    );
  };

  private readonly _handleToggleClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(
      new CustomEvent<TableRowToggleEventDetail>('loom-table-row-toggle', {
        bubbles: true,
        composed: true,
        detail: { rowId: this.rowId, expanded: this.expanded },
      }),
    );
  };

  private readonly _handleClick = (event: MouseEvent): void => {
    if (this.disabled || this.header) return;
    const target = event.target as HTMLElement | null;
    if (target && target.closest(INTERACTIVE_ZONE_SELECTOR)) return;

    if (this.interactive) {
      this.dispatchEvent(
        new CustomEvent<TableRowClickEventDetail>('loom-table-row-click', {
          bubbles: true,
          composed: true,
          detail: { rowId: this.rowId },
        }),
      );
      return;
    }
    if (this._selectableMode() === 'single') {
      this.selected = !this.selected;
      this.dispatchEvent(
        new CustomEvent<TableRowSelectEventDetail>('loom-table-row-select', {
          bubbles: true,
          composed: true,
          detail: { rowId: this.rowId, selected: this.selected },
        }),
      );
    }
  };

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (this.disabled || this.header) return;
    const target = event.target as HTMLElement | null;
    const onInteractive = !!target && target !== this && !!target.closest(INTERACTIVE_ZONE_SELECTOR);

    if ((event.key === 'Enter' || event.key === ' ') && !onInteractive) {
      if (this.interactive) {
        event.preventDefault();
        this.dispatchEvent(
          new CustomEvent<TableRowClickEventDetail>('loom-table-row-click', {
            bubbles: true,
            composed: true,
            detail: { rowId: this.rowId },
          }),
        );
      }
    }
    if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && this.expandable) {
      const next = event.key === 'ArrowRight';
      if (this.expanded !== next) {
        event.preventDefault();
        this.expanded = next;
        this.dispatchEvent(
          new CustomEvent<TableRowToggleEventDetail>('loom-table-row-toggle', {
            bubbles: true,
            composed: true,
            detail: { rowId: this.rowId, expanded: this.expanded },
          }),
        );
      }
    }
  };
}

customElements.define('loom-table-row', LoomTableRow);

declare global {
  interface HTMLElementTagNameMap {
    'loom-table-row': LoomTableRow;
  }
}

export { LoomTableRow };
