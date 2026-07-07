import type { ComponentPropsWithoutRef } from 'react';

export const STEPPER_STEP_STATES = ['default', 'active', 'completed'] as const;
export type StepperStepState = (typeof STEPPER_STEP_STATES)[number];

/** Circle sizes, from smallest to largest. Defaults to `md` (40px). */
export const STEPPER_STEP_SIZES = ['sm', 'md', 'lg'] as const;
export type StepperStepSize = (typeof STEPPER_STEP_SIZES)[number];

export interface StepperStepProps extends ComponentPropsWithoutRef<'div'> {
  step?: string;
  label?: string;
  state?: StepperStepState;
  size?: StepperStepSize;
}
