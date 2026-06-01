import './Pagination.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  PaginationProps,
  PaginationChangeEventDetail,
  PaginationSizeChangeEventDetail,
} from '../Pagination.types.ts';

const PaginationElement = 'loom-pagination' as ElementType;

export function Pagination({
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  siblings,
  compact,
  disabled,
  onChange,
  onSizeChange,
  className,
  children,
  ...props
}: PaginationProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChg = (e: Event): void =>
      onChange?.((e as CustomEvent<PaginationChangeEventDetail>).detail);
    const onSize = (e: Event): void =>
      onSizeChange?.((e as CustomEvent<PaginationSizeChangeEventDetail>).detail);
    el.addEventListener('loom-pagination-change', onChg);
    el.addEventListener('loom-pagination-size-change', onSize);
    return () => {
      el.removeEventListener('loom-pagination-change', onChg);
      el.removeEventListener('loom-pagination-size-change', onSize);
    };
  }, [onChange, onSizeChange]);

  return (
    <PaginationElement
      ref={ref}
      page={page}
      page-size={pageSize}
      total-items={totalItems}
      page-size-options={pageSizeOptions}
      siblings={siblings}
      {...(compact ? { compact: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </PaginationElement>
  );
}
