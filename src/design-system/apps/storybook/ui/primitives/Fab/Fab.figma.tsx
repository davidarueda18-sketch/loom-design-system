import figma from '@figma/code-connect';
import { Fab } from '../../../../../package/ui/primitives/Fab/index.ts';
import '../../../loom-web-components.d.ts';

// FAB with icon
figma.connect(
  Fab,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=17-569',
  {
    variant: { Content: 'Icon' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      size: figma.enum('Size', {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: ({ label, size, disabled }) => (
      <loom-fab content="icon" size={size} aria-label={label} disabled={disabled}>
        <svg>{'<!-- icon SVG -->'}</svg>
      </loom-fab>
    ),
  },
);

// FAB with text
figma.connect(
  Fab,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=17-569',
  {
    variant: { Content: 'Text' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      size: figma.enum('Size', {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: ({ label, size, disabled }) => (
      <loom-fab content="text" size={size} label={label} disabled={disabled} />
    ),
  },
);
