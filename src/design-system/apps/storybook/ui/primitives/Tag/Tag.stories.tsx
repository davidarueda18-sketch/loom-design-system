import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Tag, TAG_VALUES } from '../../../../../package/ui/primitives/Tag/index.ts';
import type { TagValue } from '../../../../../package/ui/primitives/Tag/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../../../package/ui/primitives/Tag/adapters/Tag.element.ts';
import '../../../loom-web-components.d.ts';

interface TagStoryArgs {
  value?: TagValue;
  label?: string;
  showIcon?: boolean;
}

interface TagWebComponentArgs {
  value?: TagValue;
  label?: string;
  'show-icon'?: 'true' | 'false';
}

const meta = {
  title: 'Primitives/Tag',
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
Tag informativo canónico como Web Component. Muestra el estado de una métrica con 3 variantes semánticas,
cada una con un icono estático y colores propios definidos por tokens.

\`\`\`html
// Positivo — flecha tendencia alcista
<loom-tag value="positive" label="23%"></loom-tag>

// Negativo — flecha tendencia bajista
<loom-tag value="negative" label="-8%"></loom-tag>

// Neutral — sin cambio
<loom-tag value="neutral" label="0%"></loom-tag>

// Sin icono
<loom-tag value="positive" label="23%" show-icon="false"></loom-tag>
\`\`\`

El wrapper React \`<Tag />\` renderiza internamente \`<loom-tag>\`.
Usa \`::part(icon)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<TagStoryArgs>;

export default meta;
type Story = StoryObj<TagStoryArgs>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <loom-box display="block" style={{ marginBottom: '32px' }}>
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <loom-inline gap="smMd" align="center" wrap>
      {children}
    </loom-inline>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ value, label, showIcon }) => (
    <loom-box display="block" padding="lg">
      <loom-tag
        value={value}
        label={label}
        show-icon={showIcon === false ? 'false' : 'true'}
      />
    </loom-box>
  ),
};

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
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
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
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <Row>
        {TAG_VALUES.map((v) => (
          <Tag key={v} value={v} label="23%" showIcon={false} />
        ))}
      </Row>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<TagWebComponentArgs> = {
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      <loom-tag
        value={args.value}
        label={args.label}
        show-icon={args['show-icon']}
      />

      <loom-inline gap="smMd" wrap>
        {TAG_VALUES.map((v) => (
          <loom-tag key={v} value={v} label="23%" />
        ))}
      </loom-inline>
      </loom-stack>
    </loom-box>
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

    // Test show-icon="false" removes the icon from layout
    host.setAttribute('show-icon', 'false');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(shadow.querySelector('[part="icon"]')).toBeNull();

    // Restore
    host.setAttribute('show-icon', 'true');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(shadow.querySelector('[part="icon"]')).toBeTruthy();

    // Test value change updates host class
    const classBefore = host.className;
    host.setAttribute('value', 'negative');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.className).not.toBe(classBefore);

    // Restore
    host.setAttribute('value', 'positive');
  },
};
