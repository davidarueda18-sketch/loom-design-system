import type { ComponentPropsWithoutRef } from 'react';

export const STEPPER_STATES = ['default', 'active', 'completed'] as const;
export type StepperState = (typeof STEPPER_STATES)[number];

export interface StepperChangeEventDetail {
  step: number;
}

export interface StepperProps extends ComponentPropsWithoutRef<'div'> {
  steps: string[];
  current?: number;
  onStepperChange?: (detail: StepperChangeEventDetail) => void;
}
