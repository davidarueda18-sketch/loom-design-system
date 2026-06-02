import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ------------------------------------------------------------------ *
 * Event detail shapes
 * ------------------------------------------------------------------ */

export interface AppLayoutDrawerToggleEventDetail {
  /** `true` when the mobile drawer just opened, `false` when it closed. */
  open: boolean;
}

/* ------------------------------------------------------------------ *
 * Constants (no enums — `as const` union)
 * ------------------------------------------------------------------ */

/** Visibility modes for the built-in hamburger button. */
export const MENU_BUTTON_MODES = ['auto', 'always', 'never'] as const;
export type MenuButtonMode = (typeof MENU_BUTTON_MODES)[number];

/* ------------------------------------------------------------------ *
 * React prop interface (thin wrapper over the loom-app-layout element)
 * ------------------------------------------------------------------ */

export interface AppLayoutOwnProps {
  /**
   * Enable responsive behavior. Below `mobileBreakpoint` the sidebar becomes an
   * off-canvas drawer controlled by the built-in hamburger. Off by default.
   */
  responsive?: boolean;
  /** Max-width threshold (any CSS length) for mobile/drawer mode. Default `768px`. */
  mobileBreakpoint?: string;
  /** Built-in hamburger visibility: `auto` (mobile only), `always`, or `never`. Default `auto`. */
  menuButton?: MenuButtonMode;
  /** Fired when the mobile drawer opens or closes. */
  onDrawerToggle?: (detail: AppLayoutDrawerToggleEventDetail) => void;
  /**
   * Composition: place `loom-sidebar` with `slot="sidebar"`, `loom-navbar` with
   * `slot="navbar"`, and the page content in the default slot.
   */
  children?: ReactNode;
}

export type AppLayoutProps = AppLayoutOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof AppLayoutOwnProps>;
