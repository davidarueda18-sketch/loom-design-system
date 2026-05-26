import type { ReactNode } from 'react';

export type SelectState = 'default' | 'disabled' | 'error' | 'open';

export const SELECT_STATES = {
  default: 'default',
  disabled: 'disabled',
  error: 'error',
  open: 'open',
} as const satisfies Record<SelectState, SelectState>;

export interface SelectChangeEventDetail {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  open?: boolean;
  onChange?: (detail: SelectChangeEventDetail) => void;
  children?: ReactNode;
  className?: string;
}
