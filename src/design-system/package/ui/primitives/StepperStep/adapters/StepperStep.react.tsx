import './StepperStep.element.ts';
import type { ElementType } from 'react';
import type { StepperStepProps } from '../StepperStep.types.ts';

export function StepperStep({ step = '1', label = '', state = 'default', className, ...props }: StepperStepProps) {
  const StepperStepElement = 'loom-stepper-step' as ElementType;
  return (
    <StepperStepElement
      step={step}
      label={label}
      state={state}
      className={className}
      {...(props as object)}
    />
  );
}
