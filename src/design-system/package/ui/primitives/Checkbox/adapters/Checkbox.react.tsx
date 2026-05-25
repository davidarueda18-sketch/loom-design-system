import './Checkbox.element.ts';
import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import type { CheckboxChangeEventDetail, CheckboxProps } from '../Checkbox.types.ts';

const CheckboxElement = 'loom-checkbox' as ElementType;

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  shape,
  onChange,
  className,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CheckboxChangeEventDetail>).detail;
      onChange?.(detail);
    };
    el.addEventListener('loom-checkbox-change', handler);
    return () => el.removeEventListener('loom-checkbox-change', handler);
  }, [onChange]);

  return (
    <CheckboxElement
      ref={ref}
      {...(checked ? { checked: '' } : {})}
      {...(indeterminate ? { indeterminate: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      label={label}
      shape={shape}
      className={className}
      {...(props as object)}
    />
  );
}
