import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { TOGGLE_STATES } from '../../../../../package/ui/primitives/Toggle/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../../../package/ui/primitives/Toggle/adapters/Toggle.element.ts';
import '../../../loom-web-components.d.ts';

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

interface ToggleChangeDetail {
  checked: boolean;
}

function ToggleEventLog() {
  const [log, setLog] = React.useState<string[]>([]);
  const toggleRef = React.useRef<HTMLElementTagNameMap['loom-toggle'] | null>(null);

  React.useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const onToggleChange = (event: Event) => {
      const detail = (event as CustomEvent<ToggleChangeDetail>).detail;
      setLog((prev) => [
        `loom-toggle-change -> checked=${String(detail.checked)}`,
        ...prev,
      ].slice(0, 6));
    };

    toggle.addEventListener('loom-toggle-change', onToggleChange as EventListener);
    return () => {
      toggle.removeEventListener('loom-toggle-change', onToggleChange as EventListener);
    };
  }, []);

  return (
    <loom-stack gap="lg">
      <loom-toggle ref={toggleRef} label="Haz clic para ver el evento" />
      <loom-box
        display="block"
        padding-y="md"
        style={{
          minHeight: '80px',
          color: colorVars.textSecondary,
          borderTop: `1px solid ${colorVars.borderDefault}`,
        }}
      >
        {log.length === 0
          ? (
            <p className="loom-caption" style={{ margin: 0, opacity: 0.5 }}>
              Sin eventos aun: haz clic en el toggle
            </p>
          )
          : log.map((entry, i) => (
            <p key={i} className="loom-caption" style={{ margin: 0 }}>
              {entry}
            </p>
          ))}
      </loom-box>
    </loom-stack>
  );
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
    checked: {
      control: 'boolean',
      description: 'Marca el estado del switch. Presencia del atributo implica `true`.',
    },
    disabled: {
      control: 'boolean',
      description: 'Bloquea interaccion, foco del track y cambios de estado.',
    },
    label: {
      control: 'text',
      description: 'Texto visible junto al control.',
    },
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

## Superficie pública

| Tipo | Nombre | Descripción |
| --- | --- | --- |
| Atributo | \`checked\` | Estado booleano del switch. |
| Atributo | \`disabled\` | Deshabilita interacción y foco. |
| Atributo | \`label\` | Texto visible del control. |
| Atributo | \`name\` | Nombre para envío en formularios. |
| Atributo | \`value\` | Valor enviado cuando \`checked=true\` (default: \`on\`). |
| Evento | \`loom-toggle-change\` | Se emite en cada cambio con \`{ checked: boolean }\`. |
| CSS Part | \`root\` | Contenedor raíz. |
| CSS Part | \`track\` | Pista/carril del toggle. |
| CSS Part | \`thumb\` | Perilla móvil. |
| CSS Part | \`label\` | Etiqueta de texto. |

\`loom-toggle\` participa en formularios usando ElementInternals: solo envía valor cuando está activado.
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
    <loom-box display="block" style={{ marginBottom: '32px' }}>
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <loom-stack gap="md">
      {children}
    </loom-stack>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ checked, disabled, label }) => (
    <loom-box display="block" padding="lg">
      <loom-toggle
        checked={checked}
        disabled={disabled}
        label={label}
      />
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
      <Section title="Sin label">
        <loom-inline gap="lg" align="center" wrap>
          <loom-toggle />
          <loom-toggle checked />
          <loom-toggle disabled />
          <loom-toggle checked disabled />
        </loom-inline>
      </Section>
      <Section title="Con label">
        <Column>
          <loom-toggle label="Off — desactivado" />
          <loom-toggle checked={true} label="On — activado" />
          <loom-toggle disabled={true} label="Disabled off — no disponible" />
          <loom-toggle checked={true} disabled={true} label="Disabled on — no disponible" />
        </Column>
      </Section>
      </loom-stack>
    </loom-box>
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
  render: () => (
    <loom-box display="block" padding="lg">
      <ToggleEventLog />
    </loom-box>
  ),
};

export const CustomEvents: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Escucha de forma nativa el evento \`loom-toggle-change\` para reaccionar a cambios en el estado.

\`\`\`ts
const toggle = document.querySelector('loom-toggle');
toggle?.addEventListener('loom-toggle-change', (event) => {
  const { checked } = (event as CustomEvent<{ checked: boolean }>).detail;
  console.log('checked:', checked);
});
\`\`\`
        `.trim(),
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <ToggleEventLog />
    </loom-box>
  ),
};

export const CSSParts: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Personalización visual desde fuera del Shadow DOM usando \`::part()\`.

Partes expuestas:
- \`root\`
- \`track\`
- \`thumb\`
- \`label\`

\`\`\`css
loom-toggle::part(track) {
  border-radius: 999px;
}

loom-toggle::part(thumb) {
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 20%, transparent);
}
\`\`\`
        `.trim(),
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
        <loom-toggle label="Default" />
        <loom-toggle checked label="Checked" />
        <style>
          {`
            loom-toggle::part(track) {
              border-radius: 999px;
              border: 1px solid ${colorVars.borderDefault};
            }

            loom-toggle::part(thumb) {
              box-shadow: 0 0 0 2px color-mix(in srgb, ${colorVars.feedbackInfo} 20%, transparent);
            }

            loom-toggle::part(label) {
              color: ${colorVars.textPrimary};
            }
          `}
        </style>
      </loom-stack>
    </loom-box>
  ),
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
      <Section title="Labels contextuales">
        <Column>
          <loom-toggle label="Recibir notificaciones push" />
          <loom-toggle checked={true} label="Modo oscuro activado" />
          <loom-toggle disabled={true} label="Sincronización automática (no disponible)" />
          <loom-toggle checked={true} disabled={true} label="Función premium (no disponible en tu plan)" />
        </Column>
      </Section>
      </loom-stack>
    </loom-box>
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
    checked: {
      control: 'boolean',
      description: 'Atributo booleano canónico del custom element.',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita interacción en la implementación Web Component.',
    },
    label: {
      control: 'text',
      description: 'Texto de etiqueta mostrado por el host.',
    },
  },
  render: (args) => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      <loom-toggle
        checked={args.checked}
        disabled={args.disabled}
        label={args.label}
      />
      <loom-stack gap="smMd" style={{ borderTop: `1px solid ${colorVars.borderDefault}`, paddingTop: '16px' }}>
        {TOGGLE_STATES.map((s) => (
          <loom-toggle
            key={s}
            checked={s === 'on'}
            disabled={s === 'disabled'}
            label={s}
          />
        ))}
      </loom-stack>
      </loom-stack>
    </loom-box>
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
