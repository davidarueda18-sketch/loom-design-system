import type { ReactNode, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Link, LINK_COLORS, LINK_UNDERLINES } from '../../../../../package/ui/primitives/Link/index.ts';
import type { LinkColor, LinkUnderline } from '../../../../../package/ui/primitives/Link/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';

const meta = {
  title: 'Primitives/Link',
  component: Link,
  tags: ['autodocs'],
  args: { children: 'Loom Design System' },
  argTypes: {
    color:     { control: 'select', options: LINK_COLORS },
    underline: { control: 'select', options: LINK_UNDERLINES },
    children:  { control: 'text' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Metadata ─────────────────────────────────────────────────────────────────

type StateDemo = { label: string; style?: CSSProperties; disabled?: boolean };

const UNDERLINE_STATES: Record<LinkUnderline, StateDemo[]> = {
  always: [
    { label: 'Default' },
    { label: 'Hover',    style: { textDecoration: 'underline', textUnderlineOffset: '2px' } },
    { label: 'Disabled', disabled: true },
  ],
  hover: [
    { label: 'Default' },
    { label: 'Hover',    style: { textDecoration: 'underline', textUnderlineOffset: '2px' } },
    { label: 'Disabled', disabled: true },
  ],
  none: [
    { label: 'Default' },
    { label: 'Hover',    style: { textDecoration: 'none' } },
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
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
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

const InheritWrapper = ({ color, children }: { color: string; children: ReactNode }) => (
  <div style={{ color, fontFamily: 'sans-serif', fontSize: '16px' }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    color:     'default',
    underline: 'always',
    href:      '#',
    children:  'Ir a la documentación',
  },
};

export const ColorVariants: Story = {
  name: 'Variantes de color',
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <StorySection title="default — usa el accent color del sistema">
        <Row>
          {LINK_UNDERLINES.map((underline) => (
            <div key={underline}>
              <StateLabel>{underline}</StateLabel>
              <Link href="#" color="default" underline={underline}>
                Enlace default
              </Link>
            </div>
          ))}
        </Row>
      </StorySection>

      <StorySection title="inherit — hereda el color del texto padre">
        <Row>
          {(
            [
              { label: 'sobre textPrimary', textColor: colorVars.textPrimary },
              { label: 'sobre textSecondary', textColor: colorVars.textSecondary },
              { label: 'sobre brandAccent', textColor: colorVars.brandAccent },
            ] as Array<{ label: string; textColor: string }>
          ).map(({ label, textColor }) => (
            <div key={label}>
              <StateLabel>{label}</StateLabel>
              <InheritWrapper color={textColor}>
                Texto con{' '}
                <Link href="#" color="inherit" underline="always">
                  enlace inline
                </Link>{' '}
                integrado.
              </InheritWrapper>
            </div>
          ))}
        </Row>
      </StorySection>
    </div>
  ),
};

export const UnderlineVariants: Story = {
  name: 'Variantes de subrayado',
  render: () => (
    <div style={{ padding: '24px' }}>
      {LINK_UNDERLINES.map((underline) => (
        <StorySection key={underline} title={underline}>
          <Row>
            {LINK_COLORS.map((color) => (
              <Link key={color} href="#" color={color} underline={underline}>
                {color} / {underline}
              </Link>
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
      {LINK_UNDERLINES.map((underline) => (
        <StorySection key={underline} title={`underline: ${underline}`}>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {UNDERLINE_STATES[underline].map(({ label, style, disabled }) => (
              <div key={label}>
                <StateLabel>{label}</StateLabel>
                <Row>
                  {LINK_COLORS.map((color) => (
                    <Link
                      key={color}
                      href="#"
                      color={color}
                      underline={underline}
                      aria-disabled={disabled}
                      style={style}
                    >
                      {color}
                    </Link>
                  ))}
                </Row>
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
      {LINK_COLORS.map((color) => (
        <StorySection key={color} title={`color: ${color}`}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {LINK_UNDERLINES.map((underline) => (
              <div key={underline}>
                <StateLabel>{underline}</StateLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="#" color={color} underline={underline}>
                    Enlace activo
                  </Link>
                  <Link href="#" color={color} underline={underline} aria-disabled>
                    Deshabilitado
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </StorySection>
      ))}
    </div>
  ),
};

export const InlineUsage: Story = {
  name: 'Uso inline en texto',
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <StorySection title="Dentro de un párrafo — color default">
        <p style={{ fontFamily: 'sans-serif', fontSize: '16px', lineHeight: 1.6, color: colorVars.textPrimary, maxWidth: '480px', margin: 0 }}>
          El sistema de diseño Loom está documentado en{' '}
          <Link href="#" color="default" underline="always">la guía de contribución</Link>
          {' '}y en{' '}
          <Link href="#" color="default" underline="hover">los tokens de diseño</Link>.
        </p>
      </StorySection>

      <StorySection title="Dentro de un párrafo — color inherit">
        <p style={{ fontFamily: 'sans-serif', fontSize: '16px', lineHeight: 1.6, color: colorVars.textSecondary, maxWidth: '480px', margin: 0 }}>
          Consulta{' '}
          <Link href="#" color="inherit" underline="always">nuestra documentación</Link>
          {' '}para más detalles sobre la{' '}
          <Link href="#" color="inherit" underline="hover">arquitectura de tokens</Link>.
        </p>
      </StorySection>
    </div>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title='as="a" (default) — enlace nativo'>
        <Row>
          {LINK_COLORS.map((color) => (
            <Link key={color} href="#" color={color} underline="always">
              {color}
            </Link>
          ))}
        </Row>
      </StorySection>

      <StorySection title='as="button" — acción sin href'>
        <Row>
          {LINK_COLORS.map((color) => (
            <Link key={color} as="button" color={color} underline="hover" type="button">
              {color}
            </Link>
          ))}
        </Row>
      </StorySection>

      <StorySection title='as="span" — no interactivo, solo visual'>
        <Row>
          {LINK_COLORS.map((color) => (
            <Link key={color} as="span" color={color} underline="none">
              {color}
            </Link>
          ))}
        </Row>
      </StorySection>
    </div>
  ),
};
