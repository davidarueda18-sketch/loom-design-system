import './Sidebar.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type {
  SidebarProps,
  SidebarToggleEventDetail,
  SidebarSelectEventDetail,
} from '../Sidebar.types.ts';

const SidebarElement = 'loom-sidebar' as ElementType;

export function Sidebar({
  collapsed,
  label,
  logoSrc,
  compactLogoSrc,
  logoAlt,
  toggleLabel,
  onToggle,
  onSelect,
  className,
  children,
  ...props
}: SidebarProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTog = (e: Event): void =>
      onToggle?.((e as CustomEvent<SidebarToggleEventDetail>).detail);
    const onSel = (e: Event): void =>
      onSelect?.((e as CustomEvent<SidebarSelectEventDetail>).detail);
    el.addEventListener('loom-sidebar-toggle', onTog);
    el.addEventListener('loom-sidebar-select', onSel);
    return () => {
      el.removeEventListener('loom-sidebar-toggle', onTog);
      el.removeEventListener('loom-sidebar-select', onSel);
    };
  }, [onToggle, onSelect]);

  return (
    <SidebarElement
      ref={ref}
      {...(collapsed ? { collapsed: '' } : {})}
      {...(label ? { label } : {})}
      {...(logoSrc ? { 'logo-src': logoSrc } : {})}
      {...(compactLogoSrc ? { 'compact-logo-src': compactLogoSrc } : {})}
      {...(logoAlt ? { 'logo-alt': logoAlt } : {})}
      {...(toggleLabel ? { 'toggle-label': toggleLabel } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </SidebarElement>
  );
}
