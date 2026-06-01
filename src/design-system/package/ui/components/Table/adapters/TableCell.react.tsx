import './TableCell.element.ts';
import type { ElementType } from 'react';
import type { TableCellProps } from '../Table.types.ts';

const TableCellElement = 'loom-table-cell' as ElementType;

export function TableCell({
  align,
  numeric,
  truncate,
  colSpan,
  mobileSpan,
  mobileLabel,
  className,
  children,
  ...props
}: TableCellProps) {
  return (
    <TableCellElement
      align={align}
      {...(numeric ? { numeric: '' } : {})}
      {...(truncate ? { truncate: '' } : {})}
      {...(colSpan && colSpan > 1 ? { 'col-span': colSpan } : {})}
      mobile-span={mobileSpan}
      mobile-label={mobileLabel}
      className={className}
      {...(props as object)}
    >
      {children}
    </TableCellElement>
  );
}
