/* eslint-disable storybook/no-renderer-packages */
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../../../../package/ui/primitives/Text/index.ts';
import { typographyVars } from '../../../../../package/tokens/typography/index.ts';
import { fontFamilyVars } from '../../../../../package/tokens/fontFamily/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Text/adapters/Text.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: Object.keys(typographyVars) },
    align: { control: 'select', options: ['start', 'center', 'end', 'justify'] },
    as: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'figcaption'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{
      fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: colorVars.textSecondary, margin: '0 0 16px',
    }}>
      {title}
    </h3>
    {children}
  </div>
);

const TypeScaleRow = ({ variant }: { variant: keyof typeof typographyVars }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', gap: '24px',
    padding: '10px 0', borderBottom: `1px solid ${colorVars.borderSubtle}`,
  }}>
    <span style={{
      fontFamily: 'monospace', fontSize: '11px',
      color: colorVars.textSecondary, width: '140px', flexShrink: 0,
    }}>
      {variant}
    </span>
    <Text variant={variant} style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
      Loom Design System
    </Text>
  </div>
);

const PolyRow = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '6px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant:  'bodyBase',
    children: 'Loom Design System',
    style:    { fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary },
  },
};

export const TypeScale: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Todas las variantes">
        {(Object.keys(typographyVars) as Array<keyof typeof typographyVars>).map((variant) => (
          <TypeScaleRow key={variant} variant={variant} />
        ))}
      </StorySection>
    </div>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="as — elemento HTML semántico">
        <PolyRow>
          <Text as="label" variant="labelBase" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textSecondary }}>
            as="label" — etiqueta de campo
          </Text>
        </PolyRow>
        <PolyRow>
          <Text as="figcaption" variant="caption" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textSecondary }}>
            as="figcaption" — pie de imagen
          </Text>
        </PolyRow>
        <PolyRow>
          <Text as="span" variant="bodySm" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
            as="span" — inline text
          </Text>
        </PolyRow>
        <PolyRow>
          <Text as="h1" variant="headingH1" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
            as="h1" — encabezado semántico
          </Text>
        </PolyRow>
      </StorySection>
    </div>
  ),
};

export const WebComponent: Story = {
  args: {
    variant: 'bodyBase',
    children: 'Loom Design System',
  },
  argTypes: {
    variant: { control: 'select', options: Object.keys(typographyVars) },
    align:   { control: 'select', options: ['start', 'center', 'end', 'justify'] },
    children: { control: 'text' },
  },
  render: ({ variant, align, children }) => (
    <div style={{ padding: '24px' }}>
      <loom-text
        variant={variant as string}
        align={align as string | undefined}
        style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}
      >
        {children as ReactNode}
      </loom-text>
    </div>
  ),
};
