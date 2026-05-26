import figma from '@figma/code-connect';
import { ProgressLinear } from '../../../../../package/ui/primitives/Progress';
import '../../../loom-web-components.d.ts';

figma.connect(
  ProgressLinear,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-3477',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      value: figma.enum('Progress', {
        '0':   0,
        '10':  10,
        '20':  20,
        '50':  50,
        '80':  80,
        '100': 100,
        '—':   undefined,
      }),
      indeterminate: figma.enum('State', {
        determinate:   undefined,
        indeterminate: true,
      }),
      thickness: figma.enum('Thickness', {
        '4 dp': 'sm',
        '8 dp': 'md',
      }),
      shape: figma.enum('Shape', {
        flat: 'flat',
        wave: 'wave',
      }),
      label:     figma.string('Label'),
      showValue: figma.boolean('Show Value'),
    },
    example: ({ value, indeterminate, thickness, shape, label, showValue }) => (
      <loom-progress-linear
        value={value}
        indeterminate={indeterminate}
        thickness={thickness}
        shape={shape}
        label={label}
        show-value={showValue}
      />
    ),
  },
);
