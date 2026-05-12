import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, STACK_ALIGNS, STACK_JUSTIFIES } from '../../../../../package/ui/primitives/Stack/index.ts';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap:     { control: 'select', options: Object.keys(spacingVars) },
    align:   { control: 'select', options: STACK_ALIGNS },
    justify: { control: 'select', options: STACK_JUSTIFIES },
    as: {
      control: 'select',
      options: ['div', 'ul', 'ol', 'section', 'nav'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Item = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'sans-serif',
    color: colorVars.textPrimary,
    width: wide ? '100%' : 'fit-content',
  }}>
    {children}
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

const PropLabel = ({ children }: { children: string }) => (
  <div style={{
    fontFamily: 'monospace', fontSize: '11px',
    color: colorVars.brandAccent, marginBottom: '4px',
  }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Item wide>Elemento 1</Item>
      <Item wide>Elemento 2</Item>
      <Item wide>Elemento 3</Item>
    </Stack>
  ),
};

export const Align: Story = {
  name: 'Align',
  render: () => (
    <div style={{ padding: '24px' }}>
      <Stack gap="xl">
        {STACK_ALIGNS.map((align) => (
          <div key={align}>
            <PropLabel>align="{align}"</PropLabel>
            <Stack gap="xs" align={align}
              style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
            >
              <Item wide>Elemento ancho</Item>
              <Item>Elemento ajustado</Item>
              <Item wide>Elemento ancho</Item>
            </Stack>
          </div>
        ))}
      </Stack>
    </div>
  ),
};

export const JustifyCenter: Story = {
  name: 'Justify center',
  args: { gap: 'md', justify: 'center' },
  render: (args) => (
    <Stack {...args} style={{ height: '300px', border: `1px dashed ${colorVars.borderDefault}` }}>
      <Item wide>Centrado verticalmente</Item>
      <Item wide>En el eje principal</Item>
    </Stack>
  ),
};

export const GapComparison: Story = {
  name: 'Comparación de gaps',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Todos los valores de gap">
        <Stack gap="xl2">
          {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((size) => (
            <div key={size}>
              <PropLabel>gap="{size}"</PropLabel>
              <Stack gap={size} style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}>
                <Item wide>A</Item>
                <Item wide>B</Item>
                <Item wide>C</Item>
              </Stack>
            </div>
          ))}
        </Stack>
      </StorySection>
    </div>
  ),
};
