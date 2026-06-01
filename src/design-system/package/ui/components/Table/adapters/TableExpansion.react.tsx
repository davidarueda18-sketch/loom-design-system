import './TableExpansion.element.ts';
import type { ElementType } from 'react';
import type { TableExpansionProps } from '../Table.types.ts';

const TableExpansionElement = 'loom-table-expansion' as ElementType;

export function TableExpansion({ className, children, ...props }: TableExpansionProps) {
  return (
    <TableExpansionElement className={className} {...(props as object)}>
      {children}
    </TableExpansionElement>
  );
}
