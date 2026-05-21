import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export const LINK_COLORS = ['default', 'inherit'] as const;
export const LINK_UNDERLINES = ['always', 'hover', 'none'] as const;

export type LinkColor = typeof LINK_COLORS[number];
export type LinkUnderline = typeof LINK_UNDERLINES[number];

export interface LinkOwnProps<T extends ElementType = 'a'> {
  as?: T;
  color?: LinkColor;
  underline?: LinkUnderline;
  children: ReactNode;
}

export type LinkProps<T extends ElementType = 'a'> =
  LinkOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof LinkOwnProps<T>>;
