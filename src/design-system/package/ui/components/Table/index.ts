export { Table } from './adapters/Table.react.tsx';
export { TableRow } from './adapters/TableRow.react.tsx';
export { TableCell } from './adapters/TableCell.react.tsx';
export { TableHeaderCell } from './adapters/TableHeaderCell.react.tsx';
export { TableExpansion } from './adapters/TableExpansion.react.tsx';

export { LoomTable } from './adapters/Table.element.ts';
export { LoomTableRow } from './adapters/TableRow.element.ts';
export { LoomTableCell } from './adapters/TableCell.element.ts';
export { LoomTableHeaderCell } from './adapters/TableHeaderCell.element.ts';
export { LoomTableExpansion } from './adapters/TableExpansion.element.ts';

export {
  TABLE_SELECTABLE_MODES,
  TABLE_DENSITIES,
  TABLE_LAYOUTS,
  TABLE_CELL_ALIGNS,
  TABLE_CELL_MOBILE_SPANS,
  TABLE_SORT_DIRECTIONS,
} from './Table.types.ts';

export type {
  TableProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
  TableExpansionProps,
  TableSelectableMode,
  TableDensity,
  TableLayout,
  TableCellAlign,
  TableCellMobileSpan,
  TableSortDirection,
  TableSelectionChangeEventDetail,
  TableRowSelectEventDetail,
  TableRowToggleEventDetail,
  TableRowClickEventDetail,
  TableSortChangeEventDetail,
} from './Table.types.ts';
