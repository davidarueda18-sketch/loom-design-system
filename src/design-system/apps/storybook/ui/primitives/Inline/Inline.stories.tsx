import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Inline, INLINE_ALIGNS, INLINE_JUSTIFIES } from '../../../../../package/ui/primitives/Inline/index.ts';
import { Stack } from '../../../../../package/ui/primitives/Stack/index.ts';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';

const meta = {
  title: 'Primitives/Inline',
  component: Inline,
  tags: ['autodocs'],
  argTypes: {
    gap:     { control: 'select', options: Object.keys(spacingVars) },
    align:   { control: 'select', options: INLINE_ALIGNS },
    justify: { control: 'select', options: INLINE_JUSTIFIES },
    wrap:    { control: 'boolean' },
    as: {
      control: 'select',
      options: ['div', 'nav', 'ul', 'ol', 'header'],
    },
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Chip = ({ children }: { children: ReactNode }) => (
  <div style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontFamily: 'sans-serif',
    color: colorVars.textPrimary,
    whiteSpace: 'nowrap' as const,
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
  <span style={{
    fontFamily: 'monospace', fontSize: '11px',
    color: colorVars.brandAccent, width: '72px', flexShrink: 0,
  }}>
    {children}
  </span>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { gap: 'sm', align: 'center' },
  render: (args) => (
    <Inline {...args}>
      <Chip>Elemento 1</Chip>
      <Chip>Elemento 2</Chip>
      <Chip>Elemento 3</Chip>
    </Inline>
  ),
};

export const Align: Story = {
  name: 'Align',
  render: () => (
    <div style={{ padding: '24px' }}>
      <Stack gap="md">
        {INLINE_ALIGNS.map((align) => (
          <Inline key={align} gap="sm" align={align}
            style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
          >
            <PropLabel>{align}</PropLabel>
            <Chip>A</Chip>
            <span style={{ fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 700, color: colorVars.textPrimary }}>B grande</span>
            <Chip>C</Chip>
          </Inline>
        ))}
      </Stack>
    </div>
  ),
};

export const Justify: Story = {
  name: 'Justify',
  render: () => (
    <div style={{ padding: '24px' }}>
      <Stack gap="md">
        {INLINE_JUSTIFIES.map((justify) => (
          <Inline key={justify} gap="sm" justify={justify}
            style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
          >
            <PropLabel>{justify}</PropLabel>
            <Chip>A</Chip>
            <Chip>B</Chip>
            <Chip>C</Chip>
          </Inline>
        ))}
      </Stack>
    </div>
  ),
};

export const WithWrap: Story = {
  name: 'Con wrap',
  args: { gap: 'sm', wrap: true },
  render: (args) => (
    <Inline {...args} style={{ maxWidth: '300px', border: `1px dashed ${colorVars.borderDefault}`, padding: '8px', borderRadius: '4px' }}>
      {['React', 'TypeScript', 'Vite', 'Vanilla Extract', 'Storybook', 'A11y'].map((tag) => (
        <Chip key={tag}>{tag}</Chip>
      ))}
    </Inline>
  ),
};

export const GapComparison: Story = {
  name: 'Comparación de gaps',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Todos los valores de gap">
        <Stack gap="sm">
          {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((size) => (
            <Inline key={size} gap={size} align="center">
              <PropLabel>{size}</PropLabel>
              <Chip>A</Chip>
              <Chip>B</Chip>
              <Chip>C</Chip>
            </Inline>
          ))}
        </Stack>
      </StorySection>
    </div>
  ),
};
