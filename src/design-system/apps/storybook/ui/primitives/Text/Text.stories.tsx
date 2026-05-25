import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Text, variantTokenMap } from '../../../../../package/ui/primitives/Text/index.ts';
import type { TextVariant } from '../../../../../package/ui/primitives/Text/index.ts';
import { fontFamilyVars } from '../../../../../package/tokens/fontFamily/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Text/adapters/Text.element.ts';
import '../../../loom-web-components.d.ts';

const allVariants = Object.keys(variantTokenMap) as TextVariant[];
const textImplementationCode = `import '@loom-sdc/design-system/elements';

<loom-text variant="body-md" align="start">
  Loom Design System
</loom-text>`;

interface TextStoryArgs {
  variant?: TextVariant;
  align?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const meta = {
  title: 'Primitives/Text',
  tags: ['autodocs'],
  args: {
    variant:  'body-md',
    children: 'Loom Design System',
  },
  argTypes: {
    variant: { control: 'select', options: allVariants },
    align: { control: 'select', options: ['start', 'center', 'end', 'justify'] },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Text** es el primitive canónico para aplicar variantes tipográficas tokenizadas.

\`\`\`html
<script type="module" src="@loom-sdc/design-system/elements"></script>

<loom-text variant="body-md" align="start">
  Loom Design System
</loom-text>
\`\`\`

El wrapper React \`<Text />\` renderiza internamente \`<loom-text>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<TextStoryArgs>;

export default meta;
type Story = StoryObj<TextStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Canvas = ({ children, maxWidth = 680 }: { children: ReactNode; maxWidth?: number }) => (
  <div style={{ width: '100%', maxWidth: `${maxWidth}px`, minWidth: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
    {children}
  </div>
);

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: '32px' }}>
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

const TypeScaleRow = ({ variant }: { variant: TextVariant }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', gap: '24px',
    padding: '10px 0', borderBottom: `1px solid ${colorVars.borderSubtle}`,
  }}>
    <span style={{
      fontFamily: 'monospace', fontSize: '11px',
      color: colorVars.textSecondary, width: '140px', flexShrink: 0,
    }}>
      {variant}
    </span>
    <Text variant={variant} style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
      Loom Design System
    </Text>
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    style: { fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary },
  },
  parameters: {
    docs: {
      source: { code: '<loom-text variant="body-md" align="start">Loom Design System</loom-text>' },
    },
  },
  render: ({ variant, align, children }) => (
    <Canvas>
      <loom-text
        variant={variant}
        align={align}
        style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary, overflowWrap: 'anywhere' }}
      >
        {children}
      </loom-text>
    </Canvas>
  ),
};

export const TypeScale: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Todas las variantes">
        {allVariants.map((variant) => (
          <TypeScaleRow key={variant} variant={variant} />
        ))}
      </StorySection>
    </div>
  ),
};

export const ReactWrapper: Story = {
  name: 'Wrapper React',
  parameters: {
    docs: {
      description: {
        story: 'El wrapper React mantiene ergonomía JSX, pero renderiza el mismo custom element `loom-text` que la API canónica.',
      },
      source: { code: '<Text variant="body-md">Loom Design System</Text>' },
    },
  },
  render: () => (
    <Canvas>
      <Text variant="body-md" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
        Loom Design System desde React
      </Text>
    </Canvas>
  ),
};

export const Implementation: Story = {
  name: 'Implementación',
  parameters: {
    docs: {
      description: {
        story: '`variant` selecciona una entrada de la escala tipográfica y `align` aplica alineación de texto sin duplicar valores CSS.',
      },
      source: { code: textImplementationCode },
    },
  },
  render: () => (
    <Canvas>
      <loom-text variant="body-md" align="start" style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
        Loom Design System
      </loom-text>
    </Canvas>
  ),
};

export const WebComponent: Story = {
  args: {
    variant: 'body-md',
    children: 'Loom Design System',
  },
  argTypes: {
    variant:  { control: 'select', options: allVariants },
    align:    { control: 'select', options: ['start', 'center', 'end', 'justify'] },
    children: { control: 'text' },
  },
  render: ({ variant, align, children }) => (
    <Canvas>
      <loom-text
        variant={variant}
        align={align}
        style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary, overflowWrap: 'anywhere' }}
      >
        {children}
      </loom-text>
    </Canvas>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-text');
    if (!(host instanceof HTMLElement)) {
      throw new Error('Expected a loom-text host in the story canvas.');
    }

    await expect(host).toBeInTheDocument();
    await expect(host.getAttribute('variant')).toBe('body-md');
    await expect(host.textContent).toContain('Loom Design System');

    await waitFor(async () => {
      await expect(host.classList.length).toBeGreaterThan(1);
    });
  },
};
