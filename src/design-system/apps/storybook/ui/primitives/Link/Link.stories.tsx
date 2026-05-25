import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Link, LINK_COLORS, LINK_UNDERLINES } from '../../../../../package/ui/primitives/Link/index.ts';
import type { LinkColor, LinkUnderline } from '../../../../../package/ui/primitives/Link/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Link/adapters/Link.element.ts';
import '../../../loom-web-components.d.ts';

interface LinkStoryArgs {
  color: LinkColor;
  underline: LinkUnderline;
  href: string;
  label: string;
  disabled?: boolean;
}

const meta = {
  title: 'Primitives/Link',
  tags: ['autodocs'],
  args: {
    color: 'default',
    underline: 'always',
    href: '#',
    label: 'Ir a la documentación',
  },
  argTypes: {
    color:     { control: 'select', options: LINK_COLORS },
    underline: { control: 'select', options: LINK_UNDERLINES },
    href:      { control: 'text' },
    label:     { control: 'text' },
    disabled:  { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Link** — enlace inline canónico como Web Component.

Uso recomendado:

\`\`\`html
<script type="module" src="@loom-sdc/design-system/elements"></script>
<link rel="stylesheet" href="@loom-sdc/design-system/style.css" />

<loom-link href="/docs" color="default" underline="always">
  Ir a la documentación
</loom-link>
\`\`\`

React también puede usar \`<loom-link>\` directamente o el wrapper opcional \`<Link />\`, que renderiza este custom element.
        `.trim(),
      },
    },
  },
} satisfies Meta<LinkStoryArgs>;

export default meta;
type Story = StoryObj<LinkStoryArgs>;

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

const getLoomLink = (canvasElement: HTMLElement): HTMLElementTagNameMap['loom-link'] => {
  const host = canvasElement.querySelector('loom-link');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected a loom-link host in the story canvas.');
  }
  return host as HTMLElementTagNameMap['loom-link'];
};

export const Default: Story = {
  render: ({ color, underline, href, label, disabled }) => (
    <div style={{ padding: '24px' }}>
      <loom-link
        color={color as string}
        underline={underline as string}
        href={href as string}
        aria-disabled={disabled ? 'true' : undefined}
      >
        {label as ReactNode}
      </loom-link>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomLink(canvasElement);
    await expect(host).toBeInTheDocument();

    const shadowRoot = host.shadowRoot;
    if (!shadowRoot) {
      throw new Error('Expected loom-link to expose an open shadowRoot.');
    }

    const inner = shadowRoot.querySelector('a[part="link"]');
    if (!(inner instanceof HTMLAnchorElement)) {
      throw new Error('Expected an inner anchor with part="link".');
    }

    await expect(inner.getAttribute('href')).toBe('#');
    await expect(inner.textContent).toContain('Ir a la documentación');
  },
};

export const Variants: Story = {
  name: 'Variantes',
  render: () => (
    <div style={{ padding: '24px' }}>
      {LINK_COLORS.map((color) => (
        <StorySection key={color} title={`color=${color}`}>
          <Row>
            {LINK_UNDERLINES.map((underline) => (
              <div key={underline}>
                <StateLabel>{underline}</StateLabel>
                <loom-link href="#" color={color} underline={underline}>
                  {color} / {underline}
                </loom-link>
              </div>
            ))}
          </Row>
        </StorySection>
      ))}
    </div>
  ),
};

export const InlineUsage: Story = {
  name: 'Uso inline en texto',
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <StorySection title="Dentro de un párrafo">
        <p style={{ fontFamily: 'sans-serif', fontSize: '16px', lineHeight: 1.6, color: colorVars.textPrimary, maxWidth: '520px', margin: 0 }}>
          El sistema de diseño Loom está documentado en{' '}
          <loom-link href="#" color="default" underline="always">la guía de contribución</loom-link>
          {' '}y en{' '}
          <loom-link href="#" color="default" underline="hover">los tokens de diseño</loom-link>.
        </p>
      </StorySection>

      <StorySection title="Heredando color del texto padre">
        <p style={{ fontFamily: 'sans-serif', fontSize: '16px', lineHeight: 1.6, color: colorVars.textSecondary, maxWidth: '520px', margin: 0 }}>
          Consulta{' '}
          <loom-link href="#" color="inherit" underline="always">nuestra documentación</loom-link>
          {' '}para más detalles sobre la{' '}
          <loom-link href="#" color="inherit" underline="hover">arquitectura de tokens</loom-link>.
        </p>
      </StorySection>
    </div>
  ),
};

export const Disabled: Story = {
  name: 'Estado deshabilitado',
  render: () => (
    <div style={{ padding: '24px' }}>
      <Row>
        {LINK_COLORS.map((color) => (
          <loom-link key={color} href="#" color={color} underline="always" aria-disabled="true">
            {color}
          </loom-link>
        ))}
      </Row>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomLink(canvasElement);
    const inner = host.shadowRoot?.querySelector('a[part="link"]');
    await expect(inner).toBeInTheDocument();
    await expect(inner?.getAttribute('aria-disabled')).toBe('true');
    await expect(inner?.hasAttribute('href')).toBe(false);
  },
};

export const CustomEvents: Story = {
  name: 'Eventos personalizados',
  render: () => {
    const [log, setLog] = useState<string[]>([]);

    const handleRef = useCallback((el: HTMLElementTagNameMap['loom-link'] | null) => {
      if (!el) return;

      const handleClick = (event: Event) => {
        const detail = (event as CustomEvent<{ href: string }>).detail;
        setLog((prev) => [`loom-click href=${detail.href || '(empty)'}`, ...prev].slice(0, 8));
      };
      const handleFocus = () => {
        setLog((prev) => ['loom-focus', ...prev].slice(0, 8));
      };
      const handleBlur = () => {
        setLog((prev) => ['loom-blur', ...prev].slice(0, 8));
      };

      el.addEventListener('loom-click', handleClick);
      el.addEventListener('loom-focus', handleFocus);
      el.addEventListener('loom-blur', handleBlur);
    }, []);

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <loom-link href="#" color="default" underline="always" ref={handleRef}>
          Trigger events
        </loom-link>
        <div style={{
          minHeight: '80px',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: colorVars.textSecondary,
        }}>
          {log.length === 0 ? 'Sin eventos aún' : log.map((entry) => <div key={entry}>{entry}</div>)}
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const host = getLoomLink(canvasElement);
    host.shadowRoot?.querySelector('a[part="link"]')?.dispatchEvent(
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
          .parts-demo loom-link::part(link) {
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
Partes expuestas para override visual sin romper la encapsulación del shadow root:

| Part name | Elemento | Qué personalizar |
|---|---|---|
| \`link\` | Inner \`<a>\` | typography, text-decoration, outline |
        `.trim(),
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <loom-link href="#" color="default" underline="always">
        Styled via ::part(link)
      </loom-link>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomLink(canvasElement);
    const inner = host.shadowRoot?.querySelector('a[part="link"]');
    await expect(inner).toBeInTheDocument();
    await waitFor(async () => {
      await expect(getComputedStyle(inner!).textTransform).toBe('uppercase');
    });
  },
};

export const ReactWrapper: StoryObj<typeof Link> = {
  name: 'React wrapper',
  parameters: {
    docs: {
      description: {
        story: '`<Link />` es una conveniencia React que renderiza internamente `<loom-link>`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <Link href="#" color="default" underline="hover">
        Wrapper React sobre loom-link
      </Link>
    </div>
  ),
};
