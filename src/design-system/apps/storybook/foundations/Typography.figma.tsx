import figma from '@figma/code-connect';
import { Text } from '../../../package/ui/primitives/Text/index.ts';

figma.connect(
  Text,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=5-208',
  {
    props: {
      variant: figma.enum('Variant', {
        'body/base':   'bodyBase',
        'body/SM':     'bodySm',
        'body/LG':     'bodyLg',
        'label/Base':  'labelBase',
        'label/SM':    'labelSm',
        'label/LG':    'labelLg',
        'heading/H1':  'headingH1',
        'heading/H2':  'headingH2',
        'heading/H3':  'headingH3',
        'heading/H4':  'headingH4',
        'heading/H5':  'headingH5',
        'heading/H6':  'headingH6',
        'display/LG':  'displayLg',
        'display/XL':  'displayXl',
        'display/2XL': 'display2xl',
        overline:      'overline',
        caption:       'caption',
      }),
      content: figma.string('content'),
    },
    example: ({ variant, content }) => (
      <Text variant={variant}>{content}</Text>
    ),
  },
);
