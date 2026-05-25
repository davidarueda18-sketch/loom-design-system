import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export const FAB_SIZES    = ['sm', 'md', 'lg'] as const;
export const FAB_CONTENTS = ['icon', 'text'] as const;

export type FabSize    = typeof FAB_SIZES[number];
export type FabContent = typeof FAB_CONTENTS[number];

export interface FabOwnProps<T extends ElementType = 'button'> {
  as?: T;
  size?: FabSize;
  /** Render mode: "icon" shows a centered icon with aria-label; "text" shows a short numeric label */
  content?: FabContent;
  /** aria-label when content="icon"; visible text when content="text" */
  label: string;
  /** Icon node — required when content="icon" */
  icon?: ReactNode;
  disabled?: boolean;
}

export type FabProps<T extends ElementType = 'button'> =
  FabOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof FabOwnProps<T>>;
