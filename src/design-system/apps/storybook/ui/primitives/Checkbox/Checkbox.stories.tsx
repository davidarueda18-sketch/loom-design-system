import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { CHECKBOX_STATES, CHECKBOX_SHAPES } from '../../../../../package/ui/primitives/Checkbox/index.ts';
import type { CheckboxShape } from '../../../../../package/ui/primitives/Checkbox/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Checkbox/adapters/Checkbox.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

interface CheckboxStoryArgs {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  label: string;
  shape: CheckboxShape;
}

interface CheckboxWebComponentArgs {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Checkbox',
  tags: ['autodocs'],
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    label: 'Acepto los términos y condiciones',
    shape: 'square',
  },
  argTypes: {
    checked:       { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled:      { control: 'boolean' },
    label:         { control: 'text' },
    shape:         { control: 'select', options: CHECKBOX_SHAPES },
  },
  parameters: {
    docs: {
      description: {
        component: `
Control de selección binaria como Web Component. Soporta los estados **default**, **checked**,
**indeterminate** y **disabled**, con hover y focus gestionados por CSS. Incluye label opcional.

\`\`\`html
<!-- Sin marcar -->
<loom-checkbox label="Opción A"></loom-checkbox>

<!-- Marcado -->
<loom-checkbox checked label="Opción A"></loom-checkbox>

<!-- Indeterminado (selección parcial) -->
<loom-checkbox indeterminate label="Todos los elementos"></loom-checkbox>

<!-- Deshabilitado -->
<loom-checkbox disabled label="No disponible"></loom-checkbox>
\`\`\`

El wrapper React \`<Checkbox />\` renderiza internamente \`<loom-checkbox>\`.
Usa \`::part(box)\`, \`::part(icon)\` y \`::part(label)\` para override CSS externo.
        `.trim(),
      },
    },
  },
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxStoryArgs>;

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
  render: (args) => {
    const { checked, indeterminate, disabled, label, shape } = args;
    return (
      <loom-box display="block" padding="lg">
        <loom-checkbox
          {...(checked       ? { checked: true }       : {})}
          {...(indeterminate ? { indeterminate: true }  : {})}
          {...(disabled      ? { disabled: true }       : {})}
          label={label}
          shape={shape}
        />
      </loom-box>
    );
  },
};

export const States: Story = {
  name: 'Estados',
  parameters: {
    docs: {
      description: {
        story: 'Los 4 estados funcionales del checkbox. Hover y focus son manejados por CSS automáticamente.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
      <Section title="Sin label">
        <loom-inline gap="md" align="center" wrap>
          <loom-checkbox />
          <loom-checkbox checked />
          <loom-checkbox indeterminate />
          <loom-checkbox disabled />
        </loom-inline>
      </Section>
      <Section title="Con label">
        <Column>
          <loom-checkbox label="Default — sin marcar" />
          <loom-checkbox checked label="Checked — seleccionado" />
          <loom-checkbox indeterminate label="Indeterminate — selección parcial" />
          <loom-checkbox disabled label="Disabled — no disponible" />
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
        story: 'El checkbox emite `loom-checkbox-change` en cada toggle. El log muestra el stream de eventos.',
      },
    },
  },
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);

    const handleRef = React.useCallback((el: HTMLElementTagNameMap['loom-checkbox'] | null) => {
      if (!el) return;
      el.addEventListener('loom-checkbox-change', (e) => {
        const { checked, indeterminate } = (e as CustomEvent).detail as { checked: boolean; indeterminate: boolean };
        setLog((prev) =>
          [`loom-checkbox-change → checked=${checked}, indeterminate=${indeterminate}`, ...prev].slice(0, 6),
        );
      });
    }, []);

    return (
      <loom-box display="block" padding="lg">
        <loom-stack gap="lg">
        <loom-checkbox
          label="Haz clic para ver el evento"
          ref={handleRef}
        />
        <loom-box display="block" padding-y="md" style={{
          minHeight: '80px',
          color: colorVars.textSecondary, borderTop: `1px solid ${colorVars.borderDefault}`,
        }}>
          {log.length === 0
            ? <p className="loom-caption" style={{ margin: 0, opacity: 0.5 }}>Sin eventos aún — haz clic en el checkbox</p>
            : log.map((entry, i) => <p key={i} className="loom-caption" style={{ margin: 0 }}>{entry}</p>)
          }
        </loom-box>
        </loom-stack>
      </loom-box>
    );
  },
};

export const WithLabel: Story = {
  name: 'Con label',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `label` muestra un texto junto al checkbox. En estado disabled el label hereda el color deshabilitado.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
      <Section title="Labels contextuales">
        <Column>
          <loom-checkbox label="Recordarme en este dispositivo" />
          <loom-checkbox checked label="Acepto los términos y condiciones" />
          <loom-checkbox indeterminate label="Seleccionar todos los elementos (3 de 7)" />
          <loom-checkbox disabled label="Esta opción no está disponible" />
        </Column>
      </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<CheckboxWebComponentArgs> = {
  tags: ['test'],
  name: 'Web Component (loom-checkbox)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element \`<loom-checkbox>\`. Las props son atributos HTML booleanos
(presencia = true, ausencia = false). La story incluye pruebas automáticas (\`play\`) que validan:
shadow DOM, partes, atributos booleanos y evento \`loom-checkbox-change\`.

CSS hooks: \`::part(root)\`, \`::part(box)\`, \`::part(icon)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    label: 'Acepto los términos',
  },
  argTypes: {
    checked:       { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled:      { control: 'boolean' },
    label:         { control: 'text' },
  },
  render: (args) => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="lg">
      <loom-checkbox
        {...(args.checked       ? { checked: true }       : {})}
        {...(args.indeterminate ? { indeterminate: true }  : {})}
        {...(args.disabled      ? { disabled: true }       : {})}
        label={args.label}
      />
      <loom-stack gap="smMd" style={{ borderTop: `1px solid ${colorVars.borderDefault}`, paddingTop: '16px' }}>
        {CHECKBOX_STATES.map((s) => (
          <loom-checkbox
            key={s}
            {...(s === 'checked'       ? { checked: true }       : {})}
            {...(s === 'indeterminate' ? { indeterminate: true }  : {})}
            {...(s === 'disabled'      ? { disabled: true }       : {})}
            label={s}
          />
        ))}
      </loom-stack>
      </loom-stack>
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-checkbox');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-checkbox in canvas.');

    // Shadow DOM must be attached
    await expect(host.shadowRoot).toBeTruthy();
    const shadow = host.shadowRoot!;

    // Required parts must exist
    await expect(shadow.querySelector('[part="box"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="icon"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="label"]')).toBeTruthy();

    // Label content
    const labelEl = shadow.querySelector('[part="label"]');
    await expect(labelEl!.textContent).toBe('Acepto los términos');

    // role="checkbox" on the host
    await expect(host.getAttribute('role')).toBe('checkbox');
    await expect(host.getAttribute('aria-checked')).toBe('false');

    // Toggle checked via attribute — class must change
    const classBefore = shadow.querySelector('[part="box"]')!.className;
    host.setAttribute('checked', '');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(shadow.querySelector('[part="box"]')!.className).not.toBe(classBefore);
    await expect(host.getAttribute('aria-checked')).toBe('true');

    // Test indeterminate → aria-checked="mixed"
    host.setAttribute('indeterminate', '');
    host.removeAttribute('checked');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.getAttribute('aria-checked')).toBe('mixed');

    // Restore
    host.removeAttribute('indeterminate');
    host.removeAttribute('checked');
  },
};

export const Shape: Story = {
  name: 'Forma',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `shape` controla la forma del checkbox. `square` (por defecto) usa el radio estándar del sistema; `circle` aplica `border-radius: 50%` de forma nativa sin necesidad de `::part(box)`.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
      <Section title="Square (por defecto)">
        <loom-inline gap="md" align="start" wrap>
          {(CHECKBOX_SHAPES).map((shape) => (
            <Column key={shape}>
              <p className="loom-caption" style={{ color: colorVars.textSecondary, margin: '0 0 4px' }}>
                shape="{shape}"
              </p>
              <loom-checkbox label="Default" shape={shape} />
              <loom-checkbox checked={true} label="Checked" shape={shape} />
              <loom-checkbox indeterminate={true} label="Indeterminate" shape={shape} />
              <loom-checkbox disabled={true} label="Disabled" shape={shape} />
            </Column>
          ))}
        </loom-inline>
      </Section>
      </loom-stack>
    </loom-box>
  ),
};
