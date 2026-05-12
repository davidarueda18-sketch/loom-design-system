import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingTokenKey } from '../../../tokens/index.ts';

export const STACK_ALIGNS    = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
export const STACK_JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;

export type StackAlign   = typeof STACK_ALIGNS[number];
export type StackJustify = typeof STACK_JUSTIFIES[number];

export interface StackOwnProps<T extends ElementType = 'div'> {
  as?: T;
  gap?: SpacingTokenKey;
  align?: StackAlign;
  justify?: StackJustify;
  children?: ReactNode;
  className?: string;
}

export type StackProps<T extends ElementType = 'div'> =
  StackOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StackOwnProps<T>>;
