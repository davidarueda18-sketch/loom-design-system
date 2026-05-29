import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import '../../../../../package/ui/components/Card/adapters/Card.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Link/adapters/Link.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

import { CARD_VARIANTS } from '../../../../../package/ui/components/Card/Card.types.ts';
import type { CardVariant } from '../../../../../package/ui/components/Card/Card.types.ts';

// ─── Story arg interface ───────────────────────────────────────────────────────

interface CardStoryArgs {
  variant: CardVariant;
  title: string;
  description: string;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  args: {
    variant: 'default',
    title: 'Card title',
    description: 'A brief description of the card content goes here.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: CARD_VARIANTS,
      description: 'Estilo visual de la card',
    },
    title: {
      control: 'text',
      description: 'Título de la card. Su presencia activa el área de contenido estructurado.',
    },
    description: {
      control: 'text',
      description: 'Descripción secundaria debajo del título.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Contenedor visual con tres variantes de estilo, área de imagen opcional y soporte para contenido
estructurado (title + description + acción) o contenido libre (default slot).

\`\`\`html
<!-- Variante por defecto con imagen y acción -->
<loom-card title="Card title" description="Descripción aquí.">
  <img slot="image" src="..." alt="..." />
  <loom-link slot="action" href="#">Ver más</loom-link>
</loom-card>

<!-- Variante elevated -->
<loom-card variant="elevated" title="Card title" description="Descripción aquí.">
  <loom-link slot="action" href="#">Ver más</loom-link>
</loom-card>

<!-- Variante outlined con contenido libre -->
<loom-card variant="outlined">
  <p>Contenido libre sin estructura fija.</p>
</loom-card>
\`\`\`
        `.trim(),
      },
    },
  },
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<CardStoryArgs>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ variant, title, description }) => (
    <loom-card variant={variant} title={title} description={description}>
      <loom-link slot="action" href="#">Ver más</loom-link>
    </loom-card>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Las tres variantes visuales disponibles: `default`, `elevated` y `outlined`.',
      },
    },
  },
  render: () => (
    <loom-inline gap="lg" align="start" wrap>
      {CARD_VARIANTS.map((v) => (
        <loom-card key={v} variant={v} title={`Variante ${v}`} description="Descripción de ejemplo para esta variante de card.">
          <loom-link slot="action" href="#">Ver más</loom-link>
        </loom-card>
      ))}
    </loom-inline>
  ),
};

export const WithImage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Imagen de cabecera proyectada via `slot="image"`. El área de imagen solo se muestra cuando el slot tiene contenido.',
      },
    },
  },
  render: ({ variant, title, description }) => (
    <loom-card variant={variant} title={title} description={description}>
      <img
        slot="image"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80"
        alt="Paisaje montañoso"
        style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
      />
      <loom-link slot="action" href="#">Ver más</loom-link>
    </loom-card>
  ),
};

export const FreeContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cuando no se envía el atributo `title`, el área de contenido estructurado se oculta y el slot por defecto recibe contenido libre.',
      },
    },
  },
  render: () => (
    <loom-card variant="outlined">
      <loom-box padding="md">
        <loom-stack gap="sm">
          <strong>Contenido libre</strong>
          <p style={{ margin: 0 }}>
          Esta card no usa título ni descripción. El slot por defecto acepta cualquier contenido.
          </p>
        </loom-stack>
      </loom-box>
    </loom-card>
  ),
};

export const NoAction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sin `slot="action"`. El área CTA se oculta automáticamente cuando el slot está vacío.',
      },
    },
  },
  render: ({ variant, title, description }) => (
    <loom-card variant={variant} title={title} description={description} />
  ),
};

export const WebComponent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Uso directo del custom element `loom-card` sin envoltura React.',
      },
    },
  },
  render: () => (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<loom-card
  data-testid="card-wc"
  variant="elevated"
  title="Web Component"
  description="Card renderizada como custom element puro, sin wrapper React."
>
  <loom-link slot="action" href="#">Acción</loom-link>
</loom-card>
        `.trim(),
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId('card-wc') as HTMLElementTagNameMap['loom-card'];
    await expect(card).toBeTruthy();
    await expect(card.getAttribute('variant')).toBe('elevated');
    await expect(card.getAttribute('title')).toBe('Web Component');
  },
};
