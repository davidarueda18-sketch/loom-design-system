import * as styles from '../Table.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { LoomTableRow } from './TableRow.element.ts';
import type {
  TableDensity,
  TableLayout,
  TableSelectableMode,
  TableSelectionChangeEventDetail,
} from '../Table.types.ts';

const SELECTABLE_MODES: readonly TableSelectableMode[] = ['none', 'single', 'multiple'];
const LAYOUTS: readonly TableLayout[] = ['auto', 'scroll', 'stacked'];
const DENSITIES: readonly TableDensity[] = ['comfortable', 'compact'];

class LoomTable extends HTMLElement {
  static observedAttributes = [
    'columns',
    'selectable',
    'density',
    'layout',
    'expandable',
    'sticky-header',
    'sticky-first-column',
    'loading',
  ] as const;

  get columns(): string {
    return this.getAttribute('columns') ?? '';
  }
  set columns(value: string) {
    if (value) this.setAttribute('columns', value);
    else this.removeAttribute('columns');
  }

  get selectable(): TableSelectableMode {
    const value = this.getAttribute('selectable');
    return value && (SELECTABLE_MODES as readonly string[]).includes(value)
      ? (value as TableSelectableMode)
      : 'none';
  }
  set selectable(value: TableSelectableMode) {
    this.setAttribute('selectable', value);
  }

  get density(): TableDensity {
    const value = this.getAttribute('density');
    return value && (DENSITIES as readonly string[]).includes(value) ? (value as TableDensity) : 'comfortable';
  }
  set density(value: TableDensity) {
    this.setAttribute('density', value);
  }

  get layout(): TableLayout {
    const value = this.getAttribute('layout');
    return value && (LAYOUTS as readonly string[]).includes(value) ? (value as TableLayout) : 'auto';
  }
  set layout(value: TableLayout) {
    this.setAttribute('layout', value);
  }

  get expandable(): boolean {
    return this.hasAttribute('expandable');
  }
  set expandable(value: boolean) {
    this.toggleAttribute('expandable', value);
  }

  get loading(): boolean {
    return this.hasAttribute('loading');
  }
  set loading(value: boolean) {
    this.toggleAttribute('loading', value);
  }

  private _scrollEl: HTMLDivElement | null = null;
  private _gridEl: HTMLDivElement | null = null;
  private _emptyEl: HTMLDivElement | null = null;
  private _loadingEl: HTMLDivElement | null = null;
  private _slotEl: HTMLSlotElement | null = null;
  private readonly _selected = new Set<string>();
  private _activeRowIndex = 0;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheets = collectAdoptedStyleSheets(styles.root);
      if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
      this._build(shadow);
    }
    this.classList.add(styles.root);

    this.addEventListener('loom-table-row-select', this._handleRowSelect as EventListener);
    this.addEventListener('loom-table-header-select-all', this._handleSelectAll as EventListener);
    this.addEventListener('keydown', this._handleKeydown);

    this._sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener('loom-table-row-select', this._handleRowSelect as EventListener);
    this.removeEventListener('loom-table-header-select-all', this._handleSelectAll as EventListener);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _build(shadow: ShadowRoot): void {
    this._scrollEl = document.createElement('div');
    this._scrollEl.classList.add(styles.scrollContainer);
    this._scrollEl.setAttribute('part', 'scroll-container');
    this._scrollEl.setAttribute('role', 'region');
    this._scrollEl.setAttribute('tabindex', '0');

    const captionSlot = document.createElement('slot');
    captionSlot.name = 'caption';

    this._gridEl = document.createElement('div');
    this._gridEl.classList.add(styles.grid);
    this._gridEl.setAttribute('part', 'table');
    this._gridEl.setAttribute('role', 'table');

    this._slotEl = document.createElement('slot');
    this._slotEl.addEventListener('slotchange', this._handleSlotChange);
    this._gridEl.appendChild(this._slotEl);

    this._emptyEl = document.createElement('div');
    this._emptyEl.classList.add(styles.empty);
    this._emptyEl.setAttribute('part', 'empty');
    this._emptyEl.hidden = true;
    const emptySlot = document.createElement('slot');
    emptySlot.name = 'empty';
    emptySlot.textContent = 'Sin datos';
    this._emptyEl.appendChild(emptySlot);

    this._loadingEl = document.createElement('div');
    this._loadingEl.classList.add(styles.loadingOverlay);
    this._loadingEl.setAttribute('part', 'loading');
    this._loadingEl.hidden = true;
    const loadingSlot = document.createElement('slot');
    loadingSlot.name = 'loading';
    loadingSlot.textContent = 'Cargando…';
    this._loadingEl.appendChild(loadingSlot);

    this._scrollEl.appendChild(captionSlot);
    this._scrollEl.appendChild(this._gridEl);
    this._scrollEl.appendChild(this._emptyEl);
    this._scrollEl.appendChild(this._loadingEl);
    shadow.appendChild(this._scrollEl);
  }

  private readonly _handleSlotChange = (): void => {
    this._scheduleSync();
  };

  attributeChangedCallback(): void {
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

  private _allRows(): LoomTableRow[] {
    return Array.from(this.querySelectorAll<LoomTableRow>(':scope > loom-table-row'));
  }
  private _dataRows(): LoomTableRow[] {
    return this._allRows().filter((row) => !row.hasAttribute('header'));
  }
  private _headerRow(): LoomTableRow | null {
    return this.querySelector<LoomTableRow>(':scope > loom-table-row[header]');
  }
  private _interactiveRows(): LoomTableRow[] {
    return this._dataRows().filter((row) => row.hasAttribute('interactive') && !row.hasAttribute('disabled'));
  }

  private _columnCount(): number {
    const rows = this._allRows();
    let max = 0;
    for (const row of rows) {
      const count = row.querySelectorAll(':scope > loom-table-cell, :scope > loom-table-header-cell').length;
      if (count > max) max = count;
    }
    return Math.max(max, 1);
  }

  private _computeTemplate(): string {
    const leading: string[] = [];
    if (this.selectable !== 'none') leading.push('minmax(44px, auto)');
    if (this.expandable) leading.push('minmax(44px, auto)');
    const body = this.columns.trim() || `repeat(${this._columnCount()}, minmax(0, 1fr))`;
    return [...leading, body].join(' ');
  }

  private _sync(): void {
    if (!this._gridEl || !this._scrollEl || !this._emptyEl || !this._loadingEl) return;

    this._gridEl.style.setProperty('--loom-table-template', this._computeTemplate());

    // Layout classes.
    this._gridEl.classList.remove(styles.layoutScroll, styles.layoutAuto, styles.layoutStacked);
    this._scrollEl.classList.toggle(styles.autoContainer, this.layout === 'auto');
    if (this.layout === 'scroll') this._gridEl.classList.add(styles.layoutScroll);
    else if (this.layout === 'stacked') this._gridEl.classList.add(styles.layoutStacked);
    else this._gridEl.classList.add(styles.layoutAuto);

    // Empty / loading states.
    const hasData = this._dataRows().length > 0;
    this._emptyEl.hidden = hasData || this.loading;
    this._gridEl.hidden = !hasData;
    this._loadingEl.hidden = !this.loading;
    this._scrollEl.setAttribute('aria-busy', this.loading ? 'true' : 'false');

    // Let cells/rows re-resolve density & layout from this ancestor.
    this._refreshChildren();

    this._updateSelectionState(false);
    this._updateRoving();
  }

  private _refreshChildren(): void {
    this.querySelectorAll<LoomTableRow>(':scope > loom-table-row').forEach((row) => row.requestSync());
    this.querySelectorAll(':scope > loom-table-row > loom-table-cell, :scope > loom-table-row > loom-table-header-cell')
      .forEach((cell) => {
        if (cell instanceof HTMLElement && 'requestSync' in cell) {
          (cell as unknown as { requestSync: () => void }).requestSync();
        }
      });
  }

  private _updateRoving(): void {
    const rows = this._interactiveRows();
    if (rows.length === 0) return;
    if (this._activeRowIndex >= rows.length) this._activeRowIndex = 0;
    rows.forEach((row, i) => row.setAttribute('tabindex', i === this._activeRowIndex ? '0' : '-1'));
  }

  private readonly _handleRowSelect = (event: CustomEvent<{ rowId: string; selected: boolean }>): void => {
    const { rowId, selected } = event.detail;
    if (!rowId) return;
    if (this.selectable === 'single') {
      this._selected.clear();
      if (selected) this._selected.add(rowId);
      // Reflect single-selection on sibling rows.
      this._dataRows().forEach((row) => {
        if (row.rowId !== rowId) row.selected = false;
      });
    } else {
      if (selected) this._selected.add(rowId);
      else this._selected.delete(rowId);
    }
    this._updateSelectionState(true);
  };

  private readonly _handleSelectAll = (event: CustomEvent<{ checked: boolean }>): void => {
    const checked = event.detail.checked;
    this._selected.clear();
    this._dataRows().forEach((row) => {
      row.selected = checked;
      if (checked && row.rowId) this._selected.add(row.rowId);
    });
    this._updateSelectionState(true);
  };

  private _updateSelectionState(emit: boolean): void {
    const dataRows = this._dataRows();
    const total = dataRows.length;
    const selectedCount = dataRows.filter((row) => row.selected).length;
    const allSelected = total > 0 && selectedCount === total;
    const indeterminate = selectedCount > 0 && selectedCount < total;

    const header = this._headerRow();
    header?.setSelectAllVisual(allSelected, indeterminate);

    if (emit) {
      this.dispatchEvent(
        new CustomEvent<TableSelectionChangeEventDetail>('loom-table-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selected: Array.from(this._selected), allSelected, indeterminate },
        }),
      );
    }
  }

  private readonly _handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }
    const rows = this._interactiveRows();
    if (rows.length === 0) return;
    const target = event.target as HTMLElement | null;
    if (target && target.closest('loom-table-cell, loom-table-header-cell')) return;

    let next: number;
    if (event.key === 'ArrowDown') next = Math.min(rows.length - 1, this._activeRowIndex + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, this._activeRowIndex - 1);
    else if (event.key === 'Home') next = 0;
    else next = rows.length - 1;

    if (next !== this._activeRowIndex || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this._activeRowIndex = next;
      this._updateRoving();
      rows[next].focus();
    }
  };

  /** Imperative API: current selection ids. */
  get selectedIds(): string[] {
    return Array.from(this._selected);
  }
}

customElements.define('loom-table', LoomTable);

declare global {
  interface HTMLElementTagNameMap {
    'loom-table': LoomTable;
  }
}

export { LoomTable };
