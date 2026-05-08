import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../../../../../package/ui/primitives/Inline/index.ts';
import { Stack } from '../../../../../package/ui/primitives/Stack/index.ts';

const SPACING_OPTIONS = ['none', 'px', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xl2', 'xl3'] as const;

const meta = {
  title: 'Primitives/Inline',
  component: Inline,
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
    wrap: { control: 'boolean' },
    as: {
      control: 'select',
      options: ['div', 'nav', 'ul', 'ol', 'header'],
    },
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

const Chip = ({ label }: { label: string }) => (
  <div
    style={{
      background: '#e0e7ff',
      padding: '6px 14px',
      borderRadius: '999px',
      fontSize: '14px',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

export const Default: Story = {
  args: { gap: 'sm', align: 'center' },
  render: (args) => (
    <Inline {...args}>
      <Chip label="Elemento 1" />
      <Chip label="Elemento 2" />
      <Chip label="Elemento 3" />
    </Inline>
  ),
};

export const JustifyBetween: Story = {
  name: 'Justify between',
  args: { gap: 'sm', justify: 'between', align: 'center' },
  render: (args) => (
    <Inline {...args} style={{ border: '1px dashed #94a3b8', padding: '8px' }}>
      <Chip label="Logo" />
      <Inline gap="xs">
        <Chip label="Inicio" />
        <Chip label="Docs" />
        <Chip label="Blog" />
      </Inline>
    </Inline>
  ),
};

export const WithWrap: Story = {
  name: 'Con wrap',
  args: { gap: 'sm', wrap: true },
  render: (args) => (
    <Inline {...args} style={{ maxWidth: '300px', border: '1px dashed #94a3b8', padding: '8px' }}>
      {['React', 'TypeScript', 'Vite', 'Vanilla Extract', 'Storybook', 'A11y'].map((tag) => (
        <Chip key={tag} label={tag} />
      ))}
    </Inline>
  ),
};

export const AlignBaseline: Story = {
  name: 'Align baseline',
  args: { gap: 'md', align: 'baseline' },
  render: (args) => (
    <Inline {...args}>
      <span style={{ fontSize: '24px', fontWeight: 700 }}>Título</span>
      <span style={{ fontSize: '14px', color: '#64748b' }}>alineado en baseline</span>
    </Inline>
  ),
};

export const GapComparison: Story = {
  name: 'Comparación de gaps',
  render: () => (
    <Stack gap="lg">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Inline key={size} gap={size} align="center">
          <span style={{ fontSize: '12px', color: '#64748b', width: '32px' }}>{size}</span>
          <Chip label="A" />
          <Chip label="B" />
          <Chip label="C" />
        </Inline>
      ))}
    </Stack>
  ),
};
