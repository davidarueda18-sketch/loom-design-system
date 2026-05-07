import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingTokenKey } from '../../../tokens/index.ts';

export interface BoxOwnProps<T extends ElementType = 'div'> {
  as?: T;
  padding?: SpacingTokenKey;
  paddingX?: SpacingTokenKey;
  paddingY?: SpacingTokenKey;
  children?: ReactNode;
}

export type BoxProps<T extends ElementType = 'div'> =
  BoxOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>;
