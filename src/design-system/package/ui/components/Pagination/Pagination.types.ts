import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface PaginationChangeEventDetail {
  page: number;
  pageSize: number;
}

export interface PaginationSizeChangeEventDetail {
  pageSize: number;
}

export interface PaginationOwnProps {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: string;
  siblings?: number;
  compact?: boolean;
  disabled?: boolean;
  onChange?: (detail: PaginationChangeEventDetail) => void;
  onSizeChange?: (detail: PaginationSizeChangeEventDetail) => void;
  children?: ReactNode;
}
export type PaginationProps = PaginationOwnProps &
  Omit<ComponentPropsWithoutRef<'nav'>, keyof PaginationOwnProps>;
