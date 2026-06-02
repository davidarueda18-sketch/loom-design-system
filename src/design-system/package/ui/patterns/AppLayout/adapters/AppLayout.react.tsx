import './AppLayout.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type { AppLayoutProps, AppLayoutDrawerToggleEventDetail } from '../AppLayout.types.ts';

const AppLayoutElement = 'loom-app-layout' as ElementType;

export function AppLayout({
  responsive,
  mobileBreakpoint,
  menuButton,
  onDrawerToggle,
  className,
  children,
  ...props
}: AppLayoutProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTog = (e: Event): void =>
      onDrawerToggle?.((e as CustomEvent<AppLayoutDrawerToggleEventDetail>).detail);
    el.addEventListener('loom-app-layout-drawer-toggle', onTog);
    return () => el.removeEventListener('loom-app-layout-drawer-toggle', onTog);
  }, [onDrawerToggle]);

  return (
    <AppLayoutElement
      ref={ref}
      {...(responsive ? { responsive: '' } : {})}
      {...(mobileBreakpoint ? { 'mobile-breakpoint': mobileBreakpoint } : {})}
      {...(menuButton ? { 'menu-button': menuButton } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </AppLayoutElement>
  );
}
