import figma from '@figma/code-connect';
import { IconButton } from '../../../../../package/ui/primitives/IconButton/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  IconButton,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=151-3149',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      variant: figma.enum('Variant', {
        Filled:  'filled',
        Ghost:   'ghost',
        Outline: 'outline',
        Brand:   'brand',
      }),
      size: figma.enum('Size', {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      selected: figma.enum('State', {
        Selected: true,
      }),
    },
    example: ({ variant, size, disabled, selected }) => (
      <loom-icon-button
        variant={variant}
        size={size}
        disabled={disabled}
        selected={selected}
        aria-label="Label"
      >
        <svg>{'<!-- icon SVG -->'}</svg>
      </loom-icon-button>
    ),
  },
);
