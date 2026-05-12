/* eslint-disable storybook/no-renderer-packages */
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../../../../package/ui/primitives/Box/index.ts';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    padding:  { control: 'select', options: Object.keys(spacingVars) },
    paddingX: { control: 'select', options: Object.keys(spacingVars) },
    paddingY: { control: 'select', options: Object.keys(spacingVars) },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer'],
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const DemoBlock = ({ children }: { children?: ReactNode }) => (
  <div style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    borderRadius: '4px',
    padding: '12px',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    color: colorVars.textPrimary,
  }}>
    {children ?? 'Contenido'}
  </div>
);

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{
      fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: colorVars.textSecondary, margin: '0 0 12px',
    }}>
      {title}
    </h3>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { padding: 'md', as: 'header' },
  render: (args) => (
    <Box {...args} style={{ border: `1px dashed ${colorVars.borderDefault}` }}>
      <DemoBlock>Contenido con padding</DemoBlock>
    </Box>
  ),
};

export const PaddingAxes: Story = {
  name: 'Padding por eje',
  args: { paddingX: 'xl', paddingY: 'sm' },
  render: (args) => (
    <Box {...args} style={{ border: `1px dashed ${colorVars.borderDefault}` }}>
      <DemoBlock>paddingX grande, paddingY pequeño</DemoBlock>
    </Box>
  ),
};

export const AsSection: Story = {
  name: 'Como &lt;section&gt;',
  args: { as: 'section', padding: 'lg' },
  render: (args) => (
    <Box {...args} style={{ border: `1px solid ${colorVars.borderDefault}`, borderRadius: '8px' }}>
      <DemoBlock>Renderizado como &lt;section&gt;</DemoBlock>
    </Box>
  ),
};

export const Nested: Story = {
  name: 'Anidado',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Composición anidada">
        <Box padding="xl" style={{ border: `1px dashed ${colorVars.borderDefault}` }}>
          <Box padding="md" style={{ border: `1px dashed ${colorVars.brandAccent}` }}>
            <DemoBlock>Box dentro de Box</DemoBlock>
          </Box>
        </Box>
      </StorySection>
    </div>
  ),
};

export const WebComponent: Story = {
  args: {
    padding: 'md',
    paddingX: 'xl',
    paddingY: 'sm',
  },
  argTypes: {
    padding: { control: 'select', options: Object.keys(spacingVars) },
    paddingX: { control: 'select', options: Object.keys(spacingVars) },
    paddingY: { control: 'select', options: Object.keys(spacingVars) },
  },
  render: ({ padding, paddingX, paddingY }) => (
    <div style={{ padding: '24px' }}>
      <loom-box
        padding={padding as string}
        padding-x={paddingX as string}
        padding-y={paddingY as string}
        style={{ border: `1px dashed ${colorVars.borderDefault}` }}
      >
        <DemoBlock>loom-box con atributos reactivos</DemoBlock>
      </loom-box>
    </div>
  ),
};
