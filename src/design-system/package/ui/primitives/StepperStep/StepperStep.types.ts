import type { ComponentPropsWithoutRef } from 'react';

export const STEPPER_STEP_STATES = ['default', 'active', 'completed'] as const;
export type StepperStepState = (typeof STEPPER_STEP_STATES)[number];

export interface StepperStepProps extends ComponentPropsWithoutRef<'div'> {
  step?: string;
  label?: string;
  state?: StepperStepState;
}
