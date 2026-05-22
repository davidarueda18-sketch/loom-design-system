import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  ProgressLinear,
  PROGRESS_THICKNESSES,
  PROGRESS_SHAPES,
  PROGRESS_COLORS,
} from '../../../../../package/ui/primitives/Progress/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/tokens/progress/progress.tokens.css.ts';
import '../../../../../package/ui/primitives/Progress/adapters/ProgressLinear.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/Progress/Linear',
  component: ProgressLinear,
  tags: ['autodocs'],
  args: {
    value:         60,
    max:           100,
    indeterminate: false,
    thickness:     'sm',
    color:         'brandAccent',
    shape:         'flat',
    showValue:     false,
  },
  argTypes: {
    value:     { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max:       { control: 'number' },
    thickness: { control: 'select', options: PROGRESS_THICKNESSES },
    color:     { control: 'select', options: PROGRESS_COLORS },
    shape:     { control: 'select', options: PROGRESS_SHAPES },
    label:     { control: 'text' },
    showValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Indicador de progreso lineal basado en Material Design 3. Soporta modo \`determinate\`
(barra que avanza según \`value/max\`) e \`indeterminate\` (animación continua).

\`\`\`tsx
<ProgressLinear value={42} max={100} />
<ProgressLinear indeterminate />
<ProgressLinear value={70} shape="wave" thickness="md" color="feedbackSuccess" />
<ProgressLinear value={42} label="Subiendo archivo" showValue />
\`\`\`

**Web Component:** \`<loom-progress-linear>\` expone las mismas props como atributos HTML
(\`value\`, \`max\`, \`indeterminate\`, \`thickness\`, \`color\`, \`shape\`, \`label\`, \`show-value\`).
Hooks CSS: \`::part(track-host)\`, \`::part(track)\`, \`::part(active)\`, \`::part(stop)\`,
\`::part(label-row)\`, \`::part(label)\`, \`::part(value)\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ProgressLinear>;

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

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const Determinate: Story = {
  name: 'Determinate — escala',
  parameters: {
    docs: {
      description: {
        story: 'Coincidencia con los frames de Figma (0/10/20/50/80/100). La barra anima con `400ms cubic-bezier(0.4,0,0.2,1)` al cambiar `value`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {[0, 10, 20, 50, 80, 100].map((v) => (
        <Section key={v} title={`value = ${v}`}>
          <ProgressLinear value={v} />
        </Section>
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cuando no se conoce el progreso. Una sola pasada continua: el segmento se traslada y escala. Respeta `prefers-reduced-motion`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Section title="indeterminate (4 dp)">
        <ProgressLinear indeterminate thickness="sm" />
      </Section>
      <Section title="indeterminate (8 dp)">
        <ProgressLinear indeterminate thickness="md" />
      </Section>
    </div>
  ),
};

export const Thicknesses: Story = {
  name: 'Grosor',
  parameters: {
    docs: {
      description: {
        story: '`sm` (4 dp) por defecto, `md` (8 dp) para mayor jerarquía visual. Coincide con `4dp / 8dp` del Figma.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {PROGRESS_THICKNESSES.map((t) => (
        <Section key={t} title={`thickness = ${t}`}>
          <ProgressLinear value={60} thickness={t} />
        </Section>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  name: 'Forma (flat / wave)',
  parameters: {
    docs: {
      description: {
        story: '`flat` para barra sólida. `wave` aplica una sinusoide animada (M3 Expressive) al track y al active para conservar una silueta consistente.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Section title="flat — value 60">
        <ProgressLinear value={60} shape="flat" thickness="md" />
      </Section>
      <Section title="wave — value 40 (4 dp)">
        <ProgressLinear value={40} shape="wave" thickness="sm" />
      </Section>
      <Section title="wave — value 60 (8 dp)">
        <ProgressLinear value={60} shape="wave" thickness="md" />
      </Section>
      <Section title="wave — value 80 (8 dp)">
        <ProgressLinear value={80} shape="wave" thickness="md" />
      </Section>
    </div>
  ),
};

export const Colors: Story = {
  name: 'Colores (tokens semánticos)',
  parameters: {
    docs: {
      description: {
        story: 'La prop `color` consume tokens semánticos del DS. `brandAccent` es el default (cyan en dark = `#42d9ec`, match exacto con Figma).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {PROGRESS_COLORS.map((c) => (
        <Section key={c} title={c}>
          <ProgressLinear value={70} color={c} thickness="md" />
        </Section>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: 'Con label + showValue',
  parameters: {
    docs: {
      description: {
        story: '`label` muestra una caption a la izquierda. `showValue` anexa el porcentaje calculado a la derecha (oculto en `indeterminate`).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Section title="solo label">
        <ProgressLinear value={42} label="Subiendo archivo" />
      </Section>
      <Section title="label + showValue">
        <ProgressLinear value={42} label="Subiendo archivo" showValue />
      </Section>
      <Section title="solo showValue">
        <ProgressLinear value={42} showValue />
      </Section>
    </div>
  ),
};

export const WebComponent: StoryObj<{
  value?:         number;
  max?:           number;
  indeterminate?: boolean;
  thickness?:     string;
  color?:         string;
  shape?:         string;
  label?:         string;
  'show-value'?:  boolean;
}> = {
  tags: ['test'],
  name: 'Web Component (loom-progress-linear)',
  parameters: {
    docs: {
      description: {
        story: `
Custom element \`<loom-progress-linear>\`. Las props son atributos HTML kebab-case.
La story incluye \`play\` tests automáticos: presencia de shadow DOM, \`role="progressbar"\`,
\`aria-valuemin/max/now\`, \`aria-busy\` en indeterminate, y partes accesibles vía \`::part()\`.
        `.trim(),
      },
    },
  },
  args: {
    value:         42,
    max:           100,
    indeterminate: false,
    thickness:     'md',
    color:         'brandAccent',
    shape:         'wave',
    label:         'Procesando',
    'show-value':  true,
  },
  argTypes: {
    value:        { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max:          { control: 'number' },
    thickness:    { control: 'select', options: PROGRESS_THICKNESSES },
    color:        { control: 'select', options: PROGRESS_COLORS },
    shape:        { control: 'select', options: PROGRESS_SHAPES },
    label:        { control: 'text' },
    'show-value': { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ padding: '24px' }}>
      <loom-progress-linear
        value={args.value}
        max={args.max}
        indeterminate={args.indeterminate || undefined}
        thickness={args.thickness}
        color={args.color}
        shape={args.shape}
        label={args.label}
        show-value={args['show-value'] || undefined}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-progress-linear');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-progress-linear in canvas.');

    // requestAnimationFrame settle for _scheduleSync
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    await expect(host.shadowRoot).toBeTruthy();
    await expect(host.getAttribute('role')).toBe('progressbar');
    await expect(host.getAttribute('aria-valuemin')).toBe('0');
    await expect(host.getAttribute('aria-valuemax')).toBe('100');
    await expect(host.getAttribute('aria-valuenow')).toBe('42');
    await expect(host.hasAttribute('aria-busy')).toBe(false);

    const shadow = host.shadowRoot!;
    const track  = shadow.querySelector('[part~="track"]');
    const active = shadow.querySelector('[part~="active"]');
    if (!(track  instanceof HTMLElement)) throw new Error('Expected ::part(track).');
    if (!(active instanceof HTMLElement)) throw new Error('Expected ::part(active).');

    await expect(active.style.width).toBe('42%');
  },
};
