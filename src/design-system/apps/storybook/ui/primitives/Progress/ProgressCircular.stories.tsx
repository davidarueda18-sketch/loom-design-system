import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  ProgressCircular,
  PROGRESS_THICKNESSES,
  PROGRESS_CIRCULAR_SIZES,
  PROGRESS_COLORS,
} from '../../../../../package/ui/primitives/Progress/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/tokens/progress/progress.tokens.css.ts';
import '../../../../../package/ui/primitives/Progress/adapters/ProgressCircular.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/Progress/Circular',
  tags: ['autodocs'],
  args: {
    value:         60,
    max:           100,
    indeterminate: false,
    thickness:     'sm',
    size:          'md',
    color:         'brandAccent',
    showValue:     false,
  },
  argTypes: {
    value:     { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max:       { control: 'number' },
    thickness: { control: 'select', options: PROGRESS_THICKNESSES },
    size:      { control: 'select', options: PROGRESS_CIRCULAR_SIZES },
    color:     { control: 'select', options: PROGRESS_COLORS },
    label:     { control: 'text' },
    showValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Indicador de progreso circular basado en Material Design 3. Soporta modo \`determinate\`
(arco con \`stroke-dasharray\` derivado de \`value/max\`) e \`indeterminate\` (rotación
combinada con animación de dash, patrón clásico Material).

\`\`\`html
<loom-progress-circular value="42" max="100"></loom-progress-circular>
<loom-progress-circular indeterminate></loom-progress-circular>
<loom-progress-circular value="75" size="lg" thickness="md" show-value></loom-progress-circular>
<loom-progress-circular indeterminate size="sm" color="feedbackSuccess"></loom-progress-circular>
\`\`\`

El wrapper React \`<ProgressCircular />\` renderiza internamente \`<loom-progress-circular>\`.
Hooks CSS: \`::part(ring)\` (svg), \`::part(track)\`, \`::part(active)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{
        fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: colorVars.textSecondary, margin: '0 0 12px',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      {children}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ value, max, indeterminate, thickness, size, color, label, showValue }) => (
    <div style={{ padding: '24px' }}>
      <loom-progress-circular
        value={value as number}
        max={max as number}
        indeterminate={(indeterminate as boolean) || undefined}
        thickness={thickness as string}
        size={size as string}
        color={color as string}
        label={label as string | undefined}
        show-value={(showValue as boolean) || undefined}
      />
    </div>
  ),
};

export const Determinate: Story = {
  name: 'Determinate — escala',
  parameters: {
    docs: {
      description: {
        story: 'Arco circular cuyo `stroke-dashoffset` se interpola con la transición determinate (400 ms). Extensión sobre el Figma original (que solo muestra indeterminate).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {[0, 25, 50, 75, 100].map((v) => (
        <Section key={v} title={`value = ${v}`}>
          <Row>
            <ProgressCircular value={v} thickness="sm" />
            <ProgressCircular value={v} thickness="md" />
          </Row>
        </Section>
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Patrón M3 clásico: el SVG rota continuamente mientras el arco oscila vía animación de `stroke-dasharray` y `stroke-dashoffset`. Respeta `prefers-reduced-motion`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Section title="indeterminate — todos los tamaños">
        <Row>
          {PROGRESS_CIRCULAR_SIZES.map((s) => (
            <ProgressCircular key={s} indeterminate size={s} />
          ))}
        </Row>
      </Section>
      <Section title="indeterminate — thickness md">
        <Row>
          {PROGRESS_CIRCULAR_SIZES.map((s) => (
            <ProgressCircular key={s} indeterminate size={s} thickness="md" />
          ))}
        </Row>
      </Section>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Tamaños',
  parameters: {
    docs: {
      description: {
        story: '`sm` (24 px), `md` (40 px, default — coincide con el Figma flat 4dp), `lg` (56 px).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {PROGRESS_CIRCULAR_SIZES.map((s) => (
        <Section key={s} title={`size = ${s}`}>
          <Row>
            <ProgressCircular value={70} size={s} thickness="sm" />
            <ProgressCircular value={70} size={s} thickness="md" />
            <ProgressCircular indeterminate size={s} />
          </Row>
        </Section>
      ))}
    </div>
  ),
};

export const Thicknesses: Story = {
  name: 'Grosor',
  render: () => (
    <div style={{ padding: '24px' }}>
      <Row>
        {PROGRESS_THICKNESSES.map((t) => (
          <ProgressCircular key={t} value={60} thickness={t} size="lg" />
        ))}
      </Row>
    </div>
  ),
};

export const Colors: Story = {
  name: 'Colores (tokens semánticos)',
  render: () => (
    <div style={{ padding: '24px' }}>
      <Row>
        {PROGRESS_COLORS.map((c) => (
          <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ProgressCircular value={70} color={c} thickness="md" />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: colorVars.textSecondary }}>{c}</span>
          </div>
        ))}
      </Row>
    </div>
  ),
};

export const WithLabel: Story = {
  name: 'Con label / showValue',
  parameters: {
    docs: {
      description: {
        story: 'El slot interno del anillo acepta una caption (`label`) o el porcentaje calculado (`showValue`). `showValue` tiene prioridad sobre `label` en determinate.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <Row>
        <ProgressCircular value={42} size="lg" showValue />
        <ProgressCircular value={75} size="lg" label="OK" />
        <ProgressCircular indeterminate size="lg" label="…" />
      </Row>
    </div>
  ),
};

export const WebComponent: StoryObj<{
  value?:         number;
  max?:           number;
  indeterminate?: boolean;
  thickness?:     string;
  size?:          string;
  color?:         string;
  label?:         string;
  'show-value'?:  boolean;
}> = {
  tags: ['test'],
  name: 'Web Component (loom-progress-circular)',
  parameters: {
    docs: {
      description: {
        story: `
Custom element \`<loom-progress-circular>\`. Atributos kebab-case en HTML.
Tests automáticos verifican shadow DOM, ARIA y geometría SVG (stroke-dasharray/offset).
        `.trim(),
      },
    },
  },
  args: {
    value:         42,
    max:           100,
    indeterminate: false,
    thickness:     'md',
    size:          'lg',
    color:         'brandAccent',
    label:         '',
    'show-value':  true,
  },
  argTypes: {
    value:        { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max:          { control: 'number' },
    thickness:    { control: 'select', options: PROGRESS_THICKNESSES },
    size:         { control: 'select', options: PROGRESS_CIRCULAR_SIZES },
    color:        { control: 'select', options: PROGRESS_COLORS },
    label:        { control: 'text' },
    'show-value': { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ padding: '24px' }}>
      <loom-progress-circular
        value={args.value}
        max={args.max}
        indeterminate={args.indeterminate || undefined}
        thickness={args.thickness}
        size={args.size}
        color={args.color}
        label={args.label}
        show-value={args['show-value'] || undefined}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-progress-circular');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-progress-circular in canvas.');

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    await expect(host.shadowRoot).toBeTruthy();
    await expect(host.getAttribute('role')).toBe('progressbar');
    await expect(host.getAttribute('aria-valuemin')).toBe('0');
    await expect(host.getAttribute('aria-valuemax')).toBe('100');
    await expect(host.getAttribute('aria-valuenow')).toBe('42');
    await expect(host.hasAttribute('aria-busy')).toBe(false);

    const shadow = host.shadowRoot!;
    const active = shadow.querySelector('circle[part~="active"]');
    if (!(active instanceof SVGElement)) throw new Error('Expected ::part(active) circle.');

    const dasharray  = active.getAttribute('stroke-dasharray');
    const dashoffset = active.getAttribute('stroke-dashoffset');
    await expect(dasharray).not.toBeNull();
    await expect(dashoffset).not.toBeNull();
  },
};
