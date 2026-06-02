import type { ReactNode } from 'react';

/** Visual state for an individual `loom-select-option`. */
export type SelectOptionState = 'default' | 'selected' | 'disabled';

/** Canonical option states used by Storybook controls and examples. */
export const SELECT_OPTION_STATES = {
  default: 'default',
  selected: 'selected',
  disabled: 'disabled',
} as const satisfies Record<SelectOptionState, SelectOptionState>;

/** React adapter props for the canonical `<loom-select-option>` custom element. */
export interface SelectOptionProps {
  /** Submitted value emitted in `loom-select-change.detail.value`. */
  value: string;
  /** User-facing option text. Falls back to text content when omitted. */
  label?: string;
  /** Prevents selection and exposes `aria-disabled="true"`. */
  disabled?: boolean;
  /** Secondary text rendered below the label. */
  description?: string;
  /** Icon name rendered before the label via `<loom-icon>`. */
  leadingIcon?: string;
  /** Marks the option selected and exposes `aria-selected="true"`. */
  selected?: boolean;
  /** Optional fallback content when no `label` attribute is provided. */
  children?: ReactNode;
  /** Optional class forwarded to the `<loom-select-option>` host. */
  className?: string;
}

/** React adapter props for the internal `<loom-select-menu>` container. */
export interface SelectMenuProps {
  /** Slotted `loom-select-option` children managed by `<loom-select>`. */
  children?: ReactNode;
  /** Optional class forwarded to the `<loom-select-menu>` host. */
  className?: string;
}
