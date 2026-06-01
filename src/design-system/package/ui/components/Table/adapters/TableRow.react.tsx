import './TableRow.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  TableRowProps,
  TableRowClickEventDetail,
  TableRowSelectEventDetail,
  TableRowToggleEventDetail,
} from '../Table.types.ts';

const TableRowElement = 'loom-table-row' as ElementType;

export function TableRow({
  rowId,
  header,
  selected,
  expandable,
  expanded,
  interactive,
  disabled,
  onRowSelect,
  onRowToggle,
  onRowClick,
  className,
  children,
  ...props
}: TableRowProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSel = (e: Event): void =>
      onRowSelect?.((e as CustomEvent<TableRowSelectEventDetail>).detail);
    const onTog = (e: Event): void =>
      onRowToggle?.((e as CustomEvent<TableRowToggleEventDetail>).detail);
    const onClk = (e: Event): void =>
      onRowClick?.((e as CustomEvent<TableRowClickEventDetail>).detail);
    el.addEventListener('loom-table-row-select', onSel);
    el.addEventListener('loom-table-row-toggle', onTog);
    el.addEventListener('loom-table-row-click', onClk);
    return () => {
      el.removeEventListener('loom-table-row-select', onSel);
      el.removeEventListener('loom-table-row-toggle', onTog);
      el.removeEventListener('loom-table-row-click', onClk);
    };
  }, [onRowSelect, onRowToggle, onRowClick]);

  return (
    <TableRowElement
      ref={ref}
      row-id={rowId}
      {...(header ? { header: '' } : {})}
      {...(selected ? { selected: '' } : {})}
      {...(expandable ? { expandable: '' } : {})}
      {...(expanded ? { expanded: '' } : {})}
      {...(interactive ? { interactive: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </TableRowElement>
  );
}
