import { useCallback, useState } from 'react';
import type * as React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Button, BUTTON_VARIANTS, BUTTON_SIZES } from '../../../../../package/ui/primitives/Button/index.ts';
import type { ButtonVariant } from '../../../../../package/ui/primitives/Button/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../loom-web-components.d.ts';

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

const getLoomButton = (canvasElement: HTMLElement): HTMLElementTagNameMap['loom-button'] => {
  const host = canvasElement.querySelector('loom-button');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected a loom-button host in the story canvas.');
  }
  return host as HTMLElementTagNameMap['loom-button'];
};

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

export const WebComponent: StoryObj<{
  variant?: string;
  size?: string;
  disabled?: boolean;
  label?: string;
}> = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    label: 'Click me',
  },
  argTypes: {
    variant: { control: 'select', options: BUTTON_VARIANTS },
    size: { control: 'select', options: BUTTON_SIZES },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  render: ({ variant, size, disabled, label }) => (
    <div style={{ padding: '24px' }}>
      <loom-button
        variant={variant as string}
        size={size as string}
        disabled={(disabled as boolean) || undefined}
      >
        {label as ReactNode}
      </loom-button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomButton(canvasElement);
    await expect(host).toBeInTheDocument();
    await expect(getComputedStyle(host).display).not.toBe('contents');
    await expect(getComputedStyle(host).display).toBe('inline-flex');

    const shadowRoot = host.shadowRoot;
    if (!shadowRoot) {
      throw new Error('Expected loom-button to expose an open shadowRoot.');
    }

    const innerButton = shadowRoot.querySelector('button[part="button"]');
    if (!(innerButton instanceof HTMLButtonElement)) {
      throw new Error('Expected an inner native button with part="button".');
    }

    await expect(innerButton).toBeInTheDocument();
  },
};

export const CustomEvents: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([]);

    const handleRef = useCallback((el: HTMLElement | null) => {
      if (!el) return;

      const handleClick = () => {
        setLog((prev) => [`loom-click @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 8));
      };
      const handleFocus = () => {
        setLog((prev) => [`loom-focus @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 8));
      };
      const handleBlur = () => {
        setLog((prev) => [`loom-blur @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 8));
      };

      el.addEventListener('loom-click', handleClick);
      el.addEventListener('loom-focus', handleFocus);
      el.addEventListener('loom-blur', handleBlur);
    }, []);

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <loom-button
          variant="primary"
          size="md"
          ref={handleRef as React.Ref<HTMLElement>}
        >
          Trigger events
        </loom-button>
        <div style={{
          minHeight: '80px',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: colorVars.textSecondary,
        }}>
          {log.length === 0 ? 'No events yet' : log.map((entry, idx) => <div key={idx}>{entry}</div>)}
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const host = getLoomButton(canvasElement);
    await host.shadowRoot?.querySelector('button[part="button"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );

    await waitFor(async () => {
      await expect(canvasElement.textContent ?? '').toContain('loom-click');
    });
  },
};

export const CSSParts: Story = {
  decorators: [
    (Story) => (
      <>
        <style>{`
          .parts-demo loom-button::part(button) {
            border-radius: 0;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
        `}</style>
        <div className="parts-demo">
          <Story />
        </div>
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Partes expuestas para override visual:

| Part name | Element | What to style |
|---|---|---|
| button | Inner button | Layout, border radius, typography, interactions |
| label | Inner span | Typography and text presentation |
        `,
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <loom-button variant="outline" size="md">
        Styled via ::part(button)
      </loom-button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomButton(canvasElement);
    const shadowRoot = host.shadowRoot;
    if (!shadowRoot) {
      throw new Error('Expected loom-button to expose an open shadowRoot.');
    }

    const innerButton = shadowRoot.querySelector('button[part="button"]');
    if (!(innerButton instanceof HTMLButtonElement)) {
      throw new Error('Expected an inner native button with part="button".');
    }

    await waitFor(async () => {
      const styles = getComputedStyle(innerButton);
      await expect(styles.borderRadius).toBe('0px');
      await expect(styles.textTransform).toBe('uppercase');
    });
  },
};
