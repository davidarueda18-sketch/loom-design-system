import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { INLINE_ALIGNS, INLINE_JUSTIFIES } from '../../../../../package/ui/primitives/Inline/index.ts';
import type { InlineAlign, InlineJustify } from '../../../../../package/ui/primitives/Inline/index.ts';
import { spacingVars } from '../../../../../package/tokens/spacing/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

const inlineImplementationCode = `import '@loom-sdc/design-system/elements';

<loom-inline gap="sm" align="center" justify="start" wrap>
  <loom-button variant="outline">Cancelar</loom-button>
  <loom-button>Guardar</loom-button>
</loom-inline>`;

interface InlineStoryArgs {
  gap?: string;
  align?: InlineAlign;
  justify?: InlineJustify;
  wrap?: boolean;
}

const meta = {
  title: 'Primitives/Inline',
  tags: ['autodocs'],
  argTypes: {
    gap:     { control: 'select', options: Object.keys(spacingVars) },
    align:   { control: 'select', options: INLINE_ALIGNS },
    justify: { control: 'select', options: INLINE_JUSTIFIES },
    wrap:    { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Inline** es el primitive canónico para layout horizontal con gap tokenizado, alineación y wrapping opcional.

\`\`\`html
<script type="module" src="@loom-sdc/design-system/elements"></script>

<loom-inline gap="sm" align="center" justify="start" wrap>
  <loom-button variant="outline">Cancelar</loom-button>
  <loom-button>Guardar</loom-button>
</loom-inline>
\`\`\`

El wrapper React \`<Inline />\` renderiza internamente \`<loom-inline>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<InlineStoryArgs>;

export default meta;
type Story = StoryObj<InlineStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Canvas = ({ children, maxWidth = 560 }: { children: ReactNode; maxWidth?: number }) => (
  <loom-box display="block" style={{ width: '100%', maxWidth: `${maxWidth}px`, minWidth: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
    {children}
  </loom-box>
);

const Chip = ({ children }: { children: ReactNode }) => (
  <loom-box display="inline-block" padding-x="smMd" style={{
    background: colorVars.surfaceRaised,
    border: `1px solid ${colorVars.borderSubtle}`,
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '999px',
    color: colorVars.textPrimary,
    whiteSpace: 'nowrap' as const,
  }}>
    <span className="loom-body-sm">{children}</span>
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

const PropLabel = ({ children }: { children: string }) => (
  <span className="loom-caption" style={{
    color: colorVars.brandAccent, width: '72px', flexShrink: 0,
  }}>
    {children}
  </span>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { gap: 'sm', align: 'center' },
  parameters: {
    docs: {
      source: { code: '<loom-inline gap="sm" align="center"><span>Elemento 1</span><span>Elemento 2</span></loom-inline>' },
    },
  },
  render: (args) => (
    <Canvas>
      <loom-inline gap={args.gap} align={args.align} style={{ width: '100%' }}>
        <Chip>Elemento 1</Chip>
        <Chip>Elemento 2</Chip>
        <Chip>Elemento 3</Chip>
      </loom-inline>
    </Canvas>
  ),
};

export const Align: Story = {
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
        {INLINE_ALIGNS.map((align) => (
          <loom-inline key={align} gap="sm" align={align}
            style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
          >
            <PropLabel>{align}</PropLabel>
            <Chip>A</Chip>
            <span className="loom-title-sm" style={{ color: colorVars.textPrimary }}>B grande</span>
            <Chip>C</Chip>
          </loom-inline>
        ))}
      </loom-stack>
    </loom-box>
  ),
};

export const Justify: Story = {
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
        {INLINE_JUSTIFIES.map((justify) => (
          <loom-inline key={justify} gap="sm" justify={justify}
            style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px' }}
          >
            <PropLabel>{justify}</PropLabel>
            <Chip>A</Chip>
            <Chip>B</Chip>
            <Chip>C</Chip>
          </loom-inline>
        ))}
      </loom-stack>
    </loom-box>
  ),
};

export const WithWrap: Story = {
  name: 'Con wrap',
  args: { gap: 'sm', wrap: true },
  render: (args) => (
    <Canvas maxWidth={320}>
      <loom-inline
        gap={args.gap}
        wrap={args.wrap || undefined}
        style={{ width: '100%', border: `1px dashed ${colorVars.borderDefault}`, padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }}
      >
        {['React', 'TypeScript', 'Vite', 'Vanilla Extract', 'Storybook', 'A11y'].map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </loom-inline>
    </Canvas>
  ),
};

export const Implementation: Story = {
  name: 'Implementación',
  parameters: {
    docs: {
      description: {
        story: '`wrap` es booleano por presencia. `gap`, `align` y `justify` se actualizan como atributos reactivos del custom element.',
      },
      source: { code: inlineImplementationCode },
    },
  },
  render: () => (
    <Canvas>
      <loom-inline gap="sm" align="center" justify="start" wrap style={{ width: '100%' }}>
        <loom-button variant="outline">Cancelar</loom-button>
        <loom-button>Guardar</loom-button>
      </loom-inline>
    </Canvas>
  ),
};

export const GapComparison: Story = {
  name: 'Comparación de gaps',
  render: () => (
    <loom-box display="block" padding="lg">
      <StorySection title="Todos los valores de gap">
        <loom-stack gap="sm">
          {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((size) => (
            <loom-inline key={size} gap={size} align="center">
              <PropLabel>{size}</PropLabel>
              <Chip>A</Chip>
              <Chip>B</Chip>
              <Chip>C</Chip>
            </loom-inline>
          ))}
        </loom-stack>
      </StorySection>
    </loom-box>
  ),
};

export const WebComponent: Story = {
  args: {
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: false,
  },
  argTypes: {
    gap: { control: 'select', options: Object.keys(spacingVars) },
    align: { control: 'select', options: INLINE_ALIGNS },
    justify: { control: 'select', options: INLINE_JUSTIFIES },
    wrap: { control: 'boolean' },
  },
  render: ({ gap, align, justify, wrap }) => (
    <Canvas maxWidth={360}>
      <loom-inline
        gap={gap}
        align={align}
        justify={justify}
        wrap={wrap || undefined}
        style={{ border: `1px dashed ${colorVars.borderSubtle}`, padding: '8px', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
      >
        <Chip>React</Chip>
        <Chip>TypeScript</Chip>
        <Chip>Vite</Chip>
        <Chip>Storybook</Chip>
      </loom-inline>
    </Canvas>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-inline');
    if (!(host instanceof HTMLElement)) {
      throw new Error('Expected a loom-inline host in the story canvas.');
    }

    await expect(host).toBeInTheDocument();
    await expect(host.getAttribute('gap')).toBe('sm');
    await expect(host.getAttribute('align')).toBe('center');
    await expect(host.getAttribute('justify')).toBe('start');
    await expect(host.hasAttribute('wrap')).toBe(false);
    await expect(host.textContent ?? '').toContain('Storybook');

    await waitFor(async () => {
      await expect(host.classList.length).toBeGreaterThan(1);
    });
  },
};
