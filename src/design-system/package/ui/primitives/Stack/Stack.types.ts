import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingTokenKey } from '../../../tokens/index.ts';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

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
