import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Supported visual variants for IconButton. */
export const ICON_BUTTON_VARIANTS = ['filled', 'ghost', 'outline', 'brand'] as const;
/** Supported size variants for IconButton. */
export const ICON_BUTTON_SIZES    = ['sm', 'md', 'lg'] as const;

/** Union type of valid IconButton variants. */
export type IconButtonVariant = typeof ICON_BUTTON_VARIANTS[number];
/** Union type of valid IconButton sizes. */
export type IconButtonSize    = typeof ICON_BUTTON_SIZES[number];

/**
 * Component-specific props shared by adapters and stories.
 */
export interface IconButtonOwnProps {
  /** Visual variant that controls fill, border and accent behavior. */
  variant?:     IconButtonVariant;
  /** Size token that controls button and icon dimensions. */
  size?:        IconButtonSize;
  /** Disables interaction and forwards `disabled` to the inner button. */
  disabled?:    boolean;
  /** Marks the button as pressed (toggle). Renders aria-pressed on the inner button. */
  selected?:    boolean;
  /** Required — icon-only buttons must have an accessible text alternative. */
  'aria-label': string;
  /** The icon to render. Wrap any SVG source in <Icon> to apply size tokens and a11y defaults. */
  children:     ReactNode;
}

/**
 * Public IconButton props.
 * Combines native button attributes with IconButton-specific API.
 */
export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, keyof IconButtonOwnProps> &
  IconButtonOwnProps;
