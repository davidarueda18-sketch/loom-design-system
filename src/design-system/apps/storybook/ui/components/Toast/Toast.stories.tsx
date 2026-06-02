import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { TOAST_TYPES, TOAST_POSITIONS } from '../../../../../package/ui/components/Toast/index.ts';
import type {
  ToastActionEventDetail,
  ToastDismissEventDetail,
  ToastPosition,
  ToastType,
} from '../../../../../package/ui/components/Toast/index.ts';
import type { LoomToast } from '../../../../../package/ui/components/Toast/adapters/Toast.element.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/components/Toast/adapters/Toast.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

interface ToastStoryArgs {
  type?: ToastType;
  title?: string;
  description?: string;
  dismissible?: boolean;
  'action-label'?: string;
  duration?: number;
  position?: ToastPosition;
}

const meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  args: {
    type: 'info',
    title: 'Notificación informativa',
    description: 'Revisa los cambios y contáctanos si tienes alguna pregunta.',
    dismissible: true,
    duration: 0,
  },
  argTypes: {
    type:        { control: 'select', options: TOAST_TYPES, description: 'Semantic variant controlling icon, accent, and live-region urgency.' },
    title:       { control: 'text', description: 'Primary message rendered in part="title".' },
    description: { control: 'text', description: 'Optional supporting text rendered in part="description".' },
    dismissible: { control: 'boolean', description: 'Shows or hides the dismiss button.' },
    'action-label': { control: 'text', description: 'Optional snackbar action label.' },
    duration:    { control: 'number', description: 'ms until auto-dismiss (0 = disabled)' },
    position:    { control: 'select', options: ['', ...TOAST_POSITIONS], description: 'Optional fixed viewport placement.' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Toast / Snackbar como Web Component. Muestra notificaciones transitorias con icono semántico,
título, descripción opcional, botón de acción y auto-dismiss configurable.

\`\`\`html
<!-- Compact (sin descripción) -->
<loom-toast type="success" title="Perfil actualizado" dismissible></loom-toast>

<!-- Expanded (con descripción) -->
<loom-toast
  type="error"
  title="Error al guardar"
  description="Por favor, inténtalo de nuevo o contacta con soporte."
  dismissible
></loom-toast>

<!-- Con acción (snackbar) -->
<loom-toast
  type="info"
  title="Archivo eliminado"
  action-label="Deshacer"
  duration="5000"
></loom-toast>

<!-- Auto-posicionado -->
<loom-toast
  type="warning"
  title="Sesión por expirar"
  position="top-right"
  duration="8000"
></loom-toast>
\`\`\`

| Surface | Name | Purpose |
|---|---|---|
| Attribute | type | Semantic variant: success, info, warning, error |
| Attribute | title | Primary message text |
| Attribute | description | Optional supporting message |
| Attribute | dismissible | Shows the close button unless set to false |
| Attribute | action-label | Optional snackbar action label |
| Attribute | duration | Auto-dismiss delay in milliseconds; 0 disables timer |
| Attribute | position | Optional fixed viewport placement |
| Attribute | aria-dismiss-label | Accessible label for the dismiss button |
| Part | icon | Semantic icon container |
| Part | content | Text content wrapper |
| Part | title | Primary message element |
| Part | description | Supporting message element |
| Part | dismiss | Dismiss button |
| Part | action | Action link |
| Event | loom-toast-action | Emitted before action-triggered dismissal with detail.label |
| Event | loom-toast-dismiss | Emitted after dismissal animation with detail.reason |

Dismiss reasons: \`user\`, \`timeout\`, \`action\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<ToastStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <loom-box display="block">
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

function ToastStack({ children }: { children: ReactNode }) {
  return (
    <loom-stack gap="smMd">
      {children}
    </loom-stack>
  );
}

interface AutoDismissToastItem {
  id: number;
  type: ToastType;
  title: string;
  description: string;
  duration: number;
}

function AutoDismissToast({
  item,
  onDismiss,
}: {
  item: AutoDismissToastItem;
  onDismiss: (id: number) => void;
}) {
  const ref = useRef<LoomToast>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => onDismiss(item.id);
    el.addEventListener('loom-toast-dismiss', handler);
    return () => el.removeEventListener('loom-toast-dismiss', handler);
  }, [item.id, onDismiss]);

  return (
    <loom-toast
      ref={ref}
      type={item.type}
      title={item.title}
      description={item.description}
      duration={item.duration}
      dismissible
    />
  );
}

function ToastEventLogExample() {
  const [key, setKey] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<LoomToast>(null);
  const resetRef = useRef<HTMLElementTagNameMap['loom-button'] | null>(null);

  useEffect(() => {
    const toast = ref.current;
    if (!toast) return undefined;

    const addEntry = (eventName: string, detail: unknown): void => {
      setLog((prev) => [`${eventName} ${JSON.stringify(detail)}`, ...prev].slice(0, 8));
    };
    const handleAction = (event: Event): void => {
      addEntry('loom-toast-action', (event as CustomEvent<ToastActionEventDetail>).detail);
    };
    const handleDismiss = (event: Event): void => {
      addEntry('loom-toast-dismiss', (event as CustomEvent<ToastDismissEventDetail>).detail);
    };

    toast.addEventListener('loom-toast-action', handleAction);
    toast.addEventListener('loom-toast-dismiss', handleDismiss);

    return () => {
      toast.removeEventListener('loom-toast-action', handleAction);
      toast.removeEventListener('loom-toast-dismiss', handleDismiss);
    };
  }, [key]);

  useEffect(() => {
    const button = resetRef.current;
    if (!button) return undefined;
    const handleReset = (): void => { setKey((prev) => prev + 1); };
    button.addEventListener('loom-click', handleReset);
    return () => button.removeEventListener('loom-click', handleReset);
  }, []);

  return (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
        <loom-toast
          key={key}
          ref={ref}
          type="info"
          title="Archivo eliminado"
          description="Usa la acción para restaurarlo o el cierre para descartarlo."
          action-label="Deshacer"
          dismissible
        />
        <loom-box display="block" padding="smMd" style={{
          minHeight: '88px',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          color: colorVars.textSecondary,
        }}>
          {log.length === 0
            ? <p className="loom-caption" style={{ margin: 0 }}>No events yet</p>
            : log.map((entry) => <p key={entry} className="loom-caption" style={{ margin: 0 }}>{entry}</p>)}
        </loom-box>
        <loom-button ref={resetRef} variant="outline" size="sm">
          Reset toast
        </loom-button>
      </loom-stack>
    </loom-box>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    position: 'top-right',
  },
  render: ({ type, title, description, dismissible, 'action-label': actionLabel, duration, position }) => (
    <loom-box display="block" padding="lg">
      <loom-toast
        type={type}
        title={title}
        description={description}
        dismissible={dismissible}
        action-label={actionLabel}
        duration={duration}
        position={position || undefined}
      />
    </loom-box>
  ),
};

export const Types: Story = {
  name: 'Tipos (type)',
  parameters: {
    docs: {
      description: {
        story: 'Los 4 tipos semánticos con sus iconos y colores correspondientes.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
        <Section title="Expanded — con descripción">
          <ToastStack>
            <loom-toast type="success" title="Toast de éxito"   description="Tu perfil se ha actualizado correctamente con la información más reciente." dismissible />
            <loom-toast type="info"    title="Toast informativo" description="Revisa los cambios y contáctanos si tienes alguna pregunta." dismissible />
            <loom-toast type="warning" title="Toast de advertencia" description="Estos podrían ser intentos de phishing o contener virus dañinos." dismissible />
            <loom-toast type="error"   title="Toast de error"   description="Por favor, inténtalo de nuevo o contacta con nuestro equipo de soporte." dismissible />
          </ToastStack>
        </Section>

        <Section title="Compact — solo título">
          <ToastStack>
            <loom-toast type="success" title="Toast de éxito"       dismissible />
            <loom-toast type="info"    title="Toast informativo"     dismissible />
            <loom-toast type="warning" title="Toast de advertencia"  dismissible />
            <loom-toast type="error"   title="Toast de error"        dismissible />
          </ToastStack>
        </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const WithAction: Story = {
  name: 'Con acción (snackbar)',
  parameters: {
    docs: {
      description: {
        story: 'Cuando se añade `action-label`, el toast adopta el patrón snackbar con un botón de acción alineado con el contenido.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
        <Section title="Snackbar con acción">
          <ToastStack>
            <loom-toast type="info"    title="Archivo eliminado"   action-label="Deshacer" dismissible />
            <loom-toast type="success" title="Cambios guardados"   action-label="Ver"       dismissible />
            <loom-toast type="warning" title="Borrador sin guardar" action-label="Guardar"  description="Tienes cambios pendientes." dismissible />
            <loom-toast type="error"   title="Fallo al enviar"     action-label="Reintentar" description="La conexión se ha interrumpido." dismissible />
          </ToastStack>
        </Section>
      </loom-stack>
    </loom-box>
  ),
};

export const AutoDismiss: Story = {
  name: 'Auto-dismiss con timer',
  parameters: {
    docs: {
      description: {
        story: 'El atributo `duration` (ms) activa el auto-dismiss con una barra de progreso animada. Al hacer hover se pausa el timer.',
      },
    },
  },
  render: () => {
    const [toasts, setToasts] = useState([
      { id: 1, type: 'success' as ToastType, title: 'Toast de 4 segundos', description: 'Este toast se cerrará en 4s. Hover para pausar.', duration: 4000 },
      { id: 2, type: 'info' as ToastType, title: 'Toast de 6 segundos', description: 'Este toast se cerrará en 6s. Hover para pausar.', duration: 6000 },
      { id: 3, type: 'warning' as ToastType, title: 'Toast de 8 segundos', description: 'Este toast se cerrará en 8s. Hover para pausar.', duration: 8000 },
    ]);

    const handleDismiss = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <loom-box display="block" padding="lg">
        <Section title="Auto-dismiss (hover para pausar)">
          <ToastStack>
            {toasts.map((toast) => (
              <AutoDismissToast
                key={toast.id}
                item={toast}
                onDismiss={handleDismiss}
              />
            ))}
            {toasts.length === 0 && (
              <p className="loom-body-md" style={{ color: colorVars.textSecondary, margin: 0 }}>
                Todos los toasts han sido cerrados.
              </p>
            )}
          </ToastStack>
        </Section>
      </loom-box>
    );
  },
};

export const Positions: Story = {
  name: 'Posiciones fijas (position)',
  parameters: {
    docs: {
      description: {
        story: 'Con el atributo `position`, el toast se fija en pantalla de forma independiente. Útil para demos o layouts específicos.',
      },
    },
    layout: 'fullscreen',
  },
  render: () => (
    <loom-box display="block" style={{ minHeight: '100vh', backgroundColor: colorVars.surfaceBase, position: 'relative' }}>
      <loom-box display="block" padding-x="lg" style={{ paddingTop: '200px', paddingBottom: '200px', textAlign: 'center' }}>
        <p className="loom-body-md" style={{ color: colorVars.textSecondary, margin: 0 }}>
          Los toasts están posicionados en las esquinas y centro de la pantalla.
        </p>
      </loom-box>

      <loom-toast type="success" title="Top Right"   position="top-right"     dismissible />
      <loom-toast type="info"    title="Top Center"  position="top-center"    dismissible />
      <loom-toast type="warning" title="Top Left"    position="top-left"      dismissible />
      <loom-toast type="error"   title="Bottom Right" position="bottom-right" dismissible />
      <loom-toast type="info"    title="Bottom Center" position="bottom-center" dismissible />
      <loom-toast type="success" title="Bottom Left"  position="bottom-left"  dismissible />
    </loom-box>
  ),
};

export const NoDismiss: Story = {
  name: 'Sin botón de cierre',
  parameters: {
    docs: {
      description: {
        story: 'Con `dismissible="false"`, el botón de cierre se oculta. Útil para notificaciones persistentes o de carga.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <Section title="Persistentes (sin dismiss)">
        <ToastStack>
          <loom-toast type="info" title="Mantenimiento programado" description="El sistema estará en mantenimiento el sábado de 2:00 a 4:00 AM." dismissible={false} />
        </ToastStack>
      </Section>
    </loom-box>
  ),
};

export const CustomEvents: Story = {
  name: 'Eventos custom',
  parameters: {
    docs: {
      description: {
        story: '`loom-toast-action` emite el label de la acción; `loom-toast-dismiss` comunica si el cierre fue por usuario, timeout o acción.',
      },
    },
  },
  render: () => <ToastEventLogExample />,
};

export const WebComponent: Story = {
  tags: ['test'],
  name: 'Web Component (loom-toast)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element \`<loom-toast>\`. Las props son atributos HTML.
La story incluye pruebas automáticas (\`play\`) que validan: shadow DOM, título, descripción,
evento dismiss, y cambio de tipo por atributo.

**CSS parts**: \`::part(icon)\`, \`::part(title)\`, \`::part(description)\`, \`::part(dismiss)\`, \`::part(action)\`
        `.trim(),
      },
    },
  },
  args: {
    type: 'success',
    title: 'Operación completada',
    description: 'Los datos se han guardado correctamente.',
    dismissible: true,
  },
  render: (args) => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
        <loom-toast
          id="test-toast"
          type={args.type}
          title={args.title}
          description={args.description}
          dismissible={args.dismissible}
        />
      </loom-stack>
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-toast');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-toast in canvas.');

    // Shadow DOM must be attached
    await expect(host.shadowRoot).toBeTruthy();

    const shadow = host.shadowRoot!;

    // Title part must exist and contain text
    const titleEl = shadow.querySelector('[part="title"]');
    await expect(titleEl).toBeTruthy();
    await expect(titleEl!.textContent).toBe('Operación completada');

    // Description part must exist when provided
    const descEl = shadow.querySelector('[part="description"]');
    await expect(descEl).toBeTruthy();
    await expect((descEl as HTMLElement).hidden).toBe(false);

    // Dismiss button must be visible when dismissible
    const dismissEl = shadow.querySelector('[part="dismiss"]');
    await expect(dismissEl).toBeTruthy();
    await expect((dismissEl as HTMLElement).hidden).toBe(false);

    // Icon part must exist
    const iconEl = shadow.querySelector('[part="icon"]');
    await expect(iconEl).toBeTruthy();

    // Type change should update icon variant class on the icon wrap
    host.setAttribute('type', 'error');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.getAttribute('role')).toBe('alert');

    // Restore
    host.setAttribute('type', 'success');
    await new Promise((r) => requestAnimationFrame(r));
    await expect(host.getAttribute('role')).toBe('status');

    // Click dismiss and check event
    let dismissed = false;
    host.addEventListener('loom-toast-dismiss', () => { dismissed = true; }, { once: true });
    await userEvent.click(dismissEl as HTMLElement);
    await new Promise((r) => setTimeout(r, 50));
    await expect(dismissed).toBe(true);
  },
};

export const CSSParts: Story = {
  decorators: [
    (Story) => (
      <>
        <style>{`
          .parts-demo loom-toast::part(title) {
            font-style: italic;
            letter-spacing: 0.03em;
          }
          .parts-demo loom-toast::part(description) {
            font-size: 11px;
            opacity: 0.8;
          }
          .parts-demo loom-toast::part(dismiss) {
            border-radius: 50%;
          }
        `}</style>
        <loom-box display="block" className="parts-demo">
          <Story />
        </loom-box>
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Consumers pueden sobreescribir los internos via CSS parts:

| Part | Elemento | Uso sugerido |
|---|---|---|
| \`icon\` | Div del icono circular | Color, tamaño |
| \`title\` | \`<p>\` del título | Tipografía, color |
| \`description\` | \`<p>\` de la descripción | Tipografía, color |
| \`dismiss\` | Botón de cierre | Shape, color |
| \`action\` | Botón de acción | Color, padding |
        `.trim(),
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <ToastStack>
        {TOAST_TYPES.map((type) => (
          <loom-toast
            key={type}
            type={type}
            title={`Toast ${type}`}
            description="Descripción personalizada via ::part()"
            dismissible
          />
        ))}
      </ToastStack>
    </loom-box>
  ),
};
