import type { ComponentPropsWithoutRef } from 'react';

export const BADGE_STATES = ['default', 'progress', 'success', 'warning', 'danger', 'info'] as const;
export type BadgeState = (typeof BADGE_STATES)[number];

export const BADGE_VARIANTS = ['default', 'filled'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  state?: BadgeState;
  variant?: BadgeVariant;
  label?: string;
  /** Whether the label text is rendered. Set to `false` to show only the icon/dot. @default true */
  showLabel?: boolean;
}
