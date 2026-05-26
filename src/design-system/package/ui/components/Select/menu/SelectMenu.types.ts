import type { ReactNode } from 'react';

export type SelectOptionState = 'default' | 'selected' | 'disabled';

export const SELECT_OPTION_STATES = {
  default: 'default',
  selected: 'selected',
  disabled: 'disabled',
} as const satisfies Record<SelectOptionState, SelectOptionState>;

export interface SelectOptionProps {
  value: string;
  label?: string;
  disabled?: boolean;
  description?: string;
  leadingIcon?: string;
  selected?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface SelectMenuProps {
  children?: ReactNode;
  className?: string;
}
