import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../../../../package/ui/primitives/Text/index.ts';
import { fontFamilyVars } from '../../../../../package/tokens/fontFamily/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';

const VARIANT_OPTIONS = [
  'display2xl', 'displayXl', 'displayLg',
  'headingH1', 'headingH2', 'headingH3', 'headingH4', 'headingH5', 'headingH6',
  'bodyLg', 'bodyBase', 'bodySm',
  'labelLg', 'labelBase', 'labelSm',
  'overline', 'caption',
] as const;

const meta = {
  title: 'Primitives/Text',
  component: Text,
  argTypes: {
    variant: { control: 'select', options: VARIANT_OPTIONS },
    as: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'figcaption'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'bodyBase',
    children: 'Loom Design System',
    style: { fontFamily: fontFamilyVars.sans, color: '#e2e8f0' },
  },
};

export const Heading: Story = {
  name: 'Como encabezado',
  args: {
    as: 'h1',
    variant: 'headingH1',
    children: 'El diseño al servicio del producto',
    style: { fontFamily: fontFamilyVars.sans, color: '#e2e8f0' },
  },
};

export const Overline: Story = {
  name: 'Overline + Caption',
  args: { variant: 'overline' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text
        variant="overline"
        style={{ fontFamily: fontFamilyVars.sans, color: '#94a3b8', textTransform: 'uppercase' }}
      >
        Categoría de sección
      </Text>
      <Text
        variant="headingH3"
        style={{ fontFamily: fontFamilyVars.sans, color: '#e2e8f0' }}
      >
        Título de la sección
      </Text>
      <Text
        variant="caption"
        style={{ fontFamily: fontFamilyVars.sans, color: '#64748b' }}
      >
        Texto de ayuda o descripción secundaria para dar contexto al contenido principal.
      </Text>
    </div>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  args: { variant: 'bodyBase' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Text as="label" variant="labelBase" style={{ fontFamily: fontFamilyVars.sans, color: '#94a3b8' }}>
        Etiqueta de campo
      </Text>
      <Text as="figcaption" variant="caption" style={{ fontFamily: fontFamilyVars.sans, color: '#64748b' }}>
        Pie de imagen renderizado como &lt;figcaption&gt;
      </Text>
      <Text as="span" variant="bodySm" style={{ fontFamily: fontFamilyVars.sans, color: '#e2e8f0' }}>
        Inline text como &lt;span&gt;
      </Text>
    </div>
  ),
};
