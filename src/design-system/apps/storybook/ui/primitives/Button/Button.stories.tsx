import { useCallback, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Button, BUTTON_VARIANTS, BUTTON_SIZES } from '../../../../../package/ui/primitives/Button/index.ts';
import type { ButtonSize, ButtonVariant } from '../../../../../package/ui/primitives/Button/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

interface ButtonStoryArgs {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children?: ReactNode;
}

const meta = {
  title: 'Primitives/Button',
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    variant:  { control: 'select', options: BUTTON_VARIANTS },
    size:     { control: 'select', options: BUTTON_SIZES },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Button** — acción canónica como Web Component.

\`\`\`html
<loom-button variant="primary" size="md">Guardar cambios</loom-button>
\`\`\`

El wrapper React \`<Button />\` renderiza internamente \`<loom-button>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

// ─── Metadata ─────────────────────────────────────────────────────────────────
// State overrides simulate pseudo-classes visually. Token refs keep them in sync
// with the design system without duplicating hex values.

type StateDemo = { label: string; style?: CSSProperties; disabled?: boolean };

type ButtonWebComponentArgs = {
  variant?: string;
  size?: string;
  disabled?: boolean;
  label?: string;
};

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
  <loom-box display="block" style={{ marginBottom: '40px' }}>
    <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
      {title}
    </p>
    {children}
  </loom-box>
);

const Row = ({ children }: { children: ReactNode }) => (
  <loom-inline gap="smMd" align="center" wrap>
    {children}
  </loom-inline>
);

const StateLabel = ({ children }: { children: string }) => (
  <p className="loom-caption" style={{
    color: colorVars.textSecondary, marginBottom: '6px',
  }}>
    {children}
  </p>
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
  render: ({ variant, size, disabled, children }) => (
    <loom-box display="block" padding="lg">
      <loom-button
        variant={variant}
        size={size}
        disabled={disabled || undefined}
      >
        {children}
      </loom-button>
    </loom-box>
  ),
};

export const Variants: Story = {
  name: 'Variantes',
  render: () => (
    <loom-box display="block" padding="lg">
      <StorySection title="Variantes">
        <Row>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>{variant}</Button>
          ))}
        </Row>
      </StorySection>
    </loom-box>
  ),
};

export const Sizes: Story = {
  name: 'Tamaños',
  render: () => (
    <loom-box display="block" padding="lg">
      {BUTTON_VARIANTS.map((variant) => (
        <StorySection key={variant} title={variant}>
          <Row>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>{size}</Button>
            ))}
          </Row>
        </StorySection>
      ))}
    </loom-box>
  ),
};

export const States: Story = {
  name: 'Estados interactivos',
  render: () => (
    <loom-box display="block" padding="lg">
      {BUTTON_VARIANTS.map((variant) => (
        <StorySection key={variant} title={variant}>
          <loom-inline gap="lg" wrap>
            {VARIANT_STATES[variant].map(({ label, style, disabled }) => (
              <loom-box key={label} display="block">
                <StateLabel>{label}</StateLabel>
                <Button variant={variant} size="md" disabled={disabled} style={style}>
                  {label}
                </Button>
              </loom-box>
            ))}
          </loom-inline>
        </StorySection>
      ))}
    </loom-box>
  ),
};

export const AllCombinations: Story = {
  name: 'Todas las combinaciones',
  render: () => (
    <loom-box display="block" padding="lg">
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
    </loom-box>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  render: () => (
    <loom-box display="block" padding="lg">
      <StorySection title='as="a" — renderiza como enlace'>
        <Row>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} as="a" href="#" variant={variant}>{variant}</Button>
          ))}
        </Row>
      </StorySection>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<ButtonWebComponentArgs> = {
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
    <loom-box display="block" padding="lg">
      <loom-button
        variant={variant as string}
        size={size as string}
        disabled={(disabled as boolean) || undefined}
      >
        {label as ReactNode}
      </loom-button>
    </loom-box>
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

    const handleRef = useCallback((el: HTMLElementTagNameMap['loom-button'] | null) => {
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
      <loom-box display="block" padding="lg">
        <loom-stack gap="md">
        <loom-button
          variant="primary"
          size="md"
          ref={handleRef}
        >
          Trigger events
        </loom-button>
        <loom-box display="block" padding="smMd" style={{
          minHeight: '80px',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          color: colorVars.textSecondary,
        }}>
          {log.length === 0
            ? <p className="loom-caption" style={{ margin: 0 }}>No events yet</p>
            : log.map((entry, idx) => <p key={idx} className="loom-caption" style={{ margin: 0 }}>{entry}</p>)}
        </loom-box>
        </loom-stack>
      </loom-box>
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
        <loom-box display="block" className="parts-demo">
          <Story />
        </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-button variant="outline" size="md">
        Styled via ::part(button)
      </loom-button>
    </loom-box>
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
