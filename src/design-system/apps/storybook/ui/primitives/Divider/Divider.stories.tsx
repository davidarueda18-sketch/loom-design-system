import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DIVIDER_ORIENTATIONS, DIVIDER_LABEL_POSITIONS, DIVIDER_COLORS, DIVIDER_THICKNESSES, DIVIDER_LINE_STYLES } from '../../../../../package/ui/primitives/Divider/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Divider/adapters/Divider.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

type DividerStoryArgs = {
  orientation?: string;
  label?: string;
  labelPosition?: string;
  color?: string;
  thickness?: string;
  lineStyle?: string;
};

type DividerWebComponentArgs = {
  orientation?: string;
  label?: string;
  'label-position'?: string;
  color?: string;
  thickness?: string;
  'line-style'?: string;
};

const meta = {
  title: 'Primitives/Divider',
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

\`\`\`html
// Línea simple
<loom-divider></loom-divider>

// Con label centrado
<loom-divider label="or"></loom-divider>

// Vertical entre columnas con primitives Loom
<loom-inline gap="md" align="center" style="height: 80px">
  <p class="loom-body-md">A</p>
  <loom-divider orientation="vertical"></loom-divider>
  <p class="loom-body-md">B</p>
</loom-inline>
\`\`\`

El wrapper React \`<Divider />\` renderiza internamente \`<loom-divider>\`.
Usa \`::part(line)\`, \`::part(line-start)\`, \`::part(line-end)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<DividerStoryArgs>;

export default meta;
type Story = StoryObj<DividerStoryArgs>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <loom-box display="block" padding-y="md">
      <p
        className="loom-overline"
        style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}
      >
        {title}
      </p>
      {children}
    </loom-box>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ orientation, label, labelPosition, color, thickness, lineStyle }) => (
    <loom-box padding="lg">
      <loom-divider
        orientation={orientation as string}
        label={label as string | undefined}
        label-position={labelPosition as string | undefined}
        color={color as string}
        thickness={thickness as string}
        line-style={lineStyle as string}
      />
    </loom-box>
  ),
};

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
    <loom-box padding="lg" style={{ color: colorVars.textPrimary }}>
      <loom-stack gap="xl2">
      <Section title="Sin label (línea pura)">
        <loom-divider></loom-divider>
      </Section>
      <Section title="start">
        <loom-divider label="or" label-position="start"></loom-divider>
      </Section>
      <Section title="center (default)">
        <loom-divider label="or" label-position="center"></loom-divider>
      </Section>
      <Section title="end">
        <loom-divider label="or" label-position="end"></loom-divider>
      </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Con `orientation="vertical"` el divider se adapta a la altura del contenedor flex. El label se rota 90° para mantener legibilidad.',
      },
    },
  },
  render: () => (
    <loom-box padding="lg" style={{ color: colorVars.textPrimary }}>
      <loom-stack gap="xl2">
      <Section title="Sin label">
        <loom-inline gap="lg" align="center" style={{ height: '80px' }}>
          <p className="loom-body-md" style={{ margin: 0 }}>Sección A</p>
          <loom-divider orientation="vertical"></loom-divider>
          <p className="loom-body-md" style={{ margin: 0 }}>Sección B</p>
        </loom-inline>
      </Section>
      <Section title="Con label (start / center / end)">
        <loom-inline gap="lg" align="stretch" style={{ height: '120px', fontFamily: 'sans-serif' }}>
          <loom-inline align="center"><p className="loom-body-md" style={{ margin: 0 }}>Start</p></loom-inline>
          <loom-divider orientation="vertical" label="or" label-position="start"></loom-divider>
          <loom-inline align="center"><p className="loom-body-md" style={{ margin: 0 }}>Center</p></loom-inline>
          <loom-divider orientation="vertical" label="or" label-position="center"></loom-divider>
          <loom-inline align="center"><p className="loom-body-md" style={{ margin: 0 }}>End</p></loom-inline>
          <loom-divider orientation="vertical" label="or" label-position="end"></loom-divider>
        </loom-inline>
      </Section>
      </loom-stack>
    </loom-box>
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
    <loom-box padding="lg">
      <loom-stack gap="xl">
      {DIVIDER_COLORS.map((c) => (
        <Section key={c} title={c}>
          <loom-divider color={c} label="or"></loom-divider>
        </Section>
      ))}
      </loom-stack>
    </loom-box>
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
    <loom-box padding="lg">
      <loom-stack gap="xl">
      {DIVIDER_THICKNESSES.map((t) => (
        <Section key={t} title={`${t} (${t === 'thin' ? '1px' : t === 'medium' ? '2px' : '4px'})`}>
          <loom-divider thickness={t}></loom-divider>
        </Section>
      ))}
      </loom-stack>
    </loom-box>
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
    <loom-box padding="lg">
      <loom-stack gap="xl">
      <Section title="solid">
        <loom-divider line-style="solid" label="or"></loom-divider>
      </Section>
      <Section title="dashed">
        <loom-divider line-style="dashed" label="or"></loom-divider>
      </Section>
      <Section title="dashed — vertical">
        <loom-inline align="center" style={{ height: '80px' }}>
          <loom-divider orientation="vertical" line-style="dashed"></loom-divider>
        </loom-inline>
      </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<DividerWebComponentArgs> = {
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
    <loom-box padding="lg">
      <loom-divider
        orientation={args.orientation}
        label={args.label}
        label-position={args['label-position']}
        color={args.color}
        thickness={args.thickness}
        line-style={args['line-style']}
      />
    </loom-box>
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
