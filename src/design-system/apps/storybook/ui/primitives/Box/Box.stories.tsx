import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../../../../package/ui/primitives/Box/index.ts';

const SPACING_OPTIONS = ['none', 'px', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xl2', 'xl3'] as const;

const meta = {
  title: 'Primitives/Box',
  component: Box,
  argTypes: {
    padding:  { control: 'select', options: SPACING_OPTIONS },
    paddingX: { control: 'select', options: SPACING_OPTIONS },
    paddingY: { control: 'select', options: SPACING_OPTIONS },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer'],
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoBlock = ({ label }: { label: string }) => (
  <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '4px', fontSize: '14px' }}>
    {label}
  </div>
);

export const Default: Story = {
  args: {
    padding: 'md',
    as: "header"
  },
  render: (args) => (
    <Box {...args}>
      <DemoBlock label="Contenido con padding" />
    </Box>
  ),
};

export const PaddingAxes: Story = {
  name: 'Padding por eje',
  args: { paddingX: 'xl', paddingY: 'sm' },
  render: (args) => (
    <Box {...args} style={{ border: '1px dashed #94a3b8' }}>
      <DemoBlock label="paddingX grande, paddingY pequeño" />
    </Box>
  ),
};

export const AsSection: Story = {
  name: 'Como <section>',
  args: { as: 'section', padding: 'lg' },
  render: (args) => (
    <Box {...args} style={{ border: '1px solid #94a3b8', borderRadius: '8px' }}>
      <DemoBlock label="Renderizado como <section>" />
    </Box>
  ),
};

export const Nested: Story = {
  name: 'Anidado',
  render: () => (
    <Box padding="xl" style={{ border: '1px dashed #94a3b8' }}>
      <Box padding="md" style={{ border: '1px dashed #6366f1' }}>
        <DemoBlock label="Box dentro de Box" />
      </Box>
    </Box>
  ),
};
