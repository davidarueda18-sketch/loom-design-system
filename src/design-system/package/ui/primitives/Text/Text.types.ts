import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TypographyTokenKey } from '../../../tokens/index.ts';

export type TextAlign = 'start' | 'center' | 'end' | 'justify';

export interface TextOwnProps<T extends ElementType = 'p'> {
  as?: T;
  variant: TypographyTokenKey;
  align?: TextAlign;
  children?: ReactNode;
  className?: string;
}

export type TextProps<T extends ElementType = 'p'> =
  TextOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;
