import figma from '@figma/code-connect';
import { Checkbox } from '../../../../../package/ui/primitives/Checkbox/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-2636',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      checked: figma.enum('State', {
        Selected: true,
      }),
      indeterminate: figma.enum('State', {
        Indeterminate: true,
      }),
      disabled: figma.enum('State', {
        Disable: true,
      }),
      shape: figma.enum('Shape', {
        Default:  undefined,
        Circular: 'circle',
      }),
    },
    example: ({ label, checked, indeterminate, disabled, shape }) => (
      <loom-checkbox
        label={label}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        shape={shape}
      />
    ),
  },
);
