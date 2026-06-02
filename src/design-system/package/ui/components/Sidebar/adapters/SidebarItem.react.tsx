import './SidebarItem.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  SidebarItemProps,
  SidebarItemClickEventDetail,
  SidebarItemSelectEventDetail,
} from '../Sidebar.types.ts';

const SidebarItemElement = 'loom-sidebar-item' as ElementType;

export function SidebarItem({
  itemId,
  label,
  showIcon,
  selected,
  disabled,
  href,
  onItemClick,
  onItemSelect,
  className,
  children,
  ...props
}: SidebarItemProps) {
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
    <SidebarItemElement
      ref={ref}
      item-id={itemId}
      {...(label ? { label } : {})}
      {...(showIcon === false ? { 'show-icon': 'false' } : {})}
      {...(selected ? { selected: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      {...(href ? { href } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </SidebarItemElement>
  );
}
