import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Badge, BADGE_STATES } from '../../../../../package/ui/primitives/Badge/index.ts';
import type { BadgeState } from '../../../../../package/ui/primitives/Badge/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Badge/adapters/Badge.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

interface BadgeStoryArgs {
  state?: BadgeState;
  label?: string;
}

const meta = {
  title: 'Primitives/Badge',
  tags: ['autodocs'],
  args: {
    state: 'default',
    label: 'Status',
  },
  argTypes: {
    state: { control: 'select', options: BADGE_STATES },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Indicador de estado semántico como Web Component. Combina un dot de 8px y un label de texto
en una píldora con borde de color que comunica el estado del sistema.

\`\`\`html
<!-- Estado por defecto -->
<loom-badge state="default" label="Sin cambios"></loom-badge>

<!-- En progreso -->
<loom-badge state="progress" label="En proceso"></loom-badge>

<!-- Completado -->
<loom-badge state="success" label="Completado"></loom-badge>

<!-- Advertencia -->
<loom-badge state="warning" label="Advertencia"></loom-badge>

<!-- Error crítico -->
<loom-badge state="danger" label="Error"></loom-badge>

<!-- Informativo -->
<loom-badge state="info" label="Info"></loom-badge>
\`\`\`

El wrapper React \`<Badge />\` renderiza internamente \`<loom-badge>\`.
Usa \`::part(dot)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<BadgeStoryArgs>;

export default meta;
type Story = StoryObj<BadgeStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <loom-box display="block" style={{ marginBottom: '32px' }}>
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <loom-inline gap="smMd" align="center" wrap>
      {children}
    </loom-inline>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ state, label }) => (
    <loom-box display="block" padding="lg">
      <loom-badge state={state} label={label} />
    </loom-box>
  ),
};

export const States: Story = {
  name: 'Estados (state)',
  parameters: {
    docs: {
      description: {
        story: 'Los 6 estados semánticos, cada uno con su color de borde, dot y texto derivado de tokens de color del sistema.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
      <Section title="Todos los estados">
        <Row>
          {BADGE_STATES.map((s) => (
            <Badge key={s} state={s} label={s.charAt(0).toUpperCase() + s.slice(1)} />
          ))}
        </Row>
      </Section>
      <Section title="Labels contextuals">
        <Row>
          <Badge state="default"  label="Sin cambios" />
          <Badge state="progress" label="En proceso" />
          <Badge state="success"  label="Completado" />
          <Badge state="warning"  label="Advertencia" />
          <Badge state="danger"   label="Error crítico" />
          <Badge state="info"     label="Disponible" />
        </Row>
      </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<BadgeStoryArgs> = {
  tags: ['test'],
  name: 'Web Component (loom-badge)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element \`<loom-badge>\`. Las props son atributos HTML.
La story incluye pruebas automáticas (\`play\`) que validan: shadow DOM, dot, label,
y cambio de estado por atributo.

CSS hooks: \`::part(dot)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
  args: {
    state: 'default',
    label: 'Status',
  },
  argTypes: {
    state: { control: 'select', options: BADGE_STATES },
    label: { control: 'text' },
  },
  render: (args) => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      <loom-badge state={args.state} label={args.label} />

      <loom-inline gap="smMd" wrap>
        {BADGE_STATES.map((s) => (
          <loom-badge key={s} state={s} label={s} />
        ))}
      </loom-inline>
      </loom-stack>
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-badge');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-badge in canvas.');

    // Shadow DOM must be attached
    await expect(host.shadowRoot).toBeTruthy();

    const shadow = host.shadowRoot!;

    // Dot span (part="dot") must exist
    const dotEl = shadow.querySelector('[part="dot"]');
    await expect(dotEl).toBeTruthy();

    // Label span (part="label") must exist and contain text
    const labelEl = shadow.querySelector('[part="label"]');
    await expect(labelEl).toBeTruthy();
    await expect(labelEl!.textContent).toBe('Status');

    // Verify state attribute applies a CSS class to the host
    await expect(host.classList.length).toBeGreaterThan(0);

    // Test state change updates host class
    const classBefore = host.className;
    host.setAttribute('state', 'danger');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.className).not.toBe(classBefore);

    // Restore
    host.setAttribute('state', 'default');
  },
};

export const CSSParts: Story = {
  decorators: [
    (Story) => (
      <>
        <style>{`
          .parts-demo loom-badge::part(dot) {
            width: 10px;
            height: 10px;
            border-radius: 2px;
          }
          .parts-demo loom-badge::part(label) {
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
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
Consumer aplica \`::part(dot)\` y \`::part(label)\` para personalizar los internos del shadow root:

| Part | Elemento | Qué estilizar |
|---|---|---|
| \`dot\` | \`<span>\` indicador | Tamaño, border-radius, shape |
| \`label\` | Wrapper de texto | Font, peso, tracking, casing |
        `.trim(),
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
      <p className="loom-body-sm" style={{ color: colorVars.textSecondary, margin: '0 0 8px' }}>
        Consumer aplica <code>::part(dot)</code> (cuadrado) y <code>::part(label)</code> (bold + uppercase):
      </p>
      <loom-inline gap="smMd" wrap>
        {BADGE_STATES.map((s) => (
          <loom-badge key={s} state={s} label={s} />
        ))}
      </loom-inline>
      </loom-stack>
    </loom-box>
  ),
};
