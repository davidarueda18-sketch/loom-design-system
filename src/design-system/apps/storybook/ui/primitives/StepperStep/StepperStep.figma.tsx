import figma from '@figma/code-connect';
import { StepperStep } from '../../../../../package/ui/primitives/StepperStep/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  StepperStep,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=65-168',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      step:  figma.string('step'),
      label: figma.string('Description'),
      state: figma.enum('State', {
        Default:  undefined,
        Selected: 'active',
      }),
    },
    example: ({ step, label, state }) => (
      <loom-stepper-step
        step={step}
        label={label}
        state={state}
      />
    ),
  },
);
