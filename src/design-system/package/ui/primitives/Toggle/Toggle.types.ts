import type { ComponentPropsWithoutRef } from 'react';

/**
 * Supported visual and interaction states for `loom-toggle`.
 */
export const TOGGLE_STATES = ['off', 'on', 'disabled'] as const;

/**
 * Union type representing the current toggle state.
 */
export type ToggleState = (typeof TOGGLE_STATES)[number];

/**
 * Payload emitted by `loom-toggle-change`.
 */
export interface ToggleChangeEventDetail {
  /** Whether the toggle is checked after the interaction. */
  checked: boolean;
}

/**
 * Public props for the Toggle primitive and adapters.
 */
export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Whether the toggle is currently on. */
  checked?: boolean;
  /** Whether user interaction is blocked. */
  disabled?: boolean;
  /** Optional text rendered next to the track. */
  label?: string;
  /** Name used when the component participates in a form submission. */
  name?: string;
  /** Submitted value when checked. Defaults to `"on"`. */
  value?: string;
  /**
   * Fired after user interaction toggles the control.
   * Receives the normalized event payload from `loom-toggle-change`.
   */
  onChange?: (detail: ToggleChangeEventDetail) => void;
}
