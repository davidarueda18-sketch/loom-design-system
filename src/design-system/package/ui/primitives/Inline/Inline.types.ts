import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingTokenKey } from '../../../tokens/index.ts';

export const INLINE_ALIGNS    = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
export const INLINE_JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;

export type InlineAlign   = typeof INLINE_ALIGNS[number];
export type InlineJustify = typeof INLINE_JUSTIFIES[number];

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
