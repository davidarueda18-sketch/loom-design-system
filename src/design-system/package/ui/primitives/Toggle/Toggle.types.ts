import type { ComponentPropsWithoutRef } from 'react';

export const TOGGLE_STATES = ['off', 'on', 'disabled'] as const;
export type ToggleState = (typeof TOGGLE_STATES)[number];

export interface ToggleChangeEventDetail {
  checked: boolean;
}

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Whether the toggle is on */
  checked?: boolean;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Label text shown next to the toggle */
  label?: string;
  /** Form field name */
  name?: string;
  /** Form field value when checked (default: "on") */
  value?: string;
  /** Fired when the user toggles the switch */
  onChange?: (detail: ToggleChangeEventDetail) => void;
}
