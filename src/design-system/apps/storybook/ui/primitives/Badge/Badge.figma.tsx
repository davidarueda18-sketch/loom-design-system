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
        Finished: 'success',
        Warning: 'warning',
        Error: 'danger',
      }),
    },
    example: ({ label, state }) => (
      <loom-badge state={state} label={label} />
    ),
  },
);
