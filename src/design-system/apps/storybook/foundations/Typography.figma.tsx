import figma from '@figma/code-connect';
import { Text } from '../../../package/ui/primitives/Text/index.ts';
import '../loom-web-components.d.ts';

figma.connect(
  Text,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=5-208',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      variant: figma.enum('Variant', {
        'body/base':   'body-md',
        'body/SM':     'body-sm',
        'body/LG':     'body-lg',
        'label/Base':  'label-md',
        'label/SM':    'label-sm',
        'label/LG':    'label-lg',
        'heading/H1':  'heading-1',
        'heading/H2':  'heading-2',
        'heading/H3':  'heading-3',
        'heading/H4':  'heading-4',
        'heading/H5':  'heading-5',
        'heading/H6':  'heading-6',
        'display/LG':  'display-lg',
        'display/XL':  'display-xl',
        'display/2XL': 'display-2xl',
        overline:      'overline',
        caption:       'caption',
      }),
      content: figma.string('content'),
    },
    example: ({ variant, content }) => (
      <loom-text variant={variant}>{content}</loom-text>
    ),
  },
);
