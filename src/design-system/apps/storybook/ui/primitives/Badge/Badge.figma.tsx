import figma from '@figma/code-connect';
import { Badge } from '../../../../../package/ui/primitives/Badge/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Badge,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-3625',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('label'),
      state: figma.enum('State', {
        Default: 'default',
        Progress: 'progress',
        Success: 'success',
        Warning: 'warning',
        Error: 'danger',
      }),
      variant: figma.enum('Variant', {
        Default: 'default',
        filled: 'filled',
      }),
      showLabel: figma.boolean('Show Status'),
    },
    example: ({ label, state, variant, showLabel }) => (
      <loom-badge state={state} variant={variant} label={label} show-label={String(showLabel)} />
    ),
  },
);
