import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingTokenKey } from '../../../tokens/index.ts';

export type InlineAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type InlineJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface InlineOwnProps<T extends ElementType = 'div'> {
  as?: T;
  gap?: SpacingTokenKey;
  align?: InlineAlign;
  justify?: InlineJustify;
  wrap?: boolean;
  children?: ReactNode;
  className?: string;
}

export type InlineProps<T extends ElementType = 'div'> =
  InlineOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof InlineOwnProps<T>>;
