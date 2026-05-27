import figma from '@figma/code-connect';
import { Inline } from '../../../../../package/ui/primitives/Inline/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Inline,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=171-689',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      // Default is 'center' → omit (Law 4)
      align: figma.enum('Align', {
        stretch: 'stretch',
        start:   'start',
        center:  undefined,
        end:     'end',
      }),
      gap: figma.enum('Gap', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      // Default is 'start' → omit (Law 4)
      justify: figma.enum('Justify', {
        start:   undefined,
        center:  'center',
        end:     'end',
        between: 'between',
      }),
    },
    example: ({ align, gap, justify }) => (
      <loom-inline align={align} gap={gap} justify={justify}>
        {/* items */}
      </loom-inline>
    ),
  },
);
