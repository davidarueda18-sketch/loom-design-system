import './TabItem.element.ts';
import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import type { TabItemProps, TabItemSelectEventDetail } from '../TabItem.types.ts';

const TabItemElement = 'loom-tab-item' as ElementType;

export function TabItem({
  value,
  label,
  active = false,
  disabled = false,
  showIcon = false,
  onSelect,
  className,
  children,
  ...props
}: TabItemProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TabItemSelectEventDetail>).detail;
      onSelect?.(detail);
    };
    el.addEventListener('loom-tab-item-select', handler);
    return () => el.removeEventListener('loom-tab-item-select', handler);
  }, [onSelect]);

  return (
    <TabItemElement
      ref={ref}
      value={value}
      label={label}
      {...(active    ? { active: '' }     : {})}
      {...(disabled  ? { disabled: '' }   : {})}
      {...(showIcon  ? { 'show-icon': '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </TabItemElement>
  );
}
