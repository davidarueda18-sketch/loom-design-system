import type { ComponentPropsWithoutRef } from 'react';

/** Canonical checkbox states used by docs and demos. */
export const CHECKBOX_STATES = ['default', 'checked', 'indeterminate', 'disabled'] as const;
/** Visual/interaction state for a checkbox instance. */
export type CheckboxState = (typeof CHECKBOX_STATES)[number];

/** Supported checkbox shapes for the visual box. */
export const CHECKBOX_SHAPES = ['square', 'circle'] as const;
/** Visual shape applied to the checkbox box part. */
export type CheckboxShape = (typeof CHECKBOX_SHAPES)[number];

/** Detail payload emitted by `loom-checkbox-change`. */
export interface CheckboxChangeEventDetail {
  /** Current checked state after the interaction. */
  checked: boolean;
  /** Whether the checkbox remains in a mixed state. */
  indeterminate: boolean;
}

/** React adapter props for the canonical `<loom-checkbox>` custom element. */
export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Whether the checkbox is checked. */
  checked?: boolean;
  /** Whether the checkbox is in an indeterminate (mixed) state. */
  indeterminate?: boolean;
  /** Disables interaction and keyboard toggling. */
  disabled?: boolean;
  /** Label text shown next to the checkbox. */
  label?: string;
  /** Visual shape of the checkbox box. */
  shape?: CheckboxShape;
  /** Called when `<loom-checkbox>` emits `loom-checkbox-change`. */
  onChange?: (detail: CheckboxChangeEventDetail) => void;
}
