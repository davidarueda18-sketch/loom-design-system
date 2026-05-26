import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { BookmarkIcon, PencilIcon, ShareIcon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { IconButton, ICON_BUTTON_VARIANTS, ICON_BUTTON_SIZES } from '../../../../../package/ui/primitives/IconButton/index.ts';
import type { IconButtonVariant, IconButtonSize } from '../../../../../package/ui/primitives/IconButton/index.ts';
import { Icon } from '../../../../../package/ui/primitives/Icon/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/IconButton/adapters/IconButton.element.ts';
import '../../../loom-web-components.d.ts';

// ─── Icon size per button size ────────────────────────────────────────────────
const ICON_SIZE_MAP = {
  sm: 'mini',
  md: 'md',
  lg: 'md',
} as const satisfies Record<IconButtonSize, 'mini' | 'md'>;

// ─── State demo helpers ───────────────────────────────────────────────────────
type StateDemo = { label: string; disabled?: boolean; selected?: boolean };

const STATES: StateDemo[] = [
  { label: 'Default' },
  { label: 'Hover' },
  { label: 'Active' },
  { label: 'Focus' },
  { label: 'Selected', selected: true },
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
    fontFamily: 'monospace', fontSize: '11px', color: colorVars.textSecondary,
    marginTop: '6px', textAlign: 'center',
  }}>
    {children}
  </div>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────
interface IconButtonStoryArgs {
  variant: IconButtonVariant;
  size: IconButtonSize;
  disabled?: boolean;
  selected?: boolean;
}

const meta = {
  title: 'Primitives/IconButton',
  tags: ['autodocs'],
  args: {
    variant: 'filled',
    size: 'md',
    disabled: false,
    selected: false,
  },
  argTypes: {
    variant:  { control: 'select', options: ICON_BUTTON_VARIANTS },
    size:     { control: 'select', options: ICON_BUTTON_SIZES },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**IconButton** — botón circular de solo ícono. Soporta 4 variantes, 3 tamaños y 6 estados de interacción.

El ícono se inyecta via slot (usa \`<Icon>\` o cualquier SVG). La prop \`aria-label\` es **obligatoria** — los botones de solo ícono siempre necesitan texto accesible alternativo.

Cuando se usa como toggle, el atributo \`selected\` activa \`aria-pressed\` en el botón interno. El componente emite \`loom-toggle\` con el estado deseado para que el consumidor lo gestione.

\`\`\`html
<!-- Botón simple -->
<loom-icon-button size="md" variant="filled" aria-label="Guardar">
  <svg aria-hidden="true"><!-- ícono --></svg>
</loom-icon-button>

<!-- Toggle button -->
<loom-icon-button variant="filled" aria-label="Guardar en favoritos" selected>
  <svg aria-hidden="true"><!-- ícono --></svg>
</loom-icon-button>
\`\`\`

El wrapper React \`<IconButton />\` renderiza internamente \`<loom-icon-button>\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<IconButtonStoryArgs>;

export default meta;
type Story = StoryObj<IconButtonStoryArgs>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: ({ variant, size, disabled, selected }) => (
    <div style={{ padding: '24px' }}>
      <IconButton
        variant={variant}
        size={size}
        disabled={disabled}
        selected={selected}
        aria-label="Buscar"
      >
        <Icon size={ICON_SIZE_MAP[size]}><MagnifyingGlassIcon /></Icon>
      </IconButton>
    </div>
  ),
};

// ─── Tamaños ─────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  name: 'Tamaños',
  parameters: {
    docs: {
      description: {
        story: '`sm` (32px) · `md` (40px) · `lg` (48px). El ícono escala con el tamaño: usa `mini` (20px) para `sm` y `md` (24px) para `md`/`lg`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', color: colorVars.textPrimary }}>
      {ICON_BUTTON_VARIANTS.map(variant => (
        <StorySection key={variant} title={`variant=${variant}`}>
          <Row>
            {ICON_BUTTON_SIZES.map(size => (
              <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton size={size} variant={variant} aria-label={`Tamaño ${size}`}>
                  <Icon size={ICON_SIZE_MAP[size]}><BookmarkIcon /></Icon>
                </IconButton>
                <SizeLabel>{size}</SizeLabel>
              </div>
            ))}
          </Row>
        </StorySection>
      ))}
    </div>
  ),
};

// ─── Variantes ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  name: 'Variantes',
  parameters: {
    docs: {
      description: {
        story: '`filled` usa el fondo `borderDefault`. `ghost` es transparente. `outline` agrega borde interactivo. `brand` usa el color acento (cyan) como fondo con ícono invertido.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <Row>
        {ICON_BUTTON_VARIANTS.map(variant => (
          <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton variant={variant} size="md" aria-label={variant}>
              <Icon size="md"><PencilIcon /></Icon>
            </IconButton>
            <SizeLabel>{variant}</SizeLabel>
          </div>
        ))}
      </Row>
    </div>
  ),
};

// ─── Estados interactivos ─────────────────────────────────────────────────────
export const States: Story = {
  name: 'Estados interactivos',
  parameters: {
    docs: {
      description: {
        story: 'Los estados hover/active/focus se simulan vía `::part(button)` con una regla `<style>` por clase wrapper. `selected` activa `aria-pressed="true"`. `disabled` es nativo.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <style>{`
        /* Hover — todos usan brandAccentPressed (#283739) */
        .state-hover loom-icon-button::part(button)                   { background: ${colorVars.brandAccentPressed}; }
        .state-hover loom-icon-button[variant="outline"]::part(button) { border-color: ${colorVars.brandAccent}; }
        .state-hover loom-icon-button[variant="brand"]::part(button)   { color: ${colorVars.textPrimary}; border: none; }

        /* Active — igual que hover */
        .state-active loom-icon-button::part(button)                   { background: ${colorVars.brandAccentPressed}; }
        .state-active loom-icon-button[variant="outline"]::part(button) { border: none; }
        .state-active loom-icon-button[variant="brand"]::part(button)   { color: ${colorVars.textPrimary}; border: none; }

        /* Focus — borde inset 2px (no outline externo) */
        .state-focus loom-icon-button::part(button)                    { border: 2px solid ${colorVars.brandAccent}; }
        .state-focus loom-icon-button[variant="outline"]::part(button)  { border: 1.5px solid ${colorVars.brandAccent}; }
        .state-focus loom-icon-button[variant="brand"]::part(button)    { background: ${colorVars.brandAccent}; color: ${colorVars.textInverse}; border: 2px solid ${colorVars.borderDefault}; }
      `}</style>
      {ICON_BUTTON_VARIANTS.map(variant => (
        <StorySection key={variant} title={`variant=${variant}`}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {STATES.map(({ label, disabled, selected }) => (
              <div key={label} className={`state-${label.toLowerCase()}`}>
                <StateLabel>{label}</StateLabel>
                <IconButton
                  variant={variant}
                  size="md"
                  aria-label={label}
                  disabled={disabled}
                  selected={selected}
                >
                  <Icon size="md"><ShareIcon /></Icon>
                </IconButton>
              </div>
            ))}
          </div>
        </StorySection>
      ))}
    </div>
  ),
};

// ─── Toggle (selected) ───────────────────────────────────────────────────────
export const Toggle: Story = {
  name: 'Toggle (selected)',
  parameters: {
    docs: {
      description: {
        story: 'Patrón de toggle: el consumidor gestiona el estado `selected`. El componente emite `loom-toggle` con `detail.selected` (valor deseado). Usa `aria-pressed` internamente.',
      },
    },
  },
  render: () => {
    const [saved, setSaved] = useState(false);

    const handleRef = useCallback((el: HTMLElementTagNameMap['loom-icon-button'] | null) => {
      if (!el) return;
      el.addEventListener('loom-toggle', (e) => setSaved((e as CustomEvent<{ selected: boolean }>).detail.selected));
    }, []);

    return (
      <div style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <loom-icon-button
          variant="filled"
          size="md"
          aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          selected={saved || undefined}
          ref={handleRef}
        >
          <BookmarkIcon style={{ width: '24px', height: '24px' }} />
        </loom-icon-button>
        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: colorVars.textSecondary }}>
          selected: {String(saved)}
        </span>
      </div>
    );
  },
};

// ─── Web Component (loom-icon-button) ────────────────────────────────────────
const getLoomIconButton = (canvas: HTMLElement) => {
  const el = canvas.querySelector('loom-icon-button');
  if (!(el instanceof HTMLElement)) throw new Error('Expected loom-icon-button in canvas');
  return el as HTMLElementTagNameMap['loom-icon-button'];
};

export const WebComponent: StoryObj<{
  variant?: string;
  size?: string;
  disabled?: boolean;
  selected?: boolean;
}> = {
  name: 'Web Component (loom-icon-button)',
  parameters: {
    docs: {
      description: {
        story: 'Custom element `<loom-icon-button>`. El ícono se inyecta via `<slot>`. La story valida Shadow DOM, `part="button"`, y `aria-label` en el botón interno.',
      },
    },
  },
  args: { variant: 'filled', size: 'md', disabled: false, selected: false },
  argTypes: {
    variant:  { control: 'select', options: ICON_BUTTON_VARIANTS },
    size:     { control: 'select', options: ICON_BUTTON_SIZES },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  render: ({ variant, size, disabled, selected }) => (
    <div style={{ padding: '24px' }}>
      <loom-icon-button
        variant={variant}
        size={size}
        disabled={disabled || undefined}
        selected={selected || undefined}
        aria-label="Notificaciones"
      >
        <BellIcon style={{ width: '24px', height: '24px' }} />
      </loom-icon-button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host  = getLoomIconButton(canvasElement);
    await expect(host.shadowRoot).toBeTruthy();
    const inner = host.shadowRoot!.querySelector('button[part="button"]');
    await expect(inner).toBeInTheDocument();
    await expect(inner?.getAttribute('aria-label')).toBe('Notificaciones');
  },
};

// ─── Eventos personalizados ───────────────────────────────────────────────────
export const CustomEvents: Story = {
  name: 'Eventos personalizados',
  parameters: {
    docs: {
      description: {
        story: 'El componente emite `loom-click`, `loom-toggle` (con `detail.selected`), `loom-focus` y `loom-blur`. Todos con `bubbles: true, composed: true` para cruzar el shadow boundary.',
      },
    },
  },
  render: () => {
    const [log, setLog] = useState<string[]>([]);

    const handleRef = useCallback((el: HTMLElementTagNameMap['loom-icon-button'] | null) => {
      if (!el) return;
      el.addEventListener('loom-click',  () => setLog(p => [`loom-click @ ${new Date().toLocaleTimeString()}`, ...p].slice(0, 8)));
      el.addEventListener('loom-toggle', (e) => setLog(p => [`loom-toggle selected=${(e as CustomEvent).detail.selected} @ ${new Date().toLocaleTimeString()}`, ...p].slice(0, 8)));
      el.addEventListener('loom-focus',  () => setLog(p => [`loom-focus @ ${new Date().toLocaleTimeString()}`, ...p].slice(0, 8)));
      el.addEventListener('loom-blur',   () => setLog(p => [`loom-blur @ ${new Date().toLocaleTimeString()}`, ...p].slice(0, 8)));
    }, []);

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <loom-icon-button variant="filled" size="md" aria-label="Trigger events" ref={handleRef}>
          <MagnifyingGlassIcon style={{ width: '24px', height: '24px' }} />
        </loom-icon-button>
        <div style={{
          minHeight: '80px', border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px', padding: '10px',
          fontFamily: 'monospace', fontSize: '12px', color: colorVars.textSecondary,
        }}>
          {log.length === 0
            ? <span style={{ opacity: 0.5 }}>Sin eventos aún — interactúa con el botón</span>
            : log.map((e, i) => <div key={i}>{e}</div>)
          }
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const host = getLoomIconButton(canvasElement);
    host.shadowRoot?.querySelector('button[part="button"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );
    await waitFor(async () => {
      await expect(canvasElement.textContent ?? '').toContain('loom-click');
    });
  },
};

// ─── CSS Parts ───────────────────────────────────────────────────────────────
export const CSSParts: Story = {
  decorators: [
    (Story) => (
      <>
        <style>{`
          .parts-demo loom-icon-button::part(button) { border-radius: 8px; }
        `}</style>
        <div className="parts-demo"><Story /></div>
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Parte expuesta para override sin romper la encapsulación del shadow root:

| Part | Elemento | Qué personalizar |
|---|---|---|
| \`button\` | Inner \`<button>\` | border-radius, outline, cursor, transiciones |
        `.trim(),
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {ICON_BUTTON_VARIANTS.map(variant => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <loom-icon-button variant={variant} size="md" aria-label={`${variant} square via ::part(button)`}>
            <PencilIcon style={{ width: '24px', height: '24px' }} />
          </loom-icon-button>
          <SizeLabel>{variant}</SizeLabel>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = getLoomIconButton(canvasElement);
    await waitFor(async () => {
      const inner = host.shadowRoot?.querySelector('button[part="button"]');
      await expect(inner).toBeInTheDocument();
      await expect(getComputedStyle(inner!).borderRadius).toBe('8px');
    });
  },
};
