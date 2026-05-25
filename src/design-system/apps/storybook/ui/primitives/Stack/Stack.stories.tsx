import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Stack, STACK_ALIGNS, STACK_JUSTIFIES } from '../../../../../package/ui/primitives/Stack/index.ts';
import type { StackAlign, StackJustify } from '../../../../../package/ui/primitives/Stack/index.ts';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

const stackImplementationCode = `import '@loom-sdc/design-system/elements';

<loom-stack gap="md" align="stretch" justify="start">
  <section>Primero</section>
  <section>Segundo</section>
</loom-stack>`;

interface StackStoryArgs {
  gap?: string;
  align?: StackAlign;
  justify?: StackJustify;
}

const meta = {
  title: 'Primitives/Stack',
  tags: ['autodocs'],
  argTypes: {
    gap:     { control: 'select', options: Object.keys(spacingVars) },
    align:   { control: 'select', options: STACK_ALIGNS },
    justify: { control: 'select', options: STACK_JUSTIFIES },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Stack** es el primitive canónico para layout vertical con gap tokenizado y control de alineación.

\`\`\`html
<script type="module" src="@loom-sdc/design-system/elements"></script>

<loom-stack gap="md" align="stretch" justify="start">
  <section>Primero</section>
  <section>Segundo</section>
</loom-stack>
\`\`\`

El wrapper React \`<Stack />\` renderiza internamente \`<loom-stack>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<StackStoryArgs>;

export default meta;
type Story = StoryObj<StackStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Canvas = ({ children, maxWidth = 560 }: { children: ReactNode; maxWidth?: number }) => (
  <div style={{ width: '100%', maxWidth: `${maxWidth}px`, minWidth: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
    {children}
  </div>
);

const Item = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'sans-serif',
    color: colorVars.textPrimary,
    width: wide ? '100%' : 'fit-content',
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflowWrap: 'anywhere',
  }}>
    {children}
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

const PropLabel = ({ children }: { children: string }) => (
  <div style={{
    fontFamily: 'monospace', fontSize: '11px',
    color: colorVars.brandAccent, marginBottom: '4px',
  }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { gap: 'md' },
  parameters: {
    docs: {
      source: { code: '<loom-stack gap="md"><section>Elemento 1</section><section>Elemento 2</section></loom-stack>' },
    },
  },
  render: (args) => (
    <Canvas>
      <loom-stack gap={args.gap} style={{ width: '100%' }}>
        <Item wide>Elemento 1</Item>
        <Item wide>Elemento 2</Item>
        <Item wide>Elemento 3</Item>
      </loom-stack>
    </Canvas>
  ),
};

export const Align: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Stack gap="xl">
        {STACK_ALIGNS.map((align) => (
          <div key={align}>
            <PropLabel>align="{align}"</PropLabel>
            <Stack gap="xs" align={align}
              style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
            >
              <Item wide>Elemento ancho</Item>
              <Item>Elemento ajustado</Item>
              <Item wide>Elemento ancho</Item>
            </Stack>
          </div>
        ))}
      </Stack>
    </div>
  ),
};

export const JustifyCenter: Story = {
  name: 'Justify center',
  args: { gap: 'md', justify: 'center' },
  render: (args) => (
    <Canvas>
      <loom-stack
        gap={args.gap}
        justify={args.justify}
        style={{ height: '300px', width: '100%', border: `1px dashed ${colorVars.borderDefault}`, boxSizing: 'border-box' }}
      >
        <Item wide>Centrado verticalmente</Item>
        <Item wide>En el eje principal</Item>
      </loom-stack>
    </Canvas>
  ),
};

export const Implementation: Story = {
  name: 'Implementación',
  parameters: {
    docs: {
      description: {
        story: '`gap`, `align` y `justify` son atributos reactivos. El contenido entra por slot y conserva su semántica HTML.',
      },
      source: { code: stackImplementationCode },
    },
  },
  render: () => (
    <Canvas>
      <loom-stack gap="md" align="stretch" justify="start" style={{ width: '100%' }}>
        <Item wide>Primero</Item>
        <Item wide>Segundo</Item>
      </loom-stack>
    </Canvas>
  ),
};

export const GapComparison: Story = {
  name: 'Comparación de gaps',
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Todos los valores de gap">
        <Stack gap="xl2">
          {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((size) => (
            <div key={size}>
              <PropLabel>gap="{size}"</PropLabel>
              <Stack gap={size} style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}>
                <Item wide>A</Item>
                <Item wide>B</Item>
                <Item wide>C</Item>
              </Stack>
            </div>
          ))}
        </Stack>
      </StorySection>
    </div>
  ),
};

export const WebComponent: Story = {
  args: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
  argTypes: {
    gap: { control: 'select', options: Object.keys(spacingVars) },
    align: { control: 'select', options: STACK_ALIGNS },
    justify: { control: 'select', options: STACK_JUSTIFIES },
  },
  render: ({ gap, align, justify }) => (
    <Canvas>
      <loom-stack
        gap={gap}
        align={align}
        justify={justify}
        style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
      >
        <Item wide>Elemento 1</Item>
        <Item>Elemento 2</Item>
        <Item wide>Elemento 3</Item>
      </loom-stack>
    </Canvas>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-stack');
    if (!(host instanceof HTMLElement)) {
      throw new Error('Expected a loom-stack host in the story canvas.');
    }

    await expect(host).toBeInTheDocument();
    await expect(host.getAttribute('gap')).toBe('md');
    await expect(host.getAttribute('align')).toBe('stretch');
    await expect(host.getAttribute('justify')).toBe('start');
    await expect(host.textContent ?? '').toContain('Elemento 3');

    await waitFor(async () => {
      await expect(host.classList.length).toBeGreaterThan(1);
    });
  },
};
