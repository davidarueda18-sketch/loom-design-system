import type { ReactNode, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, BUTTON_VARIANTS, BUTTON_SIZES } from '../../../../../package/ui/primitives/Button/index.ts';
import type { ButtonVariant } from '../../../../../package/ui/primitives/Button/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    variant:  { control: 'select', options: BUTTON_VARIANTS },
    size:     { control: 'select', options: BUTTON_SIZES },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Metadata ─────────────────────────────────────────────────────────────────
// State overrides simulate pseudo-classes visually. Token refs keep them in sync
// with the design system without duplicating hex values.

type StateDemo = { label: string; style?: CSSProperties; disabled?: boolean };

const VARIANT_STATES: Record<ButtonVariant, StateDemo[]> = {
  primary: [
    { label: 'Default' },
    { label: 'Hover',    style: { background: colorVars.brandPrimaryHover } },
    { label: 'Pressed',  style: { background: colorVars.brandPrimaryPressed } },
    { label: 'Focused',  style: { outline: `2px solid ${colorVars.textOnBrand}`, outlineOffset: '2px' } },
    { label: 'Disabled', disabled: true },
  ],
  outline: [
    { label: 'Default' },
    { label: 'Hover',    style: { background: colorVars.brandAccentHover, borderColor: colorVars.brandAccent } },
    { label: 'Focused',  style: { outline: 'none', color: colorVars.brandAccent, borderColor: colorVars.brandAccent } },
    { label: 'Pressed',  style: { background: colorVars.brandAccentPressed, color: colorVars.brandAccent, borderColor: 'transparent' } },
    { label: 'Disabled', disabled: true },
  ],
  text: [
    { label: 'Default' },
    { label: 'Hover',    style: { background: colorVars.brandAccentHover } },
    { label: 'Pressed',  style: { background: colorVars.brandAccentPressed, color: colorVars.brandAccent } },
    { label: 'Focused',  style: { outline: `2px solid ${colorVars.brandAccent}`, outlineOffset: '2px', color: colorVars.brandAccent } },
    { label: 'Disabled', disabled: true },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: '40px' }}>
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

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
    {children}
  </div>
);

const StateLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: '10px', fontWeight: 700, fontFamily: 'monospace',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: colorVars.textSecondary, marginBottom: '6px',
  }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant:  'primary',
    size:     'md',
    children: 'Guardar cambios',
  },
};

export const Variants: Story = {
  name: 'Variantes',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Variantes">
        <Row>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>{variant}</Button>
          ))}
        </Row>
      </StorySection>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Tamaños',
  render: () => (
    <div style={{ padding: '24px' }}>
      {BUTTON_VARIANTS.map((variant) => (
        <StorySection key={variant} title={variant}>
          <Row>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>{size}</Button>
            ))}
          </Row>
        </StorySection>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: 'Estados interactivos',
  render: () => (
    <div style={{ padding: '24px' }}>
      {BUTTON_VARIANTS.map((variant) => (
        <StorySection key={variant} title={variant}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {VARIANT_STATES[variant].map(({ label, style, disabled }) => (
              <div key={label}>
                <StateLabel>{label}</StateLabel>
                <Button variant={variant} size="md" disabled={disabled} style={style}>
                  {label}
                </Button>
              </div>
            ))}
          </div>
        </StorySection>
      ))}
    </div>
  ),
};

export const AllCombinations: Story = {
  name: 'Todas las combinaciones',
  render: () => (
    <div style={{ padding: '24px' }}>
      {BUTTON_VARIANTS.map((variant) => (
        <StorySection key={variant} title={variant}>
          <Row>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>{size}</Button>
            ))}
            <Button variant={variant} size="md" disabled>disabled</Button>
          </Row>
        </StorySection>
      ))}
    </div>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title='as="a" — renderiza como enlace'>
        <Row>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} as="a" href="#" variant={variant}>{variant}</Button>
          ))}
        </Row>
      </StorySection>
    </div>
  ),
};
