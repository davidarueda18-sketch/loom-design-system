import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export const BUTTON_VARIANTS = ['primary', 'outline', 'text'] as const;
export const BUTTON_SIZES    = ['sm', 'md', 'lg'] as const;

/** Visual intent of the Loom button. Maps to the `variant` attribute on `<loom-button>`. */
export type ButtonVariant = typeof BUTTON_VARIANTS[number];
/** Density and label typography scale for the Loom button. Maps to the `size` attribute on `<loom-button>`. */
export type ButtonSize    = typeof BUTTON_SIZES[number];

export interface ButtonOwnProps<T extends ElementType = 'button'> {
  /**
   * Reserved React polymorphic prop kept for compatibility with previous wrapper usage.
   * The React adapter renders the canonical `<loom-button>` custom element so runtime
   * behavior remains aligned with the Web Component contract.
   */
  as?: T;
  /**
   * Visual treatment of the action.
   * - `primary` emphasizes the main action in a workflow.
   * - `outline` gives secondary actions a bordered treatment.
   * - `text` renders a low-emphasis action with minimal chrome.
   * Defaults to `primary`.
   */
  variant?: ButtonVariant;
  /**
   * Button size and matching label typography.
   * - `sm` for compact toolbars and dense layouts.
   * - `md` for the default product UI action size.
   * - `lg` for higher-emphasis actions in spacious layouts.
   * Defaults to `md`.
   */
  size?: ButtonSize;
  /**
   * Button label or slotted content. In the Web Component API this is projected into
   * the default slot and rendered inside `part="label"`.
   */
  children: ReactNode;
}

/**
 * React adapter props for `Button`. Native attributes such as `disabled`, `aria-label`,
 * and event handlers are forwarded to the underlying `<loom-button>` host.
 */
export type ButtonProps<T extends ElementType = 'button'> =
  ButtonOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;
