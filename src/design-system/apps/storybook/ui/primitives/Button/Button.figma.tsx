import figma from '@figma/code-connect';
import { Button } from '../../../../../package/ui/primitives/Button/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Button,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=17-427',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      children: figma.string('Label'),
      variant: figma.enum('Type', {
        Primary: 'primary',
        Outline: 'outline',
        Text: 'text',
      }),
      size: figma.enum('Size', {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: ({ children, variant, size, disabled }) => (
      <loom-button variant={variant} size={size} disabled={disabled}>
        {children}
      </loom-button>
    ),
  },
);
