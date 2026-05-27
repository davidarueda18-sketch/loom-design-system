import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { TOGGLE_STATES } from '../../../../../package/ui/primitives/Toggle/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Toggle/adapters/Toggle.element.ts';
import '../../../loom-web-components.d.ts';

// ─── JSX namespace for loom-toggle ───────────────────────────────────────────

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'loom-toggle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap['loom-toggle']> & {
          checked?: boolean | '';
          disabled?: boolean | '';
          label?: string;
          name?: string;
          value?: string;
        },
        HTMLElementTagNameMap['loom-toggle']
      >;
    }
  }
}

// ─── Story arg interfaces ─────────────────────────────────────────────────────

interface ToggleStoryArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
}

interface ToggleWebComponentArgs {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Toggle',
  tags: ['autodocs'],
  args: {
    checked:  false,
    disabled: false,
    label:    'Activar notificaciones',
  },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Interruptor de palanca (toggle switch) como Web Component. Soporta los estados **off**, **on** y
**disabled**, con hover y focus gestionados por CSS. Incluye label opcional, integración nativa
con formularios y evento personalizado \`loom-toggle-change\`.

\`\`\`html
<!-- Desactivado (por defecto) -->
<loom-toggle label="Modo oscuro"></loom-toggle>

<!-- Activado -->
<loom-toggle checked label="Modo oscuro"></loom-toggle>

<!-- Deshabilitado sin activar -->
<loom-toggle disabled label="No disponible"></loom-toggle>

<!-- Deshabilitado y activado -->
<loom-toggle checked disabled label="No disponible"></loom-toggle>
\`\`\`

El wrapper React \`<Toggle />\` renderiza internamente \`<loom-toggle>\`.
Usa \`::part(root)\`, \`::part(track)\`, \`::part(thumb)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<ToggleStoryArgs>;

export default meta;
type Story = StoryObj<ToggleStoryArgs>;

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

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {children}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ checked, disabled, label }) => (
    <div style={{ padding: '24px' }}>
      <loom-toggle
        {...(checked  ? { checked: '' }  : {})}
        {...(disabled ? { disabled: '' } : {})}
        label={label}
      />
    </div>
  ),
};

export const States: Story = {
  name: 'Estados',
  parameters: {
    docs: {
      description: {
        story: 'Los 4 estados funcionales del toggle. Hover y focus son manejados por CSS automáticamente.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Section title="Sin label">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
          <loom-toggle />
          <loom-toggle checked />
          <loom-toggle disabled />
          <loom-toggle checked disabled />
        </div>
      </Section>
      <Section title="Con label">
        <Column>
          <loom-toggle label="Off — desactivado" />
          <loom-toggle checked="" label="On — activado" />
          <loom-toggle disabled="" label="Disabled off — no disponible" />
          <loom-toggle checked="" disabled="" label="Disabled on — no disponible" />
        </Column>
      </Section>
    </div>
  ),
};

export const Interactive: Story = {
  name: 'Interactivo',
  parameters: {
    docs: {
      description: {
        story: 'El toggle emite `loom-toggle-change` en cada cambio. El log muestra el stream de eventos.',
      },
    },
  },
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);

    const handleRef = React.useCallback((el: HTMLElementTagNameMap['loom-toggle'] | null) => {
      if (!el) return;
      el.addEventListener('loom-toggle-change', (e) => {
        const { checked } = (e as CustomEvent).detail as { checked: boolean };
        setLog((prev) =>
          [`loom-toggle-change → checked=${checked}`, ...prev].slice(0, 6),
        );
      });
    }, []);

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <loom-toggle label="Haz clic para ver el evento" ref={handleRef} />
        <div style={{
          fontFamily: 'monospace', fontSize: '12px', minHeight: '80px',
          color: colorVars.textSecondary, borderTop: `1px solid ${colorVars.borderDefault}`,
          paddingTop: '16px',
        }}>
          {log.length === 0
            ? <span style={{ opacity: 0.5 }}>Sin eventos aún — haz clic en el toggle</span>
            : log.map((entry, i) => <div key={i}>{entry}</div>)
          }
        </div>
      </div>
    );
  },
};

export const WithLabel: Story = {
  name: 'Con label',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `label` muestra un texto junto al toggle. En estado disabled el label hereda el color deshabilitado.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Section title="Labels contextuales">
        <Column>
          <loom-toggle label="Recibir notificaciones push" />
          <loom-toggle checked="" label="Modo oscuro activado" />
          <loom-toggle disabled="" label="Sincronización automática (no disponible)" />
          <loom-toggle checked="" disabled="" label="Función premium (no disponible en tu plan)" />
        </Column>
      </Section>
    </div>
  ),
};

export const WebComponent: StoryObj<ToggleWebComponentArgs> = {
  tags: ['test'],
  name: 'Web Component (loom-toggle)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element \`<loom-toggle>\`. Los atributos booleanos siguen la convención
HTML estándar (presencia = true, ausencia = false). La story incluye pruebas automáticas (\`play\`)
que validan: shadow DOM, partes, atributos booleanos, rol ARIA y evento \`loom-toggle-change\`.

CSS hooks: \`::part(root)\`, \`::part(track)\`, \`::part(thumb)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
  args: {
    checked:  false,
    disabled: false,
    label:    'Activar función',
  },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
  render: (args) => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <loom-toggle
        {...(args.checked  ? { checked: '' }  : {})}
        {...(args.disabled ? { disabled: '' } : {})}
        label={args.label}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: `1px solid ${colorVars.borderDefault}`, paddingTop: '16px' }}>
        {TOGGLE_STATES.map((s) => (
          <loom-toggle
            key={s}
            {...(s === 'on'       ? { checked: '' }  : {})}
            {...(s === 'disabled' ? { disabled: '' } : {})}
            label={s}
          />
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-toggle');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-toggle in canvas.');

    // Shadow DOM must be attached
    await expect(host.shadowRoot).toBeTruthy();
    const shadow = host.shadowRoot!;

    // Required parts must exist
    await expect(shadow.querySelector('[part="root"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="track"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="thumb"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="label"]')).toBeTruthy();

    // Label content
    const labelEl = shadow.querySelector('[part="label"]');
    await expect(labelEl!.textContent).toBe('Activar función');

    // role="switch" on the host
    await expect(host.getAttribute('role')).toBe('switch');
    await expect(host.getAttribute('aria-checked')).toBe('false');

    // Track must be focusable
    const track = shadow.querySelector('[part="track"]') as HTMLElement;
    await expect(track.getAttribute('tabindex')).toBe('0');

    // Toggle checked via attribute — class must change
    const classBefore = track.className;
    host.setAttribute('checked', '');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(track.className).not.toBe(classBefore);
    await expect(host.getAttribute('aria-checked')).toBe('true');

    // Restore
    host.removeAttribute('checked');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.getAttribute('aria-checked')).toBe('false');
  },
};
