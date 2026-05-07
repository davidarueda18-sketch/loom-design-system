import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../../../../package/ui/primitives/Stack/index.ts';

const SPACING_OPTIONS = ['none', 'px', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xl2', 'xl3'] as const;

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
  parameters: { layout: 'padded' },
  argTypes: {
    gap: {
      control: 'select',
      options: SPACING_OPTIONS,
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    as: {
      control: 'select',
      options: ['div', 'ul', 'ol', 'section', 'nav'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Item = ({ label, wide = false }: { label: string; wide?: boolean }) => (
  <div
    style={{
      background: '#e0e7ff',
      padding: '12px 16px',
      borderRadius: '4px',
      fontSize: '14px',
      width: wide ? '100%' : 'fit-content',
    }}
  >
    {label}
  </div>
);

export const Default: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Item label="Elemento 1" wide />
      <Item label="Elemento 2" wide />
      <Item label="Elemento 3" wide />
    </Stack>
  ),
};

export const AlignCenter: Story = {
  name: 'Align center',
  args: { gap: 'sm', align: 'center' },
  render: (args) => (
    <Stack {...args}>
      <Item label="Ancho completo" wide />
      <Item label="Ajustado al contenido" />
      <Item label="Ancho completo" wide />
    </Stack>
  ),
};

export const JustifyCenter: Story = {
  name: 'Justify center',
  args: { gap: 'md', justify: 'center' },
  render: (args) => (
    <Stack {...args} style={{ height: '300px', border: '1px dashed #94a3b8' }}>
      <Item label="Centrado verticalmente" wide />
      <Item label="En el eje principal" wide />
    </Stack>
  ),
};

export const GapComparison: Story = {
  name: 'Comparación de gaps',
  render: () => (
    <Stack gap="xl2">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Stack key={size} gap={size} style={{ border: '1px dashed #94a3b8', padding: '12px' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>gap="{size}"</div>
          <Item label="A" wide />
          <Item label="B" wide />
          <Item label="C" wide />
        </Stack>
      ))}
    </Stack>
  ),
};
