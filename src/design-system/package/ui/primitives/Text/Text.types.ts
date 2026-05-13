import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TypographyTokenKey } from '../../../tokens/index.ts';

export type TextAlign = 'start' | 'center' | 'end' | 'justify';

export type TextVariant =
  | 'body-sm'  | 'body-md'  | 'body-lg'
  | 'label-sm' | 'label-md' | 'label-lg'
  | 'heading-1' | 'heading-2' | 'heading-3'
  | 'heading-4' | 'heading-5' | 'heading-6'
  | 'display-lg' | 'display-xl' | 'display-2xl'
  | 'caption' | 'overline';

export const variantTokenMap = {
  'body-sm':    'bodySm',
  'body-md':    'bodyBase',
  'body-lg':    'bodyLg',
  'label-sm':   'labelSm',
  'label-md':   'labelBase',
  'label-lg':   'labelLg',
  'heading-1':  'headingH1',
  'heading-2':  'headingH2',
  'heading-3':  'headingH3',
  'heading-4':  'headingH4',
  'heading-5':  'headingH5',
  'heading-6':  'headingH6',
  'display-lg': 'displayLg',
  'display-xl': 'displayXl',
  'display-2xl':'display2xl',
  caption:      'caption',
  overline:     'overline',
} as const satisfies Record<TextVariant, TypographyTokenKey>;

export interface TextOwnProps<T extends ElementType = 'p'> {
  as?: T;
  variant: TextVariant;
  align?: TextAlign;
  children?: ReactNode;
  className?: string;
}

export type TextProps<T extends ElementType = 'p'> =
  TextOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;
