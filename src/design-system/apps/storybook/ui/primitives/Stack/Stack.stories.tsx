import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { STACK_ALIGNS, STACK_JUSTIFIES } from '../../../../../package/ui/primitives/Stack/index.ts';
import type { StackAlign, StackJustify } from '../../../../../package/ui/primitives/Stack/index.ts';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

const stackImplementationCode = `import '@loom-sdc/design-system/elements/stack';

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
<script type="module" src="@loom-sdc/design-system/elements/stack"></script>

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
  <loom-box display="block" style={{ width: '100%', maxWidth: `${maxWidth}px`, minWidth: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
    {children}
  </loom-box>
);

const Item = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <loom-box display="block" padding-x="md" padding-y="smMd" style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    borderRadius: '4px',
    color: colorVars.textPrimary,
    width: wide ? '100%' : 'fit-content',
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflowWrap: 'anywhere',
  }}>
    <p className="loom-body-sm" style={{ margin: 0 }}>{children}</p>
  </loom-box>
);

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <loom-box display="block" style={{ marginBottom: '32px' }}>
    <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 12px' }}>
      {title}
    </p>
    {children}
  </loom-box>
);

const PropLabel = ({ children }: { children: ReactNode }) => (
  <p className="loom-caption" style={{
    color: colorVars.brandAccent, marginBottom: '4px',
  }}>
    {children}
  </p>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
        {STACK_ALIGNS.map((align) => (
          <loom-box key={align} display="block">
            <PropLabel>align="{align}"</PropLabel>
            <loom-stack gap="xs" align={align}
              style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
            >
              <Item wide>Elemento ancho</Item>
              <Item>Elemento ajustado</Item>
              <Item wide>Elemento ancho</Item>
            </loom-stack>
          </loom-box>
        ))}
      </loom-stack>
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <StorySection title="Todos los valores de gap">
        <loom-stack gap="xl2">
          {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((size) => (
            <loom-box key={size} display="block">
              <PropLabel>gap="{size}"</PropLabel>
              <loom-stack gap={size} style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}>
                <Item wide>A</Item>
                <Item wide>B</Item>
                <Item wide>C</Item>
              </loom-stack>
            </loom-box>
          ))}
        </loom-stack>
      </StorySection>
    </loom-box>
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
