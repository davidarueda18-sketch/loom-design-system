import figma from '@figma/code-connect';
import { Card } from '../../../../../package/ui/components/Card/index.ts';
import '../../../loom-web-components.d.ts';

// ─── Structured content: Default / Elevated / Outlined ───────────────────────

figma.connect(
  Card,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=65-420',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      variant: figma.enum('cardVariant', {
        Default: undefined,
        Elevated: 'elevated',
        Outlined: 'outlined',
      }),
      title: figma.string('title'),
      description: figma.boolean('showDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      showImage: figma.boolean('showImage', {
        true: true,
        false: undefined,
      }),
      showAction: figma.boolean('showActionButton', {
        true: true,
        false: undefined,
      }),
    },
    example: ({ variant, title, description, showImage, showAction }) => (
      <loom-card variant={variant} title={title} description={description}>
        {showImage && (
          <img slot="image" src="https://example.com/image.jpg" alt="Card image" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
        )}
        {showAction && (
          <loom-link slot="action" href="#">Ver más</loom-link>
        )}
      </loom-card>
    ),
  },
);

// ─── Free content ────────────────────────────────────────────────────────────

figma.connect(
  Card,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=65-442',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    example: () => (
      <loom-card variant="outlined">
        <p>Contenido libre aquí</p>
      </loom-card>
    ),
  },
);
