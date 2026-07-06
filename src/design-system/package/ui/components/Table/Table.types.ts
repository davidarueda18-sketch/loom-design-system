import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ------------------------------------------------------------------ *
 * Shared unions (no enums — `as const` tuples)
 * ------------------------------------------------------------------ */

export const TABLE_SELECTABLE_MODES = ['none', 'single', 'multiple'] as const;
export type TableSelectableMode = (typeof TABLE_SELECTABLE_MODES)[number];

export const TABLE_DENSITIES = ['comfortable', 'compact'] as const;
export type TableDensity = (typeof TABLE_DENSITIES)[number];

export const TABLE_LAYOUTS = ['auto', 'scroll', 'stacked'] as const;
export type TableLayout = (typeof TABLE_LAYOUTS)[number];

export const TABLE_CELL_ALIGNS = ['start', 'center', 'end'] as const;
export type TableCellAlign = (typeof TABLE_CELL_ALIGNS)[number];

export const TABLE_CELL_MOBILE_SPANS = ['auto', 'half', 'full'] as const;
export type TableCellMobileSpan = (typeof TABLE_CELL_MOBILE_SPANS)[number];

export const TABLE_SORT_DIRECTIONS = ['none', 'asc', 'desc'] as const;
export type TableSortDirection = (typeof TABLE_SORT_DIRECTIONS)[number];

export const TABLE_CELL_VARIANTS = ['content', 'default', 'key-value', 'state', 'progress', 'team'] as const;
export type TableCellVariant = (typeof TABLE_CELL_VARIANTS)[number];

export const TABLE_MOBILE_LAYOUTS = ['stacked', 'pairs'] as const;
export type TableMobileLayout = (typeof TABLE_MOBILE_LAYOUTS)[number];

export const TABLE_ROW_ACCENTS = ['none', 'info', 'warning', 'neutral'] as const;
export type TableRowAccent = (typeof TABLE_ROW_ACCENTS)[number];

/* ------------------------------------------------------------------ *
 * Event detail shapes
 * ------------------------------------------------------------------ */

export interface TableSelectionChangeEventDetail {
  selected: string[];
  allSelected: boolean;
  indeterminate: boolean;
}

export interface TableRowSelectEventDetail {
  rowId: string;
  selected: boolean;
}

export interface TableRowToggleEventDetail {
  rowId: string;
  expanded: boolean;
}

export interface TableRowClickEventDetail {
  rowId: string;
}

export interface TableSortChangeEventDetail {
  columnId: string;
  direction: TableSortDirection;
}

/* ------------------------------------------------------------------ *
 * React prop interfaces
 * ------------------------------------------------------------------ */

export interface TableOwnProps {
  columns?: string;
  selectable?: TableSelectableMode;
  density?: TableDensity;
  layout?: TableLayout;
  mobileLayout?: TableMobileLayout;
  expandable?: boolean;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  onSelectionChange?: (detail: TableSelectionChangeEventDetail) => void;
  onRowToggle?: (detail: TableRowToggleEventDetail) => void;
  onRowClick?: (detail: TableRowClickEventDetail) => void;
  onSortChange?: (detail: TableSortChangeEventDetail) => void;
  children?: ReactNode;
}
export type TableProps = TableOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof TableOwnProps>;

export interface TableRowOwnProps {
  rowId?: string;
  header?: boolean;
  selected?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  level?: number;
  accent?: TableRowAccent;
  mobileLayout?: TableMobileLayout;
  onRowSelect?: (detail: TableRowSelectEventDetail) => void;
  onRowToggle?: (detail: TableRowToggleEventDetail) => void;
  onRowClick?: (detail: TableRowClickEventDetail) => void;
  children?: ReactNode;
}
export type TableRowProps = TableRowOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof TableRowOwnProps>;

export interface TableCellOwnProps {
  align?: TableCellAlign;
  numeric?: boolean;
  truncate?: boolean;
  colSpan?: number;
  mobileSpan?: TableCellMobileSpan;
  mobileLabel?: string;
  mobileOrder?: number;
  mobileAlign?: TableCellAlign;
  // typed variant
  variant?: TableCellVariant;
  label?: string;
  description?: string;
  showDescription?: boolean;
  badgeLabel?: string;
  badgeState?: string;
  cellKey?: string;
  descriptionKey?: string;
  showProgress?: boolean;
  progressValue?: number;
  startDate?: string;
  targetDate?: string;
  startLabel?: string;
  targetLabel?: string;
  leaderLabel?: string;
  children?: ReactNode;
}
export type TableCellProps = TableCellOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof TableCellOwnProps>;

export interface TableHeaderCellOwnProps {
  align?: TableCellAlign;
  numeric?: boolean;
  sort?: TableSortDirection;
  columnId?: string;
  mobileSpan?: TableCellMobileSpan;
  onSortChange?: (detail: TableSortChangeEventDetail) => void;
  children?: ReactNode;
}
export type TableHeaderCellProps = TableHeaderCellOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof TableHeaderCellOwnProps>;

export interface TableExpansionOwnProps {
  children?: ReactNode;
}
export type TableExpansionProps = TableExpansionOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof TableExpansionOwnProps>;
