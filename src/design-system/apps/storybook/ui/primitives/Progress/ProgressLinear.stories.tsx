import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  ProgressLinear,
  PROGRESS_THICKNESSES,
  PROGRESS_SHAPES,
  PROGRESS_COLORS,
} from '../../../../../package/ui/primitives/Progress/index.ts';
import type { ProgressColor, ProgressShape, ProgressThickness } from '../../../../../package/ui/primitives/Progress/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/tokens/progress/progress.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Progress/adapters/ProgressLinear.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

interface ProgressLinearStoryArgs {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  thickness?: ProgressThickness;
  color?: ProgressColor;
  shape?: ProgressShape;
  label?: string;
  showValue?: boolean;
}

const meta = {
  title: 'Primitives/Progress/Linear',
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

\`\`\`html
<loom-progress-linear value="42" max="100"></loom-progress-linear>
<loom-progress-linear indeterminate></loom-progress-linear>
<loom-progress-linear value="70" shape="wave" thickness="md" color="feedbackSuccess"></loom-progress-linear>
<loom-progress-linear value="42" label="Subiendo archivo" show-value></loom-progress-linear>
\`\`\`

El wrapper React \`<ProgressLinear />\` renderiza internamente \`<loom-progress-linear>\`.
(\`value\`, \`max\`, \`indeterminate\`, \`thickness\`, \`color\`, \`shape\`, \`label\`, \`show-value\`).
Hooks CSS: \`::part(track-host)\`, \`::part(track)\`, \`::part(active)\`, \`::part(stop)\`,
\`::part(label-row)\`, \`::part(label)\`, \`::part(value)\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<ProgressLinearStoryArgs>;

export default meta;
type Story = StoryObj<ProgressLinearStoryArgs>;

type ProgressLinearWebComponentArgs = {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  thickness?: ProgressThickness;
  color?: ProgressColor;
  shape?: ProgressShape;
  label?: string;
  'show-value'?: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <loom-box display="block" style={{ marginBottom: '32px' }}>
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 12px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ value, max, indeterminate, thickness, color, shape, label, showValue }) => (
    <loom-box display="block" padding="lg">
      <loom-progress-linear
        value={value}
        max={max}
        indeterminate={indeterminate || undefined}
        thickness={thickness}
        color={color}
        shape={shape}
        label={label}
        show-value={showValue || undefined}
      />
    </loom-box>
  ),
};

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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      {[0, 10, 20, 50, 80, 100].map((v) => (
        <Section key={v} title={`value = ${v}`}>
          <ProgressLinear value={v} />
        </Section>
      ))}
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      <Section title="indeterminate (4 dp)">
        <ProgressLinear indeterminate thickness="sm" />
      </Section>
      <Section title="indeterminate (8 dp)">
        <ProgressLinear indeterminate thickness="md" />
      </Section>
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      {PROGRESS_THICKNESSES.map((t) => (
        <Section key={t} title={`thickness = ${t}`}>
          <ProgressLinear value={60} thickness={t} />
        </Section>
      ))}
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
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
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      {PROGRESS_COLORS.map((c) => (
        <Section key={c} title={c}>
          <ProgressLinear value={70} color={c} thickness="md" />
        </Section>
      ))}
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      <Section title="solo label">
        <ProgressLinear value={42} label="Subiendo archivo" />
      </Section>
      <Section title="label + showValue">
        <ProgressLinear value={42} label="Subiendo archivo" showValue />
      </Section>
      <Section title="solo showValue">
        <ProgressLinear value={42} showValue />
      </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<ProgressLinearWebComponentArgs> = {
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
    <loom-box display="block" padding="lg">
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
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-progress-linear');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-progress-linear in canvas.');

    await new Promise((resolve) => requestAnimationFrame(resolve));

    await expect(host.shadowRoot).toBeTruthy();
    await expect(host.getAttribute('role')).toBe('progressbar');
    await expect(host.getAttribute('aria-valuemin')).toBe('0');
    await expect(host.getAttribute('aria-valuemax')).toBe('100');
    await expect(host.getAttribute('aria-valuenow')).toBe('42');
    await expect(host.hasAttribute('aria-busy')).toBe(false);

    const shadow = host.shadowRoot;
    if (!shadow) throw new Error('Expected loom-progress-linear to expose an open shadowRoot.');
    const track  = shadow.querySelector('[part~="track"]');
    const active = shadow.querySelector('[part~="active"]');
    if (!(track  instanceof HTMLElement)) throw new Error('Expected ::part(track).');
    if (!(active instanceof HTMLElement)) throw new Error('Expected ::part(active).');

    await expect(active.style.width).toBe('42%');
  },
};
