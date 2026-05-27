import figma from '@figma/code-connect';
import { Toggle } from '../../../../../package/ui/primitives/Toggle/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Toggle,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-2727',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      checked: figma.enum('Toggle/State', {
        'On':          true,
        'Disabled-on': true,
      }),
      disabled: figma.enum('Toggle/State', {
        'Disabled-off': true,
        'Disabled-on':  true,
      }),
    },
    example: ({ label, checked, disabled }) => (
      <loom-toggle
        label={label}
        checked={checked}
        disabled={disabled}
      />
    ),
  },
);
