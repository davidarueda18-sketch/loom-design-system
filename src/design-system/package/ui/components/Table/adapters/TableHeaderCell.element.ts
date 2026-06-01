import * as styles from '../Cell.css.ts';
import { LoomTableCell } from './TableCell.element.ts';
import type { TableSortChangeEventDetail, TableSortDirection } from '../Table.types.ts';

const SORT_DIRECTIONS: readonly TableSortDirection[] = ['none', 'asc', 'desc'];
const SORT_GLYPH: Record<TableSortDirection, string> = { none: '↕', asc: '↑', desc: '↓' };
const NEXT_SORT: Record<TableSortDirection, TableSortDirection> = { none: 'asc', asc: 'desc', desc: 'none' };

class LoomTableHeaderCell extends LoomTableCell {
  static observedAttributes: readonly string[] = [
    'align',
    'numeric',
    'truncate',
    'col-span',
    'mobile-span',
    'mobile-label',
    'sort',
    'column-id',
  ];

  get sort(): TableSortDirection {
    const value = this.getAttribute('sort');
    return value && (SORT_DIRECTIONS as readonly string[]).includes(value)
      ? (value as TableSortDirection)
      : 'none';
  }
  set sort(value: TableSortDirection) {
    this.setAttribute('sort', value);
  }

  get columnId(): string {
    return this.getAttribute('column-id') ?? '';
  }
  set columnId(value: string) {
    if (value) this.setAttribute('column-id', value);
    else this.removeAttribute('column-id');
  }

  private _sortBtnEl: HTMLButtonElement | null = null;

  protected override _hostRole(): string {
    return 'columnheader';
  }

  protected override _build(shadow: ShadowRoot): void {
    super._build(shadow);
    if (this._cellEl) this._cellEl.classList.add(styles.header);

    this._sortBtnEl = document.createElement('button');
    this._sortBtnEl.type = 'button';
    this._sortBtnEl.classList.add(styles.sortButton);
    this._sortBtnEl.setAttribute('part', 'sort-icon');
    this._sortBtnEl.dataset.rowInteractiveZone = '';
    this._sortBtnEl.addEventListener('click', this._handleSortClick);
    if (this._cellEl) this._cellEl.appendChild(this._sortBtnEl);
  }

  private readonly _handleSortClick = (): void => {
    const next = NEXT_SORT[this.sort];
    this.sort = next;
    if (next === 'none') this.removeAttribute('aria-sort');
    this.dispatchEvent(
      new CustomEvent<TableSortChangeEventDetail>('loom-table-sort-change', {
        bubbles: true,
        composed: true,
        detail: { columnId: this.columnId, direction: next },
      }),
    );
  };

  protected override _sync(): void {
    super._sync();
    if (!this._sortBtnEl) return;
    const sortable = this.hasAttribute('sort');
    this._sortBtnEl.hidden = !sortable;
    this._sortBtnEl.textContent = SORT_GLYPH[this.sort];
    this._sortBtnEl.setAttribute('aria-label', `Ordenar columna (${this.sort})`);
    // aria-sort lives on the columnheader host for assistive tech.
    if (sortable && this.sort !== 'none') {
      this.setAttribute('aria-sort', this.sort === 'asc' ? 'ascending' : 'descending');
    } else {
      this.setAttribute('aria-sort', 'none');
    }
  }
}

customElements.define('loom-table-header-cell', LoomTableHeaderCell);

declare global {
  interface HTMLElementTagNameMap {
    'loom-table-header-cell': LoomTableHeaderCell;
  }
}

export { LoomTableHeaderCell };
