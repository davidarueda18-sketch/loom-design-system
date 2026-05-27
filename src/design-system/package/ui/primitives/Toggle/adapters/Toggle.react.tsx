import './Toggle.element.ts';
import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import type { ToggleChangeEventDetail, ToggleProps } from '../Toggle.types.ts';

const ToggleElement = 'loom-toggle' as ElementType;

export function Toggle({
  checked = false,
  disabled = false,
  label,
  name,
  value,
  onChange,
  className,
  ...props
}: ToggleProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToggleChangeEventDetail>).detail;
      onChange?.(detail);
    };
    el.addEventListener('loom-toggle-change', handler);
    return () => el.removeEventListener('loom-toggle-change', handler);
  }, [onChange]);

  return (
    <ToggleElement
      ref={ref}
      {...(checked ? { checked: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      label={label}
      name={name}
      value={value}
      className={className}
      {...(props as object)}
    />
  );
}
