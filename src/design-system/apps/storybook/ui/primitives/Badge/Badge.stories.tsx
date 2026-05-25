import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Badge, BADGE_STATES } from '../../../../../package/ui/primitives/Badge/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Badge/adapters/Badge.element.ts';
import '../../../loom-web-components.d.ts';

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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
      {children}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ state, label }) => (
    <div style={{ padding: '24px' }}>
      <loom-badge state={state as string} label={label as string} />
    </div>
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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
    </div>
  ),
};

export const WebComponent: StoryObj<{
  state?: string;
  label?: string;
}> = {
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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <loom-badge state={args.state} label={args.label} />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {BADGE_STATES.map((s) => (
          <loom-badge key={s} state={s} label={s} />
        ))}
      </div>
    </div>
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
  name: 'CSS Parts',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <div style={{ fontFamily: 'sans-serif', fontSize: '13px', color: colorVars.textSecondary, marginBottom: '8px' }}>
        Consumer aplica <code>::part(dot)</code> (cuadrado) y <code>::part(label)</code> (bold + uppercase):
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {BADGE_STATES.map((s) => (
          <loom-badge key={s} state={s} label={s} />
        ))}
      </div>
    </div>
  ),
};
