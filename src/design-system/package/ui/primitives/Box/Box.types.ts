import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingTokenKey } from '../../../tokens/index.ts';

export const BOX_DISPLAYS = [
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'contents',
  'none',
] as const;

export type BoxDisplay = (typeof BOX_DISPLAYS)[number];

export interface BoxOwnProps<T extends ElementType = 'div'> {
  as?: T;
  display?: BoxDisplay;
  padding?: SpacingTokenKey;
  paddingX?: SpacingTokenKey;
  paddingY?: SpacingTokenKey;
  children?: ReactNode;
}

export type BoxProps<T extends ElementType = 'div'> =
  BoxOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>;
