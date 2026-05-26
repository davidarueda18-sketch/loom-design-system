import figma from '@figma/code-connect';
import { Tag } from '../../../../../package/ui/primitives/Tag/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Tag,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-3605',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      value: figma.enum('Value', {
        Positive: undefined,
        Negative: 'negative',
        Neutral:  'neutral',
      }),
      showIcon: figma.boolean('Show icon', { true: undefined, false: 'false' }),
    },
    example: ({ value, showIcon }) => (
      <loom-tag
        value={value}
        label="23%"
        show-icon={showIcon}
      />
    ),
  },
);
