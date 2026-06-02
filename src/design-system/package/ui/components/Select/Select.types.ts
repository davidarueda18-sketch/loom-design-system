import type { ReactNode } from 'react';

/** Visual state exposed for documentation and demos. Runtime state is managed by `<loom-select>`. */
export type SelectState = 'default' | 'disabled' | 'error' | 'open';

/** Canonical select visual states used by Storybook controls and examples. */
export const SELECT_STATES = {
  default: 'default',
  disabled: 'disabled',
  error: 'error',
  open: 'open',
} as const satisfies Record<SelectState, SelectState>;

/** Detail payload emitted by `loom-select-change` when the selected option changes. */
export interface SelectChangeEventDetail {
  /** Selected option value, mirrored to form data when `name` is present. */
  value: string;
  /** User-facing label resolved from the selected option's `label` attribute or text content. */
  label: string;
}

/** React adapter props for the canonical `<loom-select>` custom element. */
export interface SelectProps {
  /** Visible field label rendered above the trigger. */
  label?: string;
  /** Placeholder shown while no value is selected. */
  placeholder?: string;
  /** Current selected option value. Also controls the form-associated value. */
  value?: string;
  /** Native form field name used by `FormData`. */
  name?: string;
  /** Disables trigger interaction and option selection. */
  disabled?: boolean;
  /** Shows the error visual state. Pair with `errorMessage` for helper text. */
  error?: boolean;
  /** Error text rendered below the trigger when `error` is true. */
  errorMessage?: string;
  /** Opens the menu. The Web Component also manages this attribute internally. */
  open?: boolean;
  /** Called when `<loom-select>` emits `loom-select-change`. */
  onChange?: (detail: SelectChangeEventDetail) => void;
  /** `loom-select-option` children projected into the menu slot. */
  children?: ReactNode;
  /** Optional class forwarded to the `<loom-select>` host. */
  className?: string;
}
