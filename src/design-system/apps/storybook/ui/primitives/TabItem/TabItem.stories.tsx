import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { TAB_ITEM_STATES } from '../../../../../package/ui/primitives/TabItem/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/TabItem/adapters/TabItem.element.ts';
import '../../../loom-web-components.d.ts';

// ─── JSX namespace for loom-tab-item ─────────────────────────────────────────

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'loom-tab-item': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['loom-tab-item']> & {
          value?: string;
          label?: string;
          active?: boolean | '';
          disabled?: boolean | '';
          'show-icon'?: boolean | '';
        },
        HTMLElementTagNameMap['loom-tab-item']
      >;
    }
  }
}

// ─── Story arg interfaces ─────────────────────────────────────────────────────

interface TabItemStoryArgs {
  label: string;
  value: string;
  active: boolean;
  disabled: boolean;
  showIcon: boolean;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Tab Item',
  tags: ['autodocs'],
  args: {
    label: 'Pestaña',
    value: 'tab1',
    active: false,
    disabled: false,
    showIcon: false,
  },
  argTypes: {
    label:    { control: 'text' },
    value:    { control: 'text' },
    active:   { control: 'boolean' },
    disabled: { control: 'boolean' },
    showIcon: { control: 'boolean', description: 'Muestra u oculta el slot del ícono' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Elemento de pestaña individual como Web Component. Gestiona 4 estados: **default**, **hover**
(CSS), **selected/active** y **disabled**. Soporta un ícono opcional via slot \`icon\`,
controlado por el atributo booleano \`show-icon\`.

\`\`\`html
<!-- Pestaña por defecto -->
<loom-tab-item value="overview" label="Resumen"></loom-tab-item>

<!-- Pestaña activa -->
<loom-tab-item value="details" label="Detalles" active></loom-tab-item>

<!-- Pestaña con ícono -->
<loom-tab-item value="reports" label="Reportes" show-icon>
  <loom-icon slot="icon" name="chart-bar"></loom-icon>
</loom-tab-item>

<!-- Pestaña deshabilitada -->
<loom-tab-item value="settings" label="Configuración" disabled></loom-tab-item>
\`\`\`

Emite \`loom-tab-item-select\` al hacer clic (burbujea y cruza Shadow DOM).
Normalmente se usa dentro de \`<loom-tab-group>\`, que gestiona el estado activo automáticamente.
        `.trim(),
      },
    },
  },
} satisfies Meta<TabItemStoryArgs>;

export default meta;
type Story = StoryObj<TabItemStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
}

// Inline SVG placeholder icon matching loom-icon dimensions
function DemoIcon() {
  return (
    <svg slot="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
      width="20" height="20" aria-hidden="true">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ label, value, active, disabled, showIcon }) => (
    <div style={{ padding: '24px', backgroundColor: colorVars.surfaceBase }}>
      <div style={{ display: 'inline-flex', borderBottom: `1px solid ${colorVars.borderDefault}` }}>
        <loom-tab-item
          value={value}
          label={label}
          {...(active    ? { active: '' }     : {})}
          {...(disabled  ? { disabled: '' }   : {})}
          {...(showIcon  ? { 'show-icon': '' } : {})}
        >
          {showIcon && <DemoIcon />}
        </loom-tab-item>
      </div>
    </div>
  ),
};

export const States: Story = {
  name: 'Estados',
  parameters: {
    docs: {
      description: {
        story: 'Los 4 estados del Tab Item. Hover es manejado por CSS automáticamente.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', backgroundColor: colorVars.surfaceBase, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Section title="Estados funcionales">
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${colorVars.borderDefault}` }}>
          {TAB_ITEM_STATES.filter(s => s !== 'hover').map((s) => (
            <loom-tab-item
              key={s}
              value={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              {...(s === 'selected' ? { active: '' }   : {})}
              {...(s === 'disabled' ? { disabled: '' } : {})}
            />
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'Con ícono',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `show-icon` muestra el slot `icon`. Pasa cualquier contenido al slot con `slot="icon"`.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', backgroundColor: colorVars.surfaceBase, display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Section title="Con ícono — todos los estados">
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${colorVars.borderDefault}` }}>
          {TAB_ITEM_STATES.filter(s => s !== 'hover').map((s) => (
            <loom-tab-item
              key={s}
              value={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              show-icon=""
              {...(s === 'selected' ? { active: '' }   : {})}
              {...(s === 'disabled' ? { disabled: '' } : {})}
            >
              <DemoIcon />
            </loom-tab-item>
          ))}
        </div>
      </Section>
      <Section title="Sin ícono (show-icon ausente)">
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${colorVars.borderDefault}` }}>
          {TAB_ITEM_STATES.filter(s => s !== 'hover').map((s) => (
            <loom-tab-item
              key={s}
              value={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              {...(s === 'selected' ? { active: '' }   : {})}
              {...(s === 'disabled' ? { disabled: '' } : {})}
            />
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Interactive: Story = {
  name: 'Interactivo',
  parameters: {
    docs: {
      description: {
        story: 'El Tab Item emite `loom-tab-item-select` al hacer clic. El log muestra el stream de eventos.',
      },
    },
  },
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);

    const handleRef = React.useCallback((el: HTMLElementTagNameMap['loom-tab-item'] | null) => {
      if (!el) return;
      el.addEventListener('loom-tab-item-select', (e) => {
        const { value } = (e as CustomEvent).detail as { value: string };
        setLog((prev) => [`loom-tab-item-select → value="${value}"`, ...prev].slice(0, 5));
      });
    }, []);

    return (
      <div style={{ padding: '24px', backgroundColor: colorVars.surfaceBase, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ borderBottom: `1px solid ${colorVars.borderDefault}`, display: 'inline-flex' }}>
          <loom-tab-item ref={handleRef} value="tab1" label="Haz clic aquí" />
        </div>
        <div style={{
          fontFamily: 'monospace', fontSize: '12px', minHeight: '60px',
          color: colorVars.textSecondary, borderTop: `1px solid ${colorVars.borderDefault}`,
          paddingTop: '16px',
        }}>
          {log.length === 0
            ? <span style={{ opacity: 0.5 }}>Sin eventos — haz clic en la pestaña</span>
            : log.map((entry, i) => <div key={i}>{entry}</div>)
          }
        </div>
      </div>
    );
  },
};

export const WebComponent: StoryObj<TabItemStoryArgs> = {
  tags: ['test'],
  name: 'Web Component (loom-tab-item)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element. Incluye pruebas automáticas (\`play\`) que validan:
shadow DOM, partes, atributos booleanos, rol ARIA, emisión del evento, guard de disabled
y visibilidad del slot de ícono vía \`show-icon\`.

CSS hooks: \`::part(root)\`, \`::part(label)\`, \`::part(icon-slot)\`.
        `.trim(),
      },
    },
  },
  args: {
    label: 'Web Component',
    value: 'wc-test',
    active: false,
    disabled: false,
    showIcon: false,
  },
  render: (args) => (
    <div style={{ padding: '24px', backgroundColor: colorVars.surfaceBase }}>
      <div style={{ borderBottom: `1px solid ${colorVars.borderDefault}`, display: 'inline-flex' }}>
        <loom-tab-item
          value={args.value}
          label={args.label}
          {...(args.active    ? { active: '' }     : {})}
          {...(args.disabled  ? { disabled: '' }   : {})}
          {...(args.showIcon  ? { 'show-icon': '' } : {})}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-tab-item');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-tab-item in canvas.');

    await expect(host.shadowRoot).toBeTruthy();
    const shadow = host.shadowRoot!;

    // Required parts must exist
    await expect(shadow.querySelector('[part="root"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="label"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="icon-slot"]')).toBeTruthy();

    // Label content
    const labelEl = shadow.querySelector('[part="label"]');
    await expect(labelEl!.textContent).toBe('Web Component');

    // Icon slot hidden by default
    const iconSlotEl = shadow.querySelector('[part="icon-slot"]') as HTMLElement;
    await expect(iconSlotEl.hidden).toBe(true);

    // show-icon makes it visible
    host.setAttribute('show-icon', '');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(iconSlotEl.hidden).toBe(false);

    // Remove show-icon → hidden again
    host.removeAttribute('show-icon');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(iconSlotEl.hidden).toBe(true);

    // role="tab" on the root div
    const rootEl = shadow.querySelector('[part="root"]') as HTMLElement;
    await expect(rootEl.getAttribute('role')).toBe('tab');
    await expect(rootEl.getAttribute('aria-selected')).toBe('false');
    await expect(rootEl.getAttribute('tabindex')).toBe('0');

    // Toggle active — aria-selected must update
    host.setAttribute('active', '');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(rootEl.getAttribute('aria-selected')).toBe('true');

    // Event emission
    let emitted = false;
    host.addEventListener('loom-tab-item-select', () => { emitted = true; });
    rootEl.click();
    await expect(emitted).toBe(true);

    // Restore + disabled guard
    host.removeAttribute('active');
    host.setAttribute('disabled', '');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(rootEl.getAttribute('aria-disabled')).toBe('true');
    await expect(rootEl.getAttribute('tabindex')).toBe('-1');

    // Disabled tabs must not emit
    emitted = false;
    rootEl.click();
    await expect(emitted).toBe(false);
  },
};
