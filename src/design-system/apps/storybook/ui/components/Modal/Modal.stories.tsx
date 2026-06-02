import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/components/Modal/adapters/Modal.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

import { MODAL_SIZES } from '../../../../../package/ui/components/Modal/Modal.types.ts';
import type {
  ModalCloseEventDetail,
  ModalSize,
} from '../../../../../package/ui/components/Modal/Modal.types.ts';

// ─── Story arg interfaces ─────────────────────────────────────────────────────

interface ModalStoryArgs {
  title: string;
  size: ModalSize;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  args: {
    title: 'Título del modal',
    size: 'md',
  },
  argTypes: {
    title: { control: 'text', description: 'Texto del título en el header del modal' },
    size: { control: 'select', options: MODAL_SIZES, description: 'Tamaño del modal' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Diálogo modal con backdrop, header fijo y footer flexible. El contenido del cuerpo se proyecta
mediante el slot por defecto, y los botones de acción se envían a través de \`slot="footer"\`.

\`\`\`html
<loom-modal open title="Título del modal" size="md">
  <p class="loom-body-md">¿Estás seguro de que deseas continuar?</p>
  <loom-button slot="footer" variant="outline">Cancelar</loom-button>
  <loom-button slot="footer" variant="primary">Confirmar</loom-button>
</loom-modal>
\`\`\`

Escucha \`loom-modal-close\` para reaccionar al cierre:

\`\`\`js
document.querySelector('loom-modal')
  .addEventListener('loom-modal-close', (e) => {
    console.log('Cerrado con:', e.detail.reason); // 'close' | 'backdrop' | 'escape'
  });
\`\`\`

| Surface | Name | Purpose |
|---|---|---|
| Attribute | open | Shows the modal when present |
| Attribute | title | Header title text |
| Attribute | size | Dialog width preset: sm, md, lg, xl |
| Attribute | aria-label | Accessible label for the close button |
| Attribute | aria-describedby | Description id forwarded to the dialog |
| Slot | default | Main body content |
| Slot | footer | Footer actions; hidden when empty |
| Part | backdrop | Fixed overlay behind the dialog |
| Part | dialog | Dialog panel with role="dialog" |
| Part | header | Header row containing title and close button |
| Part | title | Header title element |
| Part | close-btn | Native close button |
| Part | content | Scrollable body container |
| Part | empty-placeholder | Empty-state text when the default slot has no content |
| Part | footer | Footer action container |
| Event | loom-modal-close | Emitted after close animation with detail.reason |
        `.trim(),
      },
    },
  },
} satisfies Meta<ModalStoryArgs>;

export default meta;
type Story = StoryObj<ModalStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoomButtonAction({
  id,
  label,
  onClick,
  slot,
  variant = 'primary',
}: {
  id?: string;
  label: string;
  onClick?: () => void;
  slot?: string;
  variant?: 'primary' | 'outline' | 'text';
}) {
  const ref = useRef<HTMLElementTagNameMap['loom-button'] | null>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button || onClick === undefined) return;
    button.addEventListener('loom-click', onClick);
    return () => button.removeEventListener('loom-click', onClick);
  }, [onClick]);

  return (
    <loom-button
      ref={ref}
      id={id}
      slot={slot}
      variant={variant}
      size="md"
    >
      {label}
    </loom-button>
  );
}

function TriggerButton({ label, onClick, id }: { label: string; onClick: () => void; id?: string }) {
  return <LoomButtonAction id={id} label={label} onClick={onClick} />;
}

function CancelBtn({ onClick, slot, id }: { onClick: () => void; slot?: string; id?: string }) {
  return <LoomButtonAction id={id} slot={slot} label="Cancelar" variant="outline" onClick={onClick} />;
}

function ConfirmBtn({ onClick, slot, id }: { onClick?: () => void; slot?: string; id?: string }) {
  return <LoomButtonAction id={id} slot={slot} label="Confirmar" onClick={onClick} />;
}

// ─── Controlled modal helper ──────────────────────────────────────────────────

function ControlledModal({
  title,
  size,
  footer,
  children,
}: {
  title: string;
  size?: ModalSize;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElementTagNameMap['loom-modal'] | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.open = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<ModalCloseEventDetail>).detail;
      console.log('[loom-modal-close] reason:', detail.reason);
      setIsOpen(false);
    };
    el.addEventListener('loom-modal-close', handler);
    return () => el.removeEventListener('loom-modal-close', handler);
  }, []);

  return (
    <loom-box display="block" padding="xl2">
      <loom-inline justify="center" align="start">
        <TriggerButton label="Abrir modal" onClick={() => setIsOpen(true)} />
      </loom-inline>
      <loom-modal
        ref={ref}
        title={title}
        size={size}
      >
        {children === undefined ? (
          <p className="loom-body-md" style={{ margin: 0, color: colorVars.textSecondary }}>
            Contenido del modal. Puedes proyectar cualquier elemento HTML aquí.
          </p>
        ) : children}
        {footer !== undefined
          ? footer
          : (
            <>
              <CancelBtn slot="footer" onClick={() => setIsOpen(false)} />
              <ConfirmBtn slot="footer" onClick={() => setIsOpen(false)} />
            </>
          )}
      </loom-modal>
    </loom-box>
  );
}

function ModalEventLogExample({ title, size }: ModalStoryArgs) {
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLElementTagNameMap['loom-modal'] | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.open = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const modal = ref.current;
    if (!modal) return undefined;

    const handleClose = (event: Event): void => {
      const { reason } = (event as CustomEvent<ModalCloseEventDetail>).detail;
      setLog((prev) => [`loom-modal-close: ${reason}`, ...prev].slice(0, 6));
      setIsOpen(false);
    };

    modal.addEventListener('loom-modal-close', handleClose);
    return () => modal.removeEventListener('loom-modal-close', handleClose);
  }, []);

  return (
    <loom-box display="block" padding="xl2">
      <loom-stack gap="md" align="center">
        <TriggerButton label="Abrir modal" onClick={() => setIsOpen(true)} />
        <loom-modal ref={ref} title={title} size={size}>
          <p className="loom-body-md" style={{ margin: 0, color: colorVars.textSecondary }}>
            Cierra el modal desde el botón de cierre, el backdrop o la tecla Escape.
          </p>
        </loom-modal>
        <loom-box display="block" padding="smMd" style={{
          minHeight: '72px',
          width: 'min(100%, 420px)',
          border: `1px dashed ${colorVars.borderSubtle}`,
          borderRadius: '8px',
          color: colorVars.textSecondary,
        }}>
          {log.length === 0
            ? <p className="loom-caption" style={{ margin: 0 }}>No events yet</p>
            : log.map((entry) => <p key={entry} className="loom-caption" style={{ margin: 0 }}>{entry}</p>)}
        </loom-box>
      </loom-stack>
    </loom-box>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ title, size }) => <ControlledModal title={title} size={size} />,
};

export const Sizes: Story = {
  args: {
    size: 'sm',
  },

  name: 'Tamaños',

  parameters: {
    docs: {
      description: {
        story: 'Cada tamaño tiene sus propias restricciones de `min-width` y `max-width`. El diálogo usa `width: 100%` para ocupar el espacio disponible dentro de esos límites.',
      },
    },
  },

  render: () => {
    const sizeLabels: Record<ModalSize, string> = {
      sm: 'SM — min 360px / max 400px',
      md: 'MD — min 520px / max 560px',
      lg: 'LG — min 680px / max 720px',
      xl: 'XL — min 840px / max 880px',
    };
    return (
      <loom-box display="block" padding="xl" style={{ backgroundColor: colorVars.surfaceBase }}>
        <loom-inline gap="md" align="start" justify="start" wrap>
          {MODAL_SIZES.map((size) => (
            <ControlledModal
              key={size}
              title={sizeLabels[size]}
              size={size}
            />
          ))}
        </loom-inline>
      </loom-box>
    );
  },
};

export const SingleAction: Story = {
  name: 'Acción única',
  parameters: {
    docs: {
      description: {
        story: 'Cuando solo se necesita una acción, el `slot="footer"` acepta un único elemento.',
      },
    },
  },
  render: ({ title, size }) => (
    <ControlledModal
      title={title}
      size={size}
      footer={<ConfirmBtn slot="footer" />}
    />
  ),
};

export const NoFooter: Story = {
  name: 'Sin footer',
  parameters: {
    docs: {
      description: {
        story: 'Si no se proyecta nada en `slot="footer"`, el footer se oculta automáticamente.',
      },
    },
  },
  render: ({ title, size }) => (
    <ControlledModal
      title={title}
      size={size}
      footer={null}
    />
  ),
};

export const EmptyContent: Story = {
  name: 'Sin contenido',
  parameters: {
    docs: {
      description: {
        story: 'Si no se proyecta contenido en el slot por defecto, el cuerpo conserva su alto mínimo y muestra el estado vacío centrado.',
      },
    },
  },
  render: ({ title, size }) => (
    <ControlledModal
      title={title}
      size={size}
      footer={null}
    >
      {null}
    </ControlledModal>
  ),
};

export const CustomEvents: Story = {
  name: 'Eventos custom',
  parameters: {
    docs: {
      description: {
        story: '`loom-modal-close` se emite después de la animación de cierre y expone `detail.reason`. Los valores posibles son `close`, `backdrop` y `escape`.',
      },
    },
  },
  render: ({ title, size }) => <ModalEventLogExample title={title} size={size} />,
};

export const CSSParts: Story = {
  name: 'CSS parts',
  decorators: [
    (Story) => (
      <>
        <style>{`
          .modal-parts-demo loom-modal::part(dialog) {
            border: 2px solid ${colorVars.brandAccent};
          }

          .modal-parts-demo loom-modal::part(header),
          .modal-parts-demo loom-modal::part(footer) {
            background: ${colorVars.surfaceSubtle};
          }

          .modal-parts-demo loom-modal::part(title) {
            color: ${colorVars.brandAccent};
          }
        `}</style>
        <loom-box display="block" className="modal-parts-demo">
          <Story />
        </loom-box>
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'El componente expone partes estables para overrides visuales puntuales sin depender de estructura interna privada.',
      },
    },
  },
  render: ({ size }) => (
    <ControlledModal
      title="Modal con ::part()"
      size={size}
    />
  ),
};

function WebComponentExample() {
  const ref = useRef<HTMLElementTagNameMap['loom-modal'] | null>(null);
  const setModalOpen = (open: boolean): void => {
    if (ref.current) ref.current.open = open;
  };

  return (
    <loom-box display="block" padding="xl2">
      <loom-stack gap="md" align="center">
        <LoomButtonAction
          id="modal-trigger"
          label="Abrir modal"
          onClick={() => setModalOpen(true)}
        />
        <loom-modal ref={ref} title="Título de prueba" size="md">
          <p className="loom-body-md" style={{ margin: 0, color: colorVars.textSecondary }}>
            Contenido del modal para pruebas automatizadas.
          </p>
          <CancelBtn
            slot="footer"
            id="footer-cancel"
            onClick={() => setModalOpen(false)}
          />
          <ConfirmBtn
            slot="footer"
            id="footer-confirm"
          />
        </loom-modal>
      </loom-stack>
    </loom-box>
  );
}

function waitForModalClose(modal: HTMLElementTagNameMap['loom-modal']): Promise<ModalCloseEventDetail> {
  return new Promise((resolve) => {
    modal.addEventListener(
      'loom-modal-close',
      (event) => resolve((event as CustomEvent<ModalCloseEventDetail>).detail),
      { once: true },
    );
  });
}

export const WebComponent: StoryObj<ModalStoryArgs> = {
  tags: ['test'],
  name: 'Web Component (loom-modal)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element. Las pruebas automáticas (\`play\`) validan:
shadow DOM, \`role="dialog"\`, \`aria-modal\`, texto del título y disparo de \`loom-modal-close\`
al pulsar el botón de cierre y al presionar Escape.
        `.trim(),
      },
    },
  },
  render: () => <WebComponentExample />,
  play: async ({ canvasElement }) => {
    const modal = canvasElement.querySelector('loom-modal');
    if (!(modal instanceof HTMLElement)) throw new Error('Expected loom-modal.');

    // Shadow DOM must be attached
    await expect(modal.shadowRoot).toBeTruthy();
    const shadow = modal.shadowRoot!;

    // Open the modal
    const triggerBtn = canvasElement.querySelector<HTMLElementTagNameMap['loom-button']>('#modal-trigger');
    triggerBtn?.shadowRoot?.querySelector('button')?.click();
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    // Backdrop must be visible
    const backdropEl = shadow.querySelector('[part="backdrop"]') as HTMLElement;
    await expect(backdropEl.hidden).toBe(false);

    // Dialog must have role="dialog" and aria-modal="true"
    const dialogEl = shadow.querySelector('[part="dialog"]') as HTMLElement;
    await expect(dialogEl.getAttribute('role')).toBe('dialog');
    await expect(dialogEl.getAttribute('aria-modal')).toBe('true');

    // Title text must match
    const titleEl = shadow.querySelector('[part="title"]') as HTMLElement;
    await expect(titleEl.textContent).toBe('Título de prueba');

    // Close button (×) dispatches loom-modal-close with reason 'close'
    const closeDetailPromise = waitForModalClose(modal as HTMLElementTagNameMap['loom-modal']);
    const closeBtnEl = shadow.querySelector<HTMLButtonElement>('[part="close-btn"]');
    closeBtnEl?.click();
    const closeDetail = await closeDetailPromise;
    await expect(closeDetail.reason).toBe('close');

    // Re-open for Escape key test
    modal.setAttribute('open', '');
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const escDetailPromise = waitForModalClose(modal as HTMLElementTagNameMap['loom-modal']);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, composed: true }));
    const escDetail = await escDetailPromise;
    await expect(escDetail.reason).toBe('escape');

    // Footer must be visible (has slotted children)
    const footerEl = shadow.querySelector('[part="footer"]') as HTMLElement;
    await expect(footerEl.hidden).toBe(false);
  },
};
