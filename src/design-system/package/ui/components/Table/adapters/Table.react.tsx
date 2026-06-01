import './Table.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  TableProps,
  TableRowClickEventDetail,
  TableRowToggleEventDetail,
  TableSelectionChangeEventDetail,
  TableSortChangeEventDetail,
} from '../Table.types.ts';

const TableElement = 'loom-table' as ElementType;

export function Table({
  columns,
  selectable,
  density,
  layout,
  expandable,
  stickyHeader,
  stickyFirstColumn,
  loading,
  onSelectionChange,
  onRowToggle,
  onRowClick,
  onSortChange,
  className,
  children,
  ...props
}: TableProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSel = (e: Event): void =>
      onSelectionChange?.((e as CustomEvent<TableSelectionChangeEventDetail>).detail);
    const onTog = (e: Event): void =>
      onRowToggle?.((e as CustomEvent<TableRowToggleEventDetail>).detail);
    const onClk = (e: Event): void =>
      onRowClick?.((e as CustomEvent<TableRowClickEventDetail>).detail);
    const onSrt = (e: Event): void =>
      onSortChange?.((e as CustomEvent<TableSortChangeEventDetail>).detail);
    el.addEventListener('loom-table-selection-change', onSel);
    el.addEventListener('loom-table-row-toggle', onTog);
    el.addEventListener('loom-table-row-click', onClk);
    el.addEventListener('loom-table-sort-change', onSrt);
    return () => {
      el.removeEventListener('loom-table-selection-change', onSel);
      el.removeEventListener('loom-table-row-toggle', onTog);
      el.removeEventListener('loom-table-row-click', onClk);
      el.removeEventListener('loom-table-sort-change', onSrt);
    };
  }, [onSelectionChange, onRowToggle, onRowClick, onSortChange]);

  return (
    <TableElement
      ref={ref}
      columns={columns}
      selectable={selectable}
      density={density}
      layout={layout}
      {...(expandable ? { expandable: '' } : {})}
      {...(stickyHeader ? { 'sticky-header': '' } : {})}
      {...(stickyFirstColumn ? { 'sticky-first-column': '' } : {})}
      {...(loading ? { loading: '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </TableElement>
  );
}
