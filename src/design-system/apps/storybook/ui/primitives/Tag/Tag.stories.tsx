import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Tag, TAG_VALUES } from '../../../../../package/ui/primitives/Tag/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Tag/adapters/Tag.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    value:    'positive',
    label:    '23%',
    showIcon: true,
  },
  argTypes: {
    value:    { control: 'select', options: TAG_VALUES },
    label:    { control: 'text' },
    showIcon: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Tag informativo de solo visualización. Muestra el estado de una métrica con 3 variantes semánticas,
cada una con un icono estático y colores propios definidos por tokens.

\`\`\`tsx
// Positivo — flecha tendencia alcista
<Tag value="positive" label="23%" />

// Negativo — flecha tendencia bajista
<Tag value="negative" label="−8%" />

// Neutral — sin cambio
<Tag value="neutral" label="0%" />

// Sin icono
<Tag value="positive" label="23%" showIcon={false} />
\`\`\`

**Web Component:** \`<loom-tag>\` expone los mismos props como atributos HTML.
Usa \`::part(icon)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

export const Default: Story = {};

export const Values: Story = {
  name: 'Variantes (value)',
  parameters: {
    docs: {
      description: {
        story: 'Las 3 variantes semánticas con su icono y color correspondiente: `positive` (cyan), `negative` (rojo), `neutral` (gris). El icono es siempre estático según el valor.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Section title="Con icono (default)">
        <Row>
          {TAG_VALUES.map((v) => (
            <Tag key={v} value={v} label="23%" />
          ))}
        </Row>
      </Section>
      <Section title="Labels distintos">
        <Row>
          <Tag value="positive" label="+12.4%" />
          <Tag value="negative" label="−8.2%" />
          <Tag value="neutral" label="0%" />
        </Row>
      </Section>
    </div>
  ),
};

export const WithoutIcon: Story = {
  name: 'Sin icono (showIcon=false)',
  parameters: {
    docs: {
      description: {
        story: 'Cuando `showIcon={false}` se oculta el icono estático y solo se muestra el label. Los colores de borde y texto se mantienen según la variante.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <Row>
        {TAG_VALUES.map((v) => (
          <Tag key={v} value={v} label="23%" showIcon={false} />
        ))}
      </Row>
    </div>
  ),
};

export const WebComponent: StoryObj<{
  value?:      string;
  label?:      string;
  'show-icon'?: string;
}> = {
  tags: ['test'],
  name: 'Web Component (loom-tag)',
  parameters: {
    docs: {
      description: {
        story: `
Uso como custom element \`<loom-tag>\`. Las props son atributos HTML.
La story incluye pruebas automáticas (\`play\`) que validan: shadow DOM, cambio de variante,
visibilidad del icono con \`show-icon="false"\`, y contenido del label.

CSS hooks: \`::part(icon)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
  args: {
    value:       'positive',
    label:       '23%',
    'show-icon': 'true',
  },
  argTypes: {
    value:       { control: 'select', options: TAG_VALUES },
    label:       { control: 'text' },
    'show-icon': { control: 'select', options: ['true', 'false'] },
  },
  render: (args) => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <loom-tag
        value={args.value}
        label={args.label}
        show-icon={args['show-icon']}
      />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {TAG_VALUES.map((v) => (
          <loom-tag key={v} value={v} label="23%" />
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-tag');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-tag in canvas.');

    // Shadow DOM must be attached
    await expect(host.shadowRoot).toBeTruthy();

    const shadow = host.shadowRoot!;

    // Icon span (part="icon") must exist
    const iconEl = shadow.querySelector('[part="icon"]');
    await expect(iconEl).toBeTruthy();

    // Label span (part="label") must exist and contain text
    const labelEl = shadow.querySelector('[part="label"]');
    await expect(labelEl).toBeTruthy();
    await expect(labelEl!.textContent).toBe('23%');

    // Verify value attribute applies a CSS class to the host
    await expect(host.classList.length).toBeGreaterThan(0);

    // Test show-icon="false" hides the icon
    host.setAttribute('show-icon', 'false');
    await new Promise((r) => requestAnimationFrame(r));
    await expect((iconEl as HTMLElement).hidden).toBe(true);

    // Restore
    host.setAttribute('show-icon', 'true');
    await new Promise((r) => requestAnimationFrame(r));
    await expect((iconEl as HTMLElement).hidden).toBe(false);

    // Test value change updates host class
    const classBefore = host.className;
    host.setAttribute('value', 'negative');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.className).not.toBe(classBefore);

    // Restore
    host.setAttribute('value', 'positive');
  },
};
