import './TableHeaderCell.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type { TableHeaderCellProps, TableSortChangeEventDetail } from '../Table.types.ts';

const TableHeaderCellElement = 'loom-table-header-cell' as ElementType;

export function TableHeaderCell({
  align,
  numeric,
  sort,
  columnId,
  mobileSpan,
  onSortChange,
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event): void =>
      onSortChange?.((e as CustomEvent<TableSortChangeEventDetail>).detail);
    el.addEventListener('loom-table-sort-change', handler);
    return () => el.removeEventListener('loom-table-sort-change', handler);
  }, [onSortChange]);

  return (
    <TableHeaderCellElement
      ref={ref}
      align={align}
      {...(numeric ? { numeric: '' } : {})}
      sort={sort}
      column-id={columnId}
      mobile-span={mobileSpan}
      className={className}
      {...(props as object)}
    >
      {children}
    </TableHeaderCellElement>
  );
}
