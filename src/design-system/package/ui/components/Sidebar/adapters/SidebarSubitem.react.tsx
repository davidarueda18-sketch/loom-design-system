import './SidebarSubitem.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  SidebarSubitemProps,
  SidebarItemClickEventDetail,
  SidebarItemSelectEventDetail,
} from '../Sidebar.types.ts';

const SidebarSubitemElement = 'loom-sidebar-subitem' as ElementType;

export function SidebarSubitem({
  itemId,
  label,
  selected,
  disabled,
  onItemClick,
  onItemSelect,
  className,
  children,
  ...props
}: SidebarSubitemProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClk = (e: Event): void =>
      onItemClick?.((e as CustomEvent<SidebarItemClickEventDetail>).detail);
    const onSel = (e: Event): void =>
      onItemSelect?.((e as CustomEvent<SidebarItemSelectEventDetail>).detail);
    el.addEventListener('loom-sidebar-item-click', onClk);
    el.addEventListener('loom-sidebar-item-select', onSel);
    return () => {
      el.removeEventListener('loom-sidebar-item-click', onClk);
      el.removeEventListener('loom-sidebar-item-select', onSel);
    };
  }, [onItemClick, onItemSelect]);

  return (
    <SidebarSubitemElement
      ref={ref}
      item-id={itemId}
      {...(label ? { label } : {})}
      {...(selected ? { selected: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </SidebarSubitemElement>
  );
}
