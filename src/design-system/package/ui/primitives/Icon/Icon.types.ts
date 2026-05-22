import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { ColorTokenKey, IconSizeTokenKey } from '../../../tokens/index.ts';

export const ICON_SIZES = ['xxs', 'xs', 'sm', 'mini', 'md', 'lg'] as const satisfies readonly IconSizeTokenKey[];

export type IconSize = typeof ICON_SIZES[number];
export type IconColor = ColorTokenKey;

export interface IconOwnProps<T extends ElementType = 'span'> {
  /** HTML element or component to render as. Defaults to `span`. */
  as?: T;
  /**
   * Size of the icon. Maps directly to `iconSize` design tokens.
   * — `xxs` 12px · `xs` 14px · `sm` 16px · `mini` 20px · `md` 24px · `lg` 32px
   *
   * Match to Heroicons sets: `sm` → micro (16), `mini` → mini (20), `md` → outline/solid (24).
   * Defaults to `md`.
   */
  size?: IconSize;
  /**
   * Semantic color token. When set, applies the corresponding CSS variable as `color`
   * so the SVG inherits it via `currentColor`.
   * If omitted, the icon inherits `color` from its parent.
   */
  color?: IconColor;
  /**
   * Accessible label for informative icons. When provided, renders `role="img"` and
   * `aria-label` with this value. Omit for purely decorative icons — they will be
   * hidden from assistive technology via `aria-hidden="true"`.
   */
  label?: string;
  /**
   * The SVG icon to display. Must be a **direct** SVG element — not wrapped in another
   * element — so that the `> svg` size and `currentColor` rules apply correctly.
   *
   * @example
   * ```tsx
   * import { BellIcon } from '@heroicons/react/24/outline';
   * <Icon size="md"><BellIcon /></Icon>
   * ```
   */
  children: ReactNode;
}

export type IconProps<T extends ElementType = 'span'> =
  IconOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof IconOwnProps<T>>;
