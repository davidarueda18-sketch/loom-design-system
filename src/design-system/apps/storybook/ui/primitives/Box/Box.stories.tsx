import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import { BOX_DISPLAYS } from '../../../../../package/ui/primitives/Box/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../loom-web-components.d.ts';

interface BoxStoryArgs {
  display?: string;
  padding?: string;
  paddingX?: string;
  paddingY?: string;
}

const boxImplementationCode = `import '@loom-sdc/design-system/elements';

<loom-box padding="md">
  Contenido con padding por token
</loom-box>

<loom-box padding-x="xl" padding-y="sm">
  Padding horizontal y vertical independientes
</loom-box>

<loom-box display="flex" padding="md">
  Contenido con display flex
</loom-box>`;

const meta = {
  title: 'Primitives/Box',
  tags: ['autodocs'],
  argTypes: {
    display:  { control: 'select', options: BOX_DISPLAYS },
    padding:  { control: 'select', options: Object.keys(spacingVars) },
    paddingX: { control: 'select', options: Object.keys(spacingVars) },
    paddingY: { control: 'select', options: Object.keys(spacingVars) },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Box** es el contenedor canónico para aplicar padding con tokens de spacing.
También expone \`display\` para cubrir los casos de layout comunes sin estilos inline.

\`\`\`html
<script type="module" src="@loom-sdc/design-system/elements"></script>

<loom-box padding="md">
  Contenido con padding por token
</loom-box>

<loom-box padding-x="xl" padding-y="sm">
  Padding horizontal y vertical independientes
</loom-box>

<loom-box display="flex" padding="md">
  Contenido con display flex
</loom-box>
\`\`\`

El wrapper React \`<Box />\` renderiza internamente \`<loom-box>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<BoxStoryArgs>;

export default meta;
type Story = StoryObj<BoxStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Canvas = ({ children, maxWidth = 520 }: { children: ReactNode; maxWidth?: number }) => (
  <div style={{
    width: '100%',
    maxWidth: `${maxWidth}px`,
    minWidth: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
  }}>
    {children}
  </div>
);

const DemoBlock = ({ children }: { children?: ReactNode }) => (
  <div style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    borderRadius: '4px',
    padding: '12px',
    minWidth: 0,
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    color: colorVars.textPrimary,
    overflowWrap: 'anywhere',
  }}>
    {children ?? 'Contenido'}
  </div>
);

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
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

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    display: 'block',
    padding: 'lg',
    paddingX: 'xl3',
    paddingY: 'xl8',
  },
  parameters: {
    docs: {
      source: { code: '<loom-box padding="md">Contenido con padding</loom-box>' },
    },
  },
  render: (args) => (
    <Canvas>
      <loom-box display={args.display} padding={args.padding} style={{ border: `1px dashed ${colorVars.borderDefault}`, width: '100%' }}>
        <DemoBlock>Contenido con padding</DemoBlock>
      </loom-box>
    </Canvas>
  ),
};

export const PaddingAxes: Story = {
  name: 'Padding por eje',
  args: { paddingX: 'xl', paddingY: 'sm' },
  parameters: {
    docs: {
      source: { code: '<loom-box padding-x="xl" padding-y="sm">Contenido</loom-box>' },
    },
  },
  render: (args) => (
    <Canvas>
      <loom-box
        padding-x={args.paddingX}
        padding-y={args.paddingY}
        style={{ border: `1px dashed ${colorVars.borderDefault}`, width: '100%' }}
      >
        <DemoBlock>paddingX grande, paddingY pequeño</DemoBlock>
      </loom-box>
    </Canvas>
  ),
};

export const Nested: Story = {
  name: 'Anidado',
  render: () => (
    <Canvas maxWidth={560}>
      <StorySection title="Composición anidada">
        <loom-box padding="xl" style={{ border: `1px dashed ${colorVars.borderDefault}`, width: '100%' }}>
          <loom-box padding="md" style={{ border: `1px dashed ${colorVars.brandAccent}`, width: '100%' }}>
            <DemoBlock>Box dentro de Box</DemoBlock>
          </loom-box>
        </loom-box>
      </StorySection>
    </Canvas>
  ),
};

export const Implementation: Story = {
  name: 'Implementación',
  parameters: {
    docs: {
      description: {
        story: 'Registra los custom elements una vez desde `@loom-sdc/design-system/elements` y usa atributos kebab-case para consumir los tokens.',
      },
      source: { code: boxImplementationCode },
    },
  },
  render: () => (
    <Canvas>
      <loom-box padding="md" style={{ border: `1px dashed ${colorVars.borderDefault}`, width: '100%' }}>
        <DemoBlock>Implementación con loom-box</DemoBlock>
      </loom-box>
    </Canvas>
  ),
};

export const WebComponent: Story = {
  args: {
    display: 'block',
    padding: 'md',
    paddingX: 'xl',
    paddingY: 'sm',
  },
  argTypes: {
    display: { control: 'select', options: BOX_DISPLAYS },
    padding: { control: 'select', options: Object.keys(spacingVars) },
    paddingX: { control: 'select', options: Object.keys(spacingVars) },
    paddingY: { control: 'select', options: Object.keys(spacingVars) },
  },
  render: ({ display, padding, paddingX, paddingY }) => (
    <Canvas>
      <loom-box
        display={display}
        padding={padding}
        padding-x={paddingX}
        padding-y={paddingY}
        style={{ border: `1px dashed ${colorVars.borderDefault}`, width: '100%' }}
      >
        <DemoBlock>loom-box con atributos reactivos</DemoBlock>
      </loom-box>
    </Canvas>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-box');
    if (!(host instanceof HTMLElement)) {
      throw new Error('Expected a loom-box host in the story canvas.');
    }

    await expect(host).toBeInTheDocument();
  await expect(host.getAttribute('display')).toBe('block');
    await expect(host.getAttribute('padding')).toBe('md');
    await expect(host.getAttribute('padding-x')).toBe('xl');
    await expect(host.getAttribute('padding-y')).toBe('sm');
    await expect(host.textContent ?? '').toContain('loom-box con atributos reactivos');

    await waitFor(async () => {
      await expect(host.classList.length).toBeGreaterThan(1);
    });
  },
};
