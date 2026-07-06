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
  mobileOrder,
  mobileAlign,
  variant,
  label,
  description,
  showDescription,
  badgeLabel,
  badgeState,
  cellKey,
  descriptionKey,
  showProgress,
  progressValue,
  startDate,
  targetDate,
  startLabel,
  targetLabel,
  leaderLabel,
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
      {...(mobileOrder !== undefined && mobileOrder >= 0 ? { 'mobile-order': mobileOrder } : {})}
      mobile-align={mobileAlign}
      variant={variant}
      label={label}
      description={description}
      {...(showDescription === false ? { 'show-description': 'false' } : {})}
      badge-label={badgeLabel}
      badge-state={badgeState}
      cell-key={cellKey}
      description-key={descriptionKey}
      {...(showProgress ? { 'show-progress': '' } : {})}
      {...(progressValue !== undefined ? { 'progress-value': progressValue } : {})}
      start-date={startDate}
      target-date={targetDate}
      start-label={startLabel}
      target-label={targetLabel}
      leader-label={leaderLabel}
      className={className}
      {...(props as object)}
    >
      {children}
    </TableCellElement>
  );
}
