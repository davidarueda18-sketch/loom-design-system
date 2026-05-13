/* eslint-disable storybook/no-renderer-packages */
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, variantTokenMap } from '../../../../../package/ui/primitives/Text/index.ts';
import type { TextVariant } from '../../../../../package/ui/primitives/Text/index.ts';
import { fontFamilyVars } from '../../../../../package/tokens/fontFamily/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Text/adapters/Text.element.ts';
import '../../../loom-web-components.d.ts';

const allVariants = Object.keys(variantTokenMap) as TextVariant[];

const meta = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    variant:  'body-md',
    children: 'Loom Design System',
  },
  argTypes: {
    variant: { control: 'select', options: allVariants },
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

const TypeScaleRow = ({ variant }: { variant: TextVariant }) => (
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
    style: { fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary },
  },
};

export const TypeScale: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Todas las variantes">
        {allVariants.map((variant) => (
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
          <Text as="label" variant="label-md" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textSecondary }}>
            as="label" — etiqueta de campo
          </Text>
        </PolyRow>
        <PolyRow>
          <Text as="figcaption" variant="caption" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textSecondary }}>
            as="figcaption" — pie de imagen
          </Text>
        </PolyRow>
        <PolyRow>
          <Text as="span" variant="body-sm" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
            as="span" — inline text
          </Text>
        </PolyRow>
        <PolyRow>
          <Text as="h1" variant="heading-1" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
            as="h1" — encabezado semántico
          </Text>
        </PolyRow>
      </StorySection>
    </div>
  ),
};

export const WebComponent: Story = {
  args: {
    variant: 'body-md',
    children: 'Loom Design System',
  },
  argTypes: {
    variant:  { control: 'select', options: allVariants },
    align:    { control: 'select', options: ['start', 'center', 'end', 'justify'] },
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
