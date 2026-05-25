import type { ComponentPropsWithoutRef } from 'react';

export const BADGE_STATES = ['default', 'progress', 'success', 'warning', 'danger', 'info'] as const;
export type BadgeState = (typeof BADGE_STATES)[number];

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  state?: BadgeState;
  label?: string;
}
