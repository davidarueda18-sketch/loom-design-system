import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TypographyTokenKey } from '../../../tokens/index.ts';

export interface TextOwnProps<T extends ElementType = 'p'> {
  as?: T;
  variant: TypographyTokenKey;
  children?: ReactNode;
  className?: string;
}

export type TextProps<T extends ElementType = 'p'> =
  TextOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;
