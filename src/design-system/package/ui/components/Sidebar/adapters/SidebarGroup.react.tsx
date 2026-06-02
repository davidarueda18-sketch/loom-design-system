import './SidebarGroup.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  SidebarGroupProps,
  SidebarGroupToggleEventDetail,
  SidebarItemSelectEventDetail,
} from '../Sidebar.types.ts';

const SidebarGroupElement = 'loom-sidebar-group' as ElementType;

export function SidebarGroup({
  groupId,
  label,
  showIcon,
  selected,
  expanded,
  disabled,
  onGroupToggle,
  onItemSelect,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTog = (e: Event): void =>
      onGroupToggle?.((e as CustomEvent<SidebarGroupToggleEventDetail>).detail);
    const onSel = (e: Event): void =>
      onItemSelect?.((e as CustomEvent<SidebarItemSelectEventDetail>).detail);
    el.addEventListener('loom-sidebar-group-toggle', onTog);
    el.addEventListener('loom-sidebar-item-select', onSel);
    return () => {
      el.removeEventListener('loom-sidebar-group-toggle', onTog);
      el.removeEventListener('loom-sidebar-item-select', onSel);
    };
  }, [onGroupToggle, onItemSelect]);

  return (
    <SidebarGroupElement
      ref={ref}
      group-id={groupId}
      {...(label ? { label } : {})}
      {...(showIcon === false ? { 'show-icon': 'false' } : {})}
      {...(selected ? { selected: '' } : {})}
      {...(expanded ? { expanded: '' } : {})}
      {...(disabled ? { disabled: '' } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </SidebarGroupElement>
  );
}
