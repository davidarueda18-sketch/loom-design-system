import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export const CARD_VARIANTS = ['default', 'elevated', 'outlined'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

export interface CardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  variant?: CardVariant;
  title?: string;
  description?: string;
  children?: ReactNode;
}
