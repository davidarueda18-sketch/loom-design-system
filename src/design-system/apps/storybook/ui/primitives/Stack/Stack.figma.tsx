import figma from '@figma/code-connect';
import { Stack } from '../../../../../package/ui/primitives/Stack/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Stack,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=170-4376',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      // Default is 'stretch' → omit (Law 4)
      align: figma.enum('Align', {
        stretch: undefined,
        start:   'start',
        center:  'center',
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
      <loom-stack align={align} gap={gap} justify={justify}>
        {/* items */}
      </loom-stack>
    ),
  },
);
