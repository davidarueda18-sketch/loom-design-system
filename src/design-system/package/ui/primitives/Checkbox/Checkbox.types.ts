import type { ComponentPropsWithoutRef } from 'react';

export const CHECKBOX_STATES = ['default', 'checked', 'indeterminate', 'disabled'] as const;
export type CheckboxState = (typeof CHECKBOX_STATES)[number];

export const CHECKBOX_SHAPES = ['square', 'circle'] as const;
export type CheckboxShape = (typeof CHECKBOX_SHAPES)[number];

export interface CheckboxChangeEventDetail {
  checked: boolean;
  indeterminate: boolean;
}

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Label text shown next to the checkbox */
  label?: string;
  /** Visual shape of the checkbox box */
  shape?: CheckboxShape;
  /** Fired when the user toggles the checkbox */
  onChange?: (detail: CheckboxChangeEventDetail) => void;
}
