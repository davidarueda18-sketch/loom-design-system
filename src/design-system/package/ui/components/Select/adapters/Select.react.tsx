import './Select.element.ts';
import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import type { SelectProps, SelectChangeEventDetail } from '../Select.types.ts';

const SelectElement = 'loom-select' as ElementType;

export function Select({
  label,
  placeholder,
  value,
  name,
  disabled = false,
  error = false,
  errorMessage,
  open,
  onChange,
  children,
  className,
  ...props
}: SelectProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SelectChangeEventDetail>).detail;
      onChange?.(detail);
    };
    el.addEventListener('loom-select-change', handler);
    return () => el.removeEventListener('loom-select-change', handler);
  }, [onChange]);

  return (
    <SelectElement
      ref={ref}
      label={label}
      placeholder={placeholder}
      value={value}
      name={name}
      {...(disabled ? { disabled: '' } : {})}
      {...(error ? { error: '' } : {})}
      error-message={errorMessage}
      {...(open ? { open: '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </SelectElement>
  );
}
