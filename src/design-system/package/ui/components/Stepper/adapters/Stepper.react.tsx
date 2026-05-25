import './Stepper.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type { StepperProps, StepperChangeEventDetail } from '../Stepper.types.ts';

export function Stepper({ steps, current = 0, onStepperChange, className, ...props }: StepperProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onStepperChange) return;
    const handler = (e: Event) => {
      onStepperChange((e as CustomEvent<StepperChangeEventDetail>).detail);
    };
    el.addEventListener('loom-stepper-change', handler);
    return () => el.removeEventListener('loom-stepper-change', handler);
  }, [onStepperChange]);

  const StepperElement = 'loom-stepper' as ElementType;
  return (
    <StepperElement
      ref={ref}
      steps={JSON.stringify(steps)}
      current={String(current)}
      className={className}
      {...(props as object)}
    />
  );
}
