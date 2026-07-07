import type { ComponentPropsWithoutRef } from 'react';

export const STEPPER_STATES = ['default', 'active', 'completed'] as const;
export type StepperState = (typeof STEPPER_STATES)[number];

/** Step circle size, forwarded to every `loom-stepper-step`. Defaults to `md` (40px). */
export const STEPPER_SIZES = ['sm', 'md', 'lg'] as const;
export type StepperSize = (typeof STEPPER_SIZES)[number];

export interface StepperChangeEventDetail {
  step: number;
}

export interface StepperProps extends ComponentPropsWithoutRef<'div'> {
  steps: string[];
  current?: number;
  size?: StepperSize;
  onStepperChange?: (detail: StepperChangeEventDetail) => void;
}
