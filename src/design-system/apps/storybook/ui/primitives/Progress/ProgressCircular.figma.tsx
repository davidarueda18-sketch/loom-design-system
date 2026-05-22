import figma from '@figma/code-connect';
import { ProgressCircular } from '../../../../package/ui/primitives/Progress/index.ts';

figma.connect(
  ProgressCircular,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-3554',
  {
    props: {
      value: figma.enum('Value', {
        '25':  25,
        '50':  50,
        '75':  75,
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
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      label:     figma.string('Label'),
      showValue: figma.boolean('Show Value'),
    },
    example: ({ value, indeterminate, thickness, size, label, showValue }) => (
      <ProgressCircular
        value={value}
        indeterminate={indeterminate}
        thickness={thickness}
        size={size}
        label={label}
        showValue={showValue}
      />
    ),
  },
);
