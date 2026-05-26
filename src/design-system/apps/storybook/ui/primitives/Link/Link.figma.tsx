import figma from '@figma/code-connect';
import { Link } from '../../../../../package/ui/primitives/Link/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Link,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=17-925',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      color: figma.enum('Color', {
        inherit: 'inherit',
        default: 'default',
      }),
      underline: figma.enum('Underline', {
        none: 'none',
        always: 'always',
        hover: 'hover',
      }),
      disabled: figma.enum('State', {
        disabled: true,
      }),
    },
    example: ({ color, underline, disabled }) => (
      <loom-link
        href="#"
        color={color}
        underline={underline}
        aria-disabled={disabled}
      >
        Link text
      </loom-link>
    ),
  },
);
