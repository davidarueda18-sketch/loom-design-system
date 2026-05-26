import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export const ICON_BUTTON_VARIANTS = ['filled', 'ghost', 'outline', 'brand'] as const;
export const ICON_BUTTON_SIZES    = ['sm', 'md', 'lg'] as const;

export type IconButtonVariant = typeof ICON_BUTTON_VARIANTS[number];
export type IconButtonSize    = typeof ICON_BUTTON_SIZES[number];

export interface IconButtonOwnProps {
  variant?:     IconButtonVariant;
  size?:        IconButtonSize;
  disabled?:    boolean;
  /** Marks the button as pressed (toggle). Renders aria-pressed on the inner button. */
  selected?:    boolean;
  /** Required — icon-only buttons must have an accessible text alternative. */
  'aria-label': string;
  /** The icon to render. Use <Icon> or a plain SVG. */
  children:     ReactNode;
}

export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, keyof IconButtonOwnProps> &
  IconButtonOwnProps;
