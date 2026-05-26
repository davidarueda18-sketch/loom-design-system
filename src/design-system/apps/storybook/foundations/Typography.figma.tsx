import figma from '@figma/code-connect';
import { TypographyText } from '../../../package/tokens/typography/index.ts';

figma.connect(
  TypographyText,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=5-208',
  {
    imports: ["import '@loom-sdc/design-system/style.css'"],
    props: {
      variant: figma.enum('Variant', {
        'body/base':   'loom-body-md',
        'body/SM':     'loom-body-sm',
        'body/LG':     'loom-body-lg',
        'label/Base':  'loom-label-md',
        'label/SM':    'loom-label-sm',
        'label/LG':    'loom-label-lg',
        'heading/H1':  'loom-heading-1',
        'heading/H2':  'loom-heading-2',
        'heading/H3':  'loom-heading-3',
        'heading/H4':  'loom-heading-4',
        'heading/H5':  'loom-heading-5',
        'heading/H6':  'loom-heading-6',
        'display/LG':  'loom-display-lg',
        'display/XL':  'loom-display-xl',
        'display/2XL': 'loom-display-2xl',
        overline:      'loom-overline',
        caption:       'loom-caption',
      }),
      content: figma.string('content'),
    },
    example: ({ variant, content }) => (
      <p className={variant}>{content}</p>
    ),
  },
);
