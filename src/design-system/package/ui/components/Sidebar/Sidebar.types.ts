import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ------------------------------------------------------------------ *
 * Event detail shapes
 * ------------------------------------------------------------------ */

export interface SidebarToggleEventDetail {
  collapsed: boolean;
}

export interface SidebarSelectEventDetail {
  id: string;
}

export interface SidebarItemClickEventDetail {
  itemId: string;
}

export interface SidebarItemSelectEventDetail {
  itemId: string;
  selected: boolean;
}

export interface SidebarGroupToggleEventDetail {
  groupId: string;
  expanded: boolean;
}

/* ------------------------------------------------------------------ *
 * React prop interfaces (thin wrappers over the loom-* elements)
 * ------------------------------------------------------------------ */

export interface SidebarOwnProps {
  collapsed?: boolean;
  label?: string;
  logoSrc?: string;
  compactLogoSrc?: string;
  logoAlt?: string;
  toggleLabel?: string;
  onToggle?: (detail: SidebarToggleEventDetail) => void;
  onSelect?: (detail: SidebarSelectEventDetail) => void;
  children?: ReactNode;
}
export type SidebarProps = SidebarOwnProps &
  Omit<ComponentPropsWithoutRef<'nav'>, keyof SidebarOwnProps>;

export interface SidebarItemOwnProps {
  itemId?: string;
  label?: string;
  showIcon?: boolean;
  selected?: boolean;
  disabled?: boolean;
  href?: string;
  onItemClick?: (detail: SidebarItemClickEventDetail) => void;
  onItemSelect?: (detail: SidebarItemSelectEventDetail) => void;
  children?: ReactNode;
}
export type SidebarItemProps = SidebarItemOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SidebarItemOwnProps>;

export interface SidebarSubitemOwnProps {
  itemId?: string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  onItemClick?: (detail: SidebarItemClickEventDetail) => void;
  onItemSelect?: (detail: SidebarItemSelectEventDetail) => void;
  children?: ReactNode;
}
export type SidebarSubitemProps = SidebarSubitemOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SidebarSubitemOwnProps>;

export interface SidebarGroupOwnProps {
  groupId?: string;
  label?: string;
  showIcon?: boolean;
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  onGroupToggle?: (detail: SidebarGroupToggleEventDetail) => void;
  onItemSelect?: (detail: SidebarItemSelectEventDetail) => void;
  children?: ReactNode;
}
export type SidebarGroupProps = SidebarGroupOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SidebarGroupOwnProps>;
