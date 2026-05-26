import figma from '@figma/code-connect';
import { Divider } from '../../../../../package/ui/primitives/Divider/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Divider,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=65-515',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      orientation: figma.enum('Orientation', {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      }),
      labelPosition: figma.enum('Label', {
        None: undefined,
        Left: 'start',
        Center: 'center',
        Right: 'end',
      }),
    },
    example: ({ orientation, labelPosition }) => (
      <loom-divider
        orientation={orientation}
        label="Label"
        label-position={labelPosition}
      />
    ),
  },
);
