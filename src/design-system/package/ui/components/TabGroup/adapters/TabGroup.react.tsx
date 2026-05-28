import './TabGroup.element.ts';
import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import type { TabGroupProps, TabGroupChangeEventDetail } from '../TabGroup.types.ts';

const TabGroupElement = 'loom-tab-group' as ElementType;

export function TabGroup({
  active,
  onChange,
  className,
  children,
  ...props
}: TabGroupProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TabGroupChangeEventDetail>).detail;
      onChange?.(detail);
    };
    el.addEventListener('loom-tab-group-change', handler);
    return () => el.removeEventListener('loom-tab-group-change', handler);
  }, [onChange]);

  return (
    <TabGroupElement
      ref={ref}
      active={active}
      className={className}
      {...(props as object)}
    >
      {children}
    </TabGroupElement>
  );
}
