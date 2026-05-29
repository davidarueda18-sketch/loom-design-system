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
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/IconButton/adapters/IconButton.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
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
  <loom-box display="block" style={{ marginBottom: '40px' }}>
    <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
      {title}
    </p>
    {children}
  </loom-box>
);

const Row = ({ children }: { children: ReactNode }) => (
  <loom-inline gap="md" align="center" wrap>
    {children}
  </loom-inline>
);

const StateLabel = ({ children }: { children: string }) => (
  <p className="loom-caption" style={{
    color: colorVars.textSecondary, marginBottom: '6px',
  }}>
    {children}
  </p>
);

const SizeLabel = ({ children }: { children: string }) => (
  <p className="loom-caption" style={{
    color: colorVars.textSecondary,
    marginTop: '6px', textAlign: 'center',
  }}>
    {children}
  </p>
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
    <loom-box display="block" padding="lg">
      <IconButton
        variant={variant}
        size={size}
        disabled={disabled}
        selected={selected}
        aria-label="Buscar"
      >
        <Icon size={ICON_SIZE_MAP[size]}><MagnifyingGlassIcon /></Icon>
      </IconButton>
    </loom-box>
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
    <loom-box display="block" padding="lg" style={{ color: colorVars.textPrimary }}>
      {ICON_BUTTON_VARIANTS.map(variant => (
        <StorySection key={variant} title={`variant=${variant}`}>
          <Row>
            {ICON_BUTTON_SIZES.map(size => (
              <loom-stack key={size} gap="xs" align="center">
                <IconButton size={size} variant={variant} aria-label={`Tamaño ${size}`}>
                  <Icon size={ICON_SIZE_MAP[size]}><BookmarkIcon /></Icon>
                </IconButton>
                <SizeLabel>{size}</SizeLabel>
              </loom-stack>
            ))}
          </Row>
        </StorySection>
      ))}
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <Row>
        {ICON_BUTTON_VARIANTS.map(variant => (
          <loom-stack key={variant} gap="xs" align="center">
            <IconButton variant={variant} size="md" aria-label={variant}>
              <Icon size="md"><PencilIcon /></Icon>
            </IconButton>
            <SizeLabel>{variant}</SizeLabel>
          </loom-stack>
        ))}
      </Row>
    </loom-box>
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
    <loom-box display="block" padding="lg">
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
          <loom-inline gap="lg" wrap>
            {STATES.map(({ label, disabled, selected }) => (
              <loom-box key={label} display="block" className={`state-${label.toLowerCase()}`}>
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
              </loom-box>
            ))}
          </loom-inline>
        </StorySection>
      ))}
    </loom-box>
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
      <loom-box display="block" padding="lg">
        <loom-inline gap="lg" align="center">
        <loom-icon-button
          variant="filled"
          size="md"
          aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          selected={saved || undefined}
          ref={handleRef}
        >
          <Icon size="md"><BookmarkIcon /></Icon>
        </loom-icon-button>
        <span className="loom-caption" style={{ color: colorVars.textSecondary }}>
          selected: {String(saved)}
        </span>
        </loom-inline>
      </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-icon-button
        variant={variant}
        size={size}
        disabled={disabled || undefined}
        selected={selected || undefined}
        aria-label="Notificaciones"
      >
        <loom-icon size="md"><BellIcon /></loom-icon>
      </loom-icon-button>
    </loom-box>
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
      <loom-box display="block" padding="lg">
        <loom-stack gap="md">
        <loom-icon-button variant="filled" size="md" aria-label="Trigger events" ref={handleRef}>
          <loom-icon size="md"><MagnifyingGlassIcon /></loom-icon>
        </loom-icon-button>
        <loom-box display="block" padding="smMd" style={{
          minHeight: '80px', border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px', color: colorVars.textSecondary,
        }}>
          {log.length === 0
            ? <p className="loom-caption" style={{ margin: 0, opacity: 0.5 }}>Sin eventos aún — interactúa con el botón</p>
            : log.map((e, i) => <p key={i} className="loom-caption" style={{ margin: 0 }}>{e}</p>)
          }
        </loom-box>
        </loom-stack>
      </loom-box>
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
        <loom-box display="block" className="parts-demo"><Story /></loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-inline gap="md" align="start" wrap>
      {ICON_BUTTON_VARIANTS.map(variant => (
        <loom-stack key={variant} gap="xs" align="center">
          <loom-icon-button variant={variant} size="md" aria-label={`${variant} square via ::part(button)`}>
            <loom-icon size="md"><PencilIcon /></loom-icon>
          </loom-icon-button>
          <SizeLabel>{variant}</SizeLabel>
        </loom-stack>
      ))}
      </loom-inline>
    </loom-box>
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
