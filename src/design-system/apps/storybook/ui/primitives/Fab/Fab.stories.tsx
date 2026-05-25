import { useCallback, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { PlusIcon, BookmarkIcon, PencilIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Fab, FAB_SIZES, FAB_CONTENTS } from '../../../../../package/ui/primitives/Fab/index.ts';
import type { FabSize } from '../../../../../package/ui/primitives/Fab/index.ts';
import { Icon } from '../../../../../package/ui/primitives/Icon/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Fab/adapters/Fab.element.ts';
import '../../../loom-web-components.d.ts';

// ─── Icon size map ────────────────────────────────────────────────────────────
// Matches the Figma-specified icon sizes per FAB size (mini=20px, md=24px, lg=32px)
const ICON_SIZE_MAP = {
  sm: 'mini',
  md: 'md',
  lg: 'lg',
} as const satisfies Record<FabSize, 'mini' | 'md' | 'lg'>;

// ─── State overrides — simulate pseudo-classes visually ──────────────────────
type StateDemo = { label: string; style?: CSSProperties; disabled?: boolean };

const FAB_STATES: StateDemo[] = [
  { label: 'Default' },
  { label: 'Hover',    style: { background: colorVars.surfaceNeutral } },
  { label: 'Pressed',  style: { background: colorVars.brandAccentPressed } },
  { label: 'Focused',  style: { outline: `2px solid ${colorVars.brandAccent}`, outlineOffset: '2px' } },
  { label: 'Disabled', disabled: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
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

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
    {children}
  </div>
);

const StateLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: '10px', fontWeight: 700, fontFamily: 'monospace',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: colorVars.textSecondary, marginBottom: '6px',
  }}>
    {children}
  </div>
);

const SizeLabel = ({ children }: { children: string }) => (
  <div style={{
    fontFamily: 'monospace', fontSize: '11px', color: colorVars.textSecondary, marginTop: '6px', textAlign: 'center',
  }}>
    {children}
  </div>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Fab',
  tags: ['autodocs'],
  args: {
    size: 'md',
    content: 'icon',
    label: 'Agregar',
    icon: <Icon size="md"><PlusIcon /></Icon>,
  },
  argTypes: {
    size:     { control: 'select', options: FAB_SIZES },
    content:  { control: 'select', options: FAB_CONTENTS },
    label:    { control: 'text' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Floating Action Button (FAB)** — botón de alta énfasis que flota sobre la UI.

Soporta dos modos de contenido:
- **\`icon\`** — muestra un ícono centrado; la prop \`label\` actúa como \`aria-label\`.
- **\`text\`** — muestra un label numérico corto (ej: \`"1"\`, \`"99+"\`).

El FAB es cuadrado con border-radius proporcional al tamaño. El posicionamiento flotante (fixed/absolute) lo decide el consumidor; el componente solo aporta el z-index \`raised\`.

\`\`\`html
<loom-fab label="Agregar" content="icon" size="md">
  <svg aria-hidden="true"><!-- icon --></svg>
</loom-fab>
\`\`\`

El wrapper React \`<Fab />\` renderiza internamente \`<loom-fab>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'md',
    content: 'icon',
    label: 'Agregar',
    icon: <Icon size="md"><PlusIcon /></Icon>,
  },
  render: ({ size, content, label, disabled }) => (
    <div style={{ padding: '24px' }}>
      <loom-fab
        size={size as string}
        content={content as string}
        label={label as string}
        disabled={(disabled as boolean) || undefined}
      >
        {content !== 'text' && <PlusIcon style={{ width: '24px', height: '24px' }} />}
      </loom-fab>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Tamaños',
  parameters: {
    docs: {
      description: {
        story: 'Tres tamaños disponibles. El ícono escala proporcionalmente: `mini` (20px) para `sm`, `md` (24px) para `md`, `lg` (32px) para `lg`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', color: colorVars.textPrimary }}>
      <StorySection title="content=icon">
        <Row>
          {FAB_SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Fab size={size} label={`Tamaño ${size}`} icon={<Icon size={ICON_SIZE_MAP[size]}><PlusIcon /></Icon>} />
              <SizeLabel>{size}</SizeLabel>
            </div>
          ))}
        </Row>
      </StorySection>
      <StorySection title="content=text">
        <Row>
          {FAB_SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Fab size={size} content="text" label="99+" />
              <SizeLabel>{size}</SizeLabel>
            </div>
          ))}
        </Row>
      </StorySection>
    </div>
  ),
};

export const Contents: Story = {
  name: 'Modos de contenido',
  parameters: {
    docs: {
      description: {
        story: '`icon` es el modo principal para acciones primarias. `text` se usa para contadores o pasos numerados cortos. El `label` es visible en `text` y semántico (`aria-label`) en `icon`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="icon — ícono centrado, label como aria-label">
        <Row>
          <Fab label="Agregar" icon={<Icon size="md"><PlusIcon /></Icon>} />
          <Fab label="Guardar" icon={<Icon size="md"><BookmarkIcon /></Icon>} />
          <Fab label="Editar" icon={<Icon size="md"><PencilIcon /></Icon>} />
          <Fab label="Compartir" icon={<Icon size="md"><ShareIcon /></Icon>} />
        </Row>
      </StorySection>
      <StorySection title="text — label numérico visible">
        <Row>
          <Fab content="text" label="1" />
          <Fab content="text" label="12" />
          <Fab content="text" label="99+" />
        </Row>
      </StorySection>
    </div>
  ),
};

export const States: Story = {
  name: 'Estados interactivos',
  parameters: {
    docs: {
      description: {
        story: 'Los estados hover/pressed se simulan con `style` override — no requieren interacción del usuario. Los colores de fondo corresponden directamente a los tokens del sistema: `surfaceNeutral` (hover), `brandAccentPressed` (pressed).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="icon — tamaño MD">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {FAB_STATES.map(({ label, style, disabled }) => (
            <div key={label}>
              <StateLabel>{label}</StateLabel>
              <Fab
                size="md"
                label={label}
                icon={<Icon size="md"><PlusIcon /></Icon>}
                disabled={disabled}
                style={style}
              />
            </div>
          ))}
        </div>
      </StorySection>
      <StorySection title="text — tamaño MD">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {FAB_STATES.map(({ label, style, disabled }) => (
            <div key={label}>
              <StateLabel>{label}</StateLabel>
              <Fab
                size="md"
                content="text"
                label="99+"
                disabled={disabled}
                style={style}
              />
            </div>
          ))}
        </div>
      </StorySection>
    </div>
  ),
};

export const AllCombinations: Story = {
  name: 'Todas las combinaciones',
  render: () => (
    <div style={{ padding: '24px' }}>
      {FAB_CONTENTS.map((content) => (
        <StorySection key={content} title={`content=${content}`}>
          <Row>
            {FAB_SIZES.map((size) => (
              <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <Fab
                  size={size}
                  content={content}
                  label={content === 'icon' ? `Acción ${size}` : '42'}
                  icon={content === 'icon' ? <Icon size={ICON_SIZE_MAP[size]}><PlusIcon /></Icon> : undefined}
                />
                <SizeLabel>{size}</SizeLabel>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <Fab
                size="md"
                content={content}
                label={content === 'icon' ? 'Deshabilitado' : '42'}
                icon={content === 'icon' ? <Icon size="md"><PlusIcon /></Icon> : undefined}
                disabled
              />
              <SizeLabel>disabled</SizeLabel>
            </div>
          </Row>
        </StorySection>
      ))}
    </div>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  parameters: {
    docs: {
      description: {
        story: 'La prop `as` cambia el elemento DOM renderizado sin alterar el estilo. Útil cuando el FAB navega (renderizar como `<a>`) o se integra en un router de terceros.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title='as="a" — renderiza como enlace'>
        <Row>
          <Fab as="a" href="#" label="Enlace" icon={<Icon size="md"><PlusIcon /></Icon>} />
        </Row>
      </StorySection>
    </div>
  ),
};

// ─── Web Component stories ────────────────────────────────────────────────────

const getLoomFab = (canvasElement: HTMLElement): HTMLElementTagNameMap['loom-fab'] => {
  const host = canvasElement.querySelector('loom-fab');
  if (!(host instanceof HTMLElement)) throw new Error('Expected a loom-fab host in the story canvas.');
  return host as HTMLElementTagNameMap['loom-fab'];
};

export const WebComponent: StoryObj<{
  size?: string;
  content?: string;
  label?: string;
  disabled?: boolean;
}> = {
  name: 'Web Component (loom-fab)',
  parameters: {
    docs: {
      description: {
        story: 'Custom element `<loom-fab>`. El ícono se inyecta via `<slot>` (usa `<loom-icon>` o cualquier SVG). La story valida Shadow DOM, el inner button con `part="button"`, y el `aria-label` en modo `icon`.',
      },
    },
  },
  args: {
    size: 'md',
    content: 'icon',
    label: 'Agregar',
    disabled: false,
  },
  argTypes: {
    size:     { control: 'select', options: FAB_SIZES },
    content:  { control: 'select', options: FAB_CONTENTS },
    label:    { control: 'text' },
    disabled: { control: 'boolean' },
  },
  render: ({ size, content, label, disabled }) => (
    <div style={{ padding: '24px' }}>
      <loom-fab
        size={size}
        content={content}
        label={label}
        disabled={disabled || undefined}
      >
        {content !== 'text' && <PlusIcon style={{ width: '24px', height: '24px' }} />}
      </loom-fab>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomFab(canvasElement);
    await expect(host.shadowRoot).toBeTruthy();
    const inner = host.shadowRoot!.querySelector('button[part="button"]');
    await expect(inner).toBeInTheDocument();
    await expect(inner?.getAttribute('aria-label')).toBe('Agregar');
  },
};

export const CustomEvents: Story = {
  name: 'Eventos personalizados',
  parameters: {
    docs: {
      description: {
        story: 'El FAB re-despacha `loom-click`, `loom-focus` y `loom-blur` con `bubbles: true, composed: true`. Estos eventos cruzan el shadow boundary y son accesibles en Angular/Vue.',
      },
    },
  },
  render: () => {
    const [log, setLog] = useState<string[]>([]);

    const handleRef = useCallback((el: HTMLElement | null) => {
      if (!el) return;
      el.addEventListener('loom-click', () => {
        setLog((prev) => [`loom-click @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 8));
      });
      el.addEventListener('loom-focus', () => {
        setLog((prev) => [`loom-focus @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 8));
      });
      el.addEventListener('loom-blur', () => {
        setLog((prev) => [`loom-blur @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 8));
      });
    }, []);

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <loom-fab
          size="md"
          content="icon"
          label="Trigger events"
          ref={handleRef as React.Ref<HTMLElement>}
        >
          <PlusIcon style={{ width: '24px', height: '24px' }} />
        </loom-fab>
        <div style={{
          minHeight: '80px',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: colorVars.textSecondary,
        }}>
          {log.length === 0
            ? <span style={{ opacity: 0.5 }}>Sin eventos aún — interactúa con el FAB</span>
            : log.map((entry, i) => <div key={i}>{entry}</div>)
          }
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const host = getLoomFab(canvasElement);
    host.shadowRoot?.querySelector('button[part="button"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );
    await waitFor(async () => {
      await expect(canvasElement.textContent ?? '').toContain('loom-click');
    });
  },
};

export const CSSParts: Story = {
  decorators: [
    (Story) => (
      <>
        <style>{`
          .parts-demo loom-fab::part(button) {
            border-radius: 0;
          }
          .parts-demo loom-fab::part(label) {
            font-style: italic;
            letter-spacing: 0.05em;
          }
        `}</style>
        <div className="parts-demo">
          <Story />
        </div>
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Partes expuestas para override visual sin romper la encapsulación del shadow root:

| Part name | Elemento | Qué personalizar |
|---|---|---|
| \`button\` | Inner \`<button>\` | border-radius, cursor, outline, transiciones |
| \`label\` | \`<span>\` de texto | font, color, letter-spacing (solo en \`content="text"\`) |
        `.trim(),
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <loom-fab size="md" content="icon" label="Esquina cuadrada vía ::part(button)">
          <PlusIcon style={{ width: '24px', height: '24px' }} />
        </loom-fab>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: colorVars.textSecondary }}>icon</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <loom-fab size="md" content="text" label="42">
        </loom-fab>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: colorVars.textSecondary }}>text (italic via ::part(label))</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomFab(canvasElement);
    await waitFor(async () => {
      const inner = host.shadowRoot?.querySelector('button[part="button"]');
      await expect(inner).toBeInTheDocument();
      await expect(getComputedStyle(inner!).borderRadius).toBe('0px');
    });
  },
};
