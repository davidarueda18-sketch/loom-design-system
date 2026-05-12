import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export const BUTTON_VARIANTS = ['primary', 'outline', 'text'] as const;
export const BUTTON_SIZES    = ['sm', 'md', 'lg'] as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[number];
export type ButtonSize    = typeof BUTTON_SIZES[number];

export interface ButtonOwnProps<T extends ElementType = 'button'> {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export type ButtonProps<T extends ElementType = 'button'> =
  ButtonOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;
