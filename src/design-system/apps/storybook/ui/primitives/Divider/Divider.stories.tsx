import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Divider, DIVIDER_ORIENTATIONS, DIVIDER_LABEL_POSITIONS, DIVIDER_COLORS, DIVIDER_THICKNESSES, DIVIDER_LINE_STYLES } from '../../../../../package/ui/primitives/Divider/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Divider/adapters/Divider.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {
    orientation:   'horizontal',
    color:         'borderDefault',
    thickness:     'thin',
    lineStyle:     'solid',
  },
  argTypes: {
    orientation:   { control: 'select', options: DIVIDER_ORIENTATIONS },
    labelPosition: { control: 'select', options: DIVIDER_LABEL_POSITIONS },
    color:         { control: 'select', options: DIVIDER_COLORS },
    thickness:     { control: 'select', options: DIVIDER_THICKNESSES },
    lineStyle:     { control: 'select', options: DIVIDER_LINE_STYLES },
    label:         { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Separador visual que divide secciones de contenido. Soporta orientación horizontal/vertical,
label opcional con posición configurable, tokens de color, grosor y estilo de línea.

\`\`\`tsx
// Línea simple
<Divider />

// Con label centrado
<Divider label="or" />

// Vertical entre columnas
<div style={{ display: 'flex', height: '80px', gap: '16px' }}>
  <span>A</span>
  <Divider orientation="vertical" />
  <span>B</span>
</div>
\`\`\`

**Web Component:** \`<loom-divider>\` expone las mismas props como atributos HTML.
Usa \`::part(line)\`, \`::part(line-start)\`, \`::part(line-end)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const LabelPositions: Story = {
  name: 'Label — posiciones',
  parameters: {
    docs: {
      description: {
        story: 'La prop `label` activa el modo con texto. `labelPosition` controla el anclaje: `start` (línea corta antes), `center` (líneas iguales) y `end` (línea corta después).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', color: colorVars.textPrimary }}>
      <Section title="Sin label (línea pura)">
        <Divider />
      </Section>
      <Section title="start">
        <Divider label="or" labelPosition="start" />
      </Section>
      <Section title="center (default)">
        <Divider label="or" labelPosition="center" />
      </Section>
      <Section title="end">
        <Divider label="or" labelPosition="end" />
      </Section>
    </div>
  ),
};

export const Vertical: Story = {
  name: 'Vertical',
  parameters: {
    docs: {
      description: {
        story: 'Con `orientation="vertical"` el divider se adapta a la altura del contenedor flex. El label se rota 90° para mantener legibilidad.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', color: colorVars.textPrimary }}>
      <Section title="Sin label">
        <div style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '24px', fontFamily: 'sans-serif' }}>
          <span>Sección A</span>
          <Divider orientation="vertical" />
          <span>Sección B</span>
        </div>
      </Section>
      <Section title="Con label (start / center / end)">
        <div style={{ display: 'flex', alignItems: 'stretch', height: '120px', gap: '24px', fontFamily: 'sans-serif' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>Start</span>
          <Divider orientation="vertical" label="or" labelPosition="start" />
          <span style={{ display: 'flex', alignItems: 'center' }}>Center</span>
          <Divider orientation="vertical" label="or" labelPosition="center" />
          <span style={{ display: 'flex', alignItems: 'center' }}>End</span>
          <Divider orientation="vertical" label="or" labelPosition="end" />
        </div>
      </Section>
    </div>
  ),
};

export const Colors: Story = {
  name: 'Colores (tokens)',
  parameters: {
    docs: {
      description: {
        story: 'La prop `color` acepta los tres tokens de borde semánticos. `borderSubtle` para separadores dentro de un grupo, `borderDefault` para el caso base, `borderStrong` para separadores estructurales con mayor jerarquía.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {DIVIDER_COLORS.map((c) => (
        <Section key={c} title={c}>
          <Divider color={c} label="or" />
        </Section>
      ))}
    </div>
  ),
};

export const Thickness: Story = {
  name: 'Grosor',
  parameters: {
    docs: {
      description: {
        story: '`thin` (1px) para la mayoría de casos, `medium` (2px) y `thick` (4px) para separadores estructurales más pesados como divisores entre secciones de página.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {DIVIDER_THICKNESSES.map((t) => (
        <Section key={t} title={`${t} (${t === 'thin' ? '1px' : t === 'medium' ? '2px' : '4px'})`}>
          <Divider thickness={t} />
        </Section>
      ))}
    </div>
  ),
};

export const LineStyles: Story = {
  name: 'Estilo de línea',
  parameters: {
    docs: {
      description: {
        story: '`solid` para separadores definidos, `dashed` para separadores opcionales o áreas de drop-zone. El patrón de dashes usa un ciclo 4px-on / 4px-off.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Section title="solid">
        <Divider lineStyle="solid" label="or" />
      </Section>
      <Section title="dashed">
        <Divider lineStyle="dashed" label="or" />
      </Section>
      <Section title="dashed — vertical">
        <div style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '24px' }}>
          <Divider orientation="vertical" lineStyle="dashed" />
        </div>
      </Section>
    </div>
  ),
};

export const WebComponent: StoryObj<{
  orientation?: string;
  label?: string;
  'label-position'?: string;
  color?: string;
  thickness?: string;
  'line-style'?: string;
}> = {
  tags: ['test'],
  name: 'Web Component (loom-divider)',
  parameters: {
    docs: {
      description: {
        story: `
Uso como custom element \`<loom-divider>\`. Las props son atributos HTML kebab-case.
La story incluye pruebas automáticas (\`play\`) que validan: shadow DOM, \`role="separator"\`,
\`aria-orientation\`, \`aria-label\` cuando hay label, y el tamaño computado del segmento de línea.

CSS hooks: \`::part(line)\`, \`::part(line-start)\`, \`::part(line-end)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
  args: {
    orientation:      'horizontal',
    label:            'or',
    'label-position': 'center',
    color:            'borderDefault',
    thickness:        'thin',
    'line-style':     'solid',
  },
  argTypes: {
    orientation:      { control: 'select', options: DIVIDER_ORIENTATIONS },
    'label-position': { control: 'select', options: DIVIDER_LABEL_POSITIONS },
    color:            { control: 'select', options: DIVIDER_COLORS },
    thickness:        { control: 'select', options: DIVIDER_THICKNESSES },
    'line-style':     { control: 'select', options: DIVIDER_LINE_STYLES },
    label:            { control: 'text' },
  },
  render: (args) => (
    <div style={{ padding: '24px' }}>
      <loom-divider
        orientation={args.orientation}
        label={args.label}
        label-position={args['label-position']}
        color={args.color}
        thickness={args.thickness}
        line-style={args['line-style']}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-divider');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-divider in canvas.');

    await expect(host.shadowRoot).toBeTruthy();
    await expect(host.getAttribute('role')).toBe('separator');
    await expect(host.getAttribute('aria-orientation')).toBe('horizontal');
    await expect(host.getAttribute('aria-label')).toBe('or');

    const shadow = host.shadowRoot!;
    const lineStart = shadow.querySelector('[part~="line-start"]');
    if (!(lineStart instanceof HTMLElement)) throw new Error('Expected line-start part.');

    const computed = getComputedStyle(lineStart);
    await expect(computed.height).toBe('1px');
  },
};
