import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Payload emitted by `loom-pagination-change`. */
export interface PaginationChangeEventDetail {
  /** New selected page (1-based). */
  page: number;
  /** Current page size after the change. */
  pageSize: number;
}

/** Payload emitted by `loom-pagination-size-change`. */
export interface PaginationSizeChangeEventDetail {
  /** New page size selected by the user. */
  pageSize: number;
}

/** Public Pagination API shared by React and custom-element adapters. */
export interface PaginationOwnProps {
  /** Current page (1-based). Defaults to `1`. */
  page?: number;
  /** Items per page. Defaults to `10`. */
  pageSize?: number;
  /** Total number of items in the collection. */
  totalItems?: number;
  /** Comma-separated list of page-size options, for example `"10,25,50"`. */
  pageSizeOptions?: string;
  /** Number of sibling pages shown around the current page. Defaults to `1`. */
  siblings?: number;
  /** Reserved display flag for compact layouts. */
  compact?: boolean;
  /** Disables all controls when `true`. */
  disabled?: boolean;
  /** Called when the selected page changes. */
  onChange?: (detail: PaginationChangeEventDetail) => void;
  /** Called when page size changes from the select control. */
  onSizeChange?: (detail: PaginationSizeChangeEventDetail) => void;
  /** Optional projected content (for example `slot="summary"`). */
  children?: ReactNode;
}

/** Public props shape for the React wrapper. */
export type PaginationProps = PaginationOwnProps &
  Omit<ComponentPropsWithoutRef<'nav'>, keyof PaginationOwnProps>;
