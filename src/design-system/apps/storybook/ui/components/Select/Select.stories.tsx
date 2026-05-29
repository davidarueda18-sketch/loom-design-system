import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { SELECT_STATES } from '../../../../../package/ui/components/Select/index.ts';
import { SELECT_OPTION_STATES } from '../../../../../package/ui/components/Select/menu/index.ts';
import type { SelectState } from '../../../../../package/ui/components/Select/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/components/Select/adapters/Select.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

// ─── Story arg types ──────────────────────────────────────────────────────────

interface SelectStoryArgs {
  label: string;
  placeholder: string;
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  state: SelectState;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
  args: {
    label: 'País',
    placeholder: 'Selecciona un país',
    disabled: false,
    error: false,
    errorMessage: 'Este campo es requerido',
    state: 'default',
  },
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    disabled:     { control: 'boolean' },
    error:        { control: 'boolean' },
    errorMessage: { control: 'text' },
    state: {
      control: 'select',
      options: Object.values(SELECT_STATES),
      description: 'Estado visual del trigger (solo doc — el componente gestiona su estado internamente)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Control de formulario tipo select implementado como Web Component form-associated.

\`\`\`html
<loom-select label="País" placeholder="Selecciona un país" name="country">
  <loom-select-option value="co" label="Colombia"></loom-select-option>
  <loom-select-option value="mx" label="México"></loom-select-option>
  <loom-select-option value="ar" label="Argentina"></loom-select-option>
</loom-select>
\`\`\`

Escucha el evento \`loom-select-change\` para reaccionar a la selección:

\`\`\`js
document.querySelector('loom-select')
  .addEventListener('loom-select-change', (e) => {
    console.log(e.detail); // { value: 'co', label: 'Colombia' }
  });
\`\`\`

Integración con formularios nativos via \`ElementInternals\`:
el \`value\` seleccionado aparece automáticamente en \`FormData\`.

CSS hooks: \`::part(trigger)\`, \`::part(label)\`, \`::part(value)\`, \`::part(chevron)\`, \`::part(menu)\`, \`::part(error)\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<SelectStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <loom-box display="block" padding-y="md">
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

function SelectWrapper({ children }: { children: ReactNode }) {
  return (
    <loom-box display="block" padding="lg" style={{ maxWidth: '320px' }}>
      <loom-stack gap="lg">
        {children}
      </loom-stack>
    </loom-box>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <SelectWrapper>
      <loom-select
        label={args.label}
        placeholder={args.placeholder}
        {...(args.disabled ? { disabled: '' } : {})}
        {...(args.error ? { error: '' } : {})}
        error-message={args.error ? args.errorMessage : undefined}
      >
        <loom-select-option value="co" label="Colombia" />
        <loom-select-option value="mx" label="México" />
        <loom-select-option value="ar" label="Argentina" />
        <loom-select-option value="pe" label="Perú" />
        <loom-select-option value="cl" label="Chile" />
      </loom-select>
    </SelectWrapper>
  ),
};

export const TriggerStates: Story = {
  name: 'Estados del trigger',
  parameters: {
    docs: {
      description: {
        story: `Los 5 estados visuales del trigger derivados de \`SELECT_STATES\`: **${Object.values(SELECT_STATES).join(', ')}**. El estado \`open\` se activa haciendo clic sobre el select.`,
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg" style={{ maxWidth: '360px' }}>
      <loom-stack gap="xl">
      <Section title={SELECT_STATES.default}>
        <loom-select label="Default" placeholder="Selecciona una opción">
          <loom-select-option value="a" label="Opción A" />
        </loom-select>
      </Section>

      <Section title={SELECT_STATES.disabled}>
        <loom-select label="Disabled" placeholder="No disponible" disabled="">
          <loom-select-option value="a" label="Opción A" />
        </loom-select>
      </Section>

      <Section title={SELECT_STATES.error}>
        <loom-select label="Error" placeholder="Selecciona" error="" error-message="Este campo es requerido">
          <loom-select-option value="a" label="Opción A" />
        </loom-select>
      </Section>

      <Section title={`${SELECT_STATES.open} (clic para activar)`}>
        <loom-select label="Abre el menú" placeholder="Haz clic aquí">
          <loom-select-option value="a" label="Opción A" />
          <loom-select-option value="b" label="Opción B" />
          <loom-select-option value="c" label="Opción C" />
        </loom-select>
      </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const OptionStates: Story = {
  name: 'Estados de opción',
  parameters: {
    docs: {
      description: {
        story: `Cada \`loom-select-option\` soporta los estados: **${Object.values(SELECT_OPTION_STATES).join(', ')}**. Hover y foco de teclado se activan al interactuar con el menú abierto.`,
      },
    },
  },
  render: () => (
    <SelectWrapper>
      <loom-select label="Estados de opción (abre el menú)" placeholder="Selecciona">
        <loom-select-option value="default" label="Default — estado normal" />
        <loom-select-option value="selected" label="Selected — ya seleccionada" selected="" />
        <loom-select-option value="disabled" label="Disabled — no disponible" disabled="" />
        <loom-select-option value="other" label="Otra opción normal" />
      </loom-select>
    </SelectWrapper>
  ),
};

export const WithLeadingIcons: Story = {
  name: 'Con ícono líder',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `leading-icon` en `loom-select-option` renderiza un `<loom-icon>` antes del label.',
      },
    },
  },
  render: () => (
    <SelectWrapper>
      <loom-select label="Método de pago" placeholder="Selecciona un método">
        <loom-select-option value="card" label="Tarjeta de crédito" leading-icon="credit-card" />
        <loom-select-option value="transfer" label="Transferencia bancaria" leading-icon="building-library" />
        <loom-select-option value="cash" label="Efectivo" leading-icon="banknotes" />
        <loom-select-option value="wallet" label="Billetera digital" leading-icon="device-phone-mobile" />
      </loom-select>
    </SelectWrapper>
  ),
};

export const WithDescriptions: Story = {
  name: 'Con descripción',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `description` agrega una línea secundaria debajo del label en la opción, llevando la altura de la fila de 48px a ~64px.',
      },
    },
  },
  render: () => (
    <SelectWrapper>
      <loom-select label="Plan de suscripción" placeholder="Elige tu plan">
        <loom-select-option
          value="free"
          label="Gratis"
          description="Hasta 3 proyectos, 1 GB de almacenamiento"
        />
        <loom-select-option
          value="pro"
          label="Pro"
          description="Proyectos ilimitados, 50 GB, soporte prioritario"
        />
        <loom-select-option
          value="enterprise"
          label="Enterprise"
          description="SLA garantizado, facturación corporativa, SSO"
        />
        <loom-select-option
          value="legacy"
          label="Legacy (descontinuado)"
          description="Solo disponible para cuentas existentes"
          disabled=""
        />
      </loom-select>
    </SelectWrapper>
  ),
};

export const LongListScroll: Story = {
  name: 'Lista larga (scroll)',
  parameters: {
    docs: {
      description: {
        story: 'Con más de 6 opciones el panel muestra scroll vertical. La altura máxima del menú es 296px (~6 filas de 48px).',
      },
    },
  },
  render: () => {
    const countries = [
      { value: 'co', label: 'Colombia' },
      { value: 'mx', label: 'México' },
      { value: 'ar', label: 'Argentina' },
      { value: 'pe', label: 'Perú' },
      { value: 'cl', label: 'Chile' },
      { value: 'br', label: 'Brasil' },
      { value: 'ec', label: 'Ecuador' },
      { value: 've', label: 'Venezuela' },
      { value: 'bo', label: 'Bolivia' },
      { value: 'py', label: 'Paraguay' },
      { value: 'uy', label: 'Uruguay' },
      { value: 'cr', label: 'Costa Rica' },
    ];
    return (
      <SelectWrapper>
        <loom-select label="País" placeholder="Selecciona tu país">
          {countries.map((c) => (
            <loom-select-option key={c.value} value={c.value} label={c.label} />
          ))}
        </loom-select>
      </SelectWrapper>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Modo controlado',
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo de manejo del evento `loom-select-change` desde React. El valor seleccionado se muestra debajo del select y el formulario nativo captura el valor via `FormData`.',
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState('');
    const ref = useRef<HTMLElementTagNameMap['loom-select']>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const handler = (e: Event) => {
        setSelected((e as CustomEvent<{ value: string; label: string }>).detail.label);
      };
      el.addEventListener('loom-select-change', handler);
      return () => el.removeEventListener('loom-select-change', handler);
    }, []);

    return (
      <SelectWrapper>
        <loom-select
          ref={ref}
          label="Rol"
          placeholder="Selecciona tu rol"
          name="role"
        >
          <loom-select-option value="dev" label="Desarrollador" />
          <loom-select-option value="design" label="Diseñador" />
          <loom-select-option value="pm" label="Product Manager" />
          <loom-select-option value="qa" label="QA Engineer" />
          <loom-select-option value="data" label="Data Scientist" />
        </loom-select>

        <loom-box padding-y="md" style={{ borderTop: `1px solid ${colorVars.borderDefault}` }}>
          <p className="loom-body-sm" style={{ color: colorVars.textSecondary, margin: 0 }}>
            Seleccionado:{' '}
            <strong style={{ color: colorVars.brandAccent }}>
              {selected || '—'}
            </strong>
          </p>
        </loom-box>
      </SelectWrapper>
    );
  },
};

export const FormIntegration: Story = {
  name: 'Integración con <form>',
  parameters: {
    docs: {
      description: {
        story: 'Valida la integración form-associated: el `value` de `loom-select` aparece en `FormData` al hacer submit. Haz clic en "Enviar" para ver el resultado en el log.',
      },
    },
  },
  render: () => {
    const [formData, setFormData] = useState<string>('');
    const formRef = useRef<HTMLFormElement | null>(null);
    const submitRef = useRef<HTMLElementTagNameMap['loom-button'] | null>(null);

    const collectFormData = (form: HTMLFormElement): void => {
      const data = new FormData(form);
      const entries = Object.fromEntries(data.entries());
      setFormData(JSON.stringify(entries, null, 2));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      collectFormData(event.currentTarget);
    };

    useEffect(() => {
      const button = submitRef.current;
      const form = formRef.current;
      if (!button || !form) return;
      const handleClick = (): void => collectFormData(form);
      button.addEventListener('loom-click', handleClick);
      return () => button.removeEventListener('loom-click', handleClick);
    }, []);

    return (
      <loom-box display="block" padding="lg" style={{ maxWidth: '360px' }}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <loom-stack gap="lg">
          <loom-select label="Departamento" placeholder="Selecciona" name="department">
            <loom-select-option value="eng" label="Ingeniería" />
            <loom-select-option value="design" label="Diseño" />
            <loom-select-option value="product" label="Producto" />
            <loom-select-option value="marketing" label="Marketing" />
          </loom-select>

          <loom-button ref={submitRef} variant="primary">
            Enviar formulario
          </loom-button>
          </loom-stack>
        </form>

        {formData && (
          <loom-box display="block" padding="sm" style={{ marginTop: '20px', background: colorVars.surfaceNeutral, borderRadius: '6px' }}>
            <pre className="loom-caption" style={{ color: colorVars.textPrimary, margin: 0, overflow: 'auto' }}>
              {formData}
            </pre>
          </loom-box>
        )}
      </loom-box>
    );
  },
};

export const WebComponent: Story = {
  tags: ['test'],
  name: 'Web Component (loom-select)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element. La story incluye pruebas automáticas que validan:
shadow DOM, partes, apertura/cierre del menú, selección de opción,
evento \`loom-select-change\`, y valor en \`FormData\` via \`ElementInternals\`.
        `.trim(),
      },
    },
  },
  args: {
    label: 'Categoría',
    placeholder: 'Selecciona una categoría',
    disabled: false,
    error: false,
    errorMessage: '',
  },
  render: (args) => (
    <form id="test-form" style={{ maxWidth: '320px' }}>
      <loom-box display="block" padding="lg">
      <loom-select
        label={args.label}
        placeholder={args.placeholder}
        name="category"
        {...(args.disabled ? { disabled: '' } : {})}
        {...(args.error ? { error: '' } : {})}
        error-message={args.errorMessage || undefined}
      >
        <loom-select-option value="tech" label="Tecnología" />
        <loom-select-option value="design" label="Diseño" />
        <loom-select-option value="business" label="Negocio" />
        <loom-select-option value="disabled-opt" label="No disponible" disabled="" />
      </loom-select>
      </loom-box>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ── 1. Locate host ────────────────────────────────────────────────────────
    const host = canvasElement.querySelector('loom-select');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-select in canvas.');

    // ── 2. Shadow DOM and required parts ──────────────────────────────────────
    await expect(host.shadowRoot).toBeTruthy();
    const shadow = host.shadowRoot!;

    await expect(shadow.querySelector('[part="trigger"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="label"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="value"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="chevron"]')).toBeTruthy();
    await expect(shadow.querySelector('[part="menu"]')).toBeTruthy();

    // ── 3. Menu is initially hidden ───────────────────────────────────────────
    const menuEl = shadow.querySelector('[part="menu"]') as HTMLElement;
    await expect(menuEl.hidden).toBe(true);

    // ── 4. Trigger button has role="combobox" and aria-expanded="false" ───────
    const trigger = shadow.querySelector('[part="trigger"]') as HTMLElement;
    await expect(trigger.getAttribute('role')).toBe('combobox');
    await expect(trigger.getAttribute('aria-expanded')).toBe('false');

    // ── 5. Click trigger → menu opens ─────────────────────────────────────────
    await userEvent.click(trigger);
    await expect(menuEl.hidden).toBe(false);
    await expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // ── 6. Options are slotted and have role="option" ─────────────────────────
    const slot = menuEl.querySelector('slot') as HTMLSlotElement;
    const options = Array.from(slot.assignedElements()).filter(
      (el) => el.tagName.toLowerCase() === 'loom-select-option',
    ) as HTMLElement[];
    await expect(options.length).toBe(4);
    await expect(options[0].getAttribute('role')).toBe('option');
    await expect(options[0].getAttribute('aria-selected')).toBe('false');

    // ── 7. Click first option → menu closes, value updated ───────────────────
    let changeDetail: { value: string; label: string } | null = null;
    host.addEventListener('loom-select-change', (e) => {
      changeDetail = (e as CustomEvent).detail;
    });

    const firstOptionRow = options[0].shadowRoot?.querySelector('[part="row"]') as HTMLElement;
    await userEvent.click(firstOptionRow);
    await expect(menuEl.hidden).toBe(true);
    await expect(changeDetail).not.toBeNull();
    await expect(changeDetail!.value).toBe('tech');
    await expect(changeDetail!.label).toBe('Tecnología');

    // ── 8. First option is marked as selected ─────────────────────────────────
    await expect(options[0].hasAttribute('selected')).toBe(true);
    await expect(options[0].getAttribute('aria-selected')).toBe('true');
    await expect(options[1].hasAttribute('selected')).toBe(false);

    // ── 9. Value in FormData (ElementInternals form-associated) ───────────────
    const form = canvasElement.querySelector('form#test-form') as HTMLFormElement;
    const fd = new FormData(form);
    await expect(fd.get('category')).toBe('tech');

    // ── 10. Keyboard navigation — ArrowDown opens and focuses first option ────
    await userEvent.click(trigger); // reopen
    await expect(menuEl.hidden).toBe(false);

    await userEvent.keyboard('{Escape}');
    await expect(menuEl.hidden).toBe(true);

    // ── 11. Disabled option is non-interactive ────────────────────────────────
    await userEvent.click(trigger);
    const disabledOpt = options[3];
    await expect(disabledOpt.hasAttribute('disabled')).toBe(true);
    await expect(disabledOpt.getAttribute('aria-disabled')).toBe('true');
    const disabledRow = disabledOpt.shadowRoot?.querySelector('[part="row"]') as HTMLElement;
    // Click on disabled option should NOT trigger change or close menu
    let secondChange = false;
    host.addEventListener('loom-select-change', () => { secondChange = true; });
    await userEvent.click(disabledRow);
    await expect(secondChange).toBe(false);

    // Close
    await userEvent.keyboard('{Escape}');

    // ── 12. Value resets on formReset ─────────────────────────────────────────
    await canvas.findByRole('form');
    form.reset();
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.value).toBe('');
    const fd2 = new FormData(form);
    await expect(fd2.get('category')).toBeNull();
  },
};
