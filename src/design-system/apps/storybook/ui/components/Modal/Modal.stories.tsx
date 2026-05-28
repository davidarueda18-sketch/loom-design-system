import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/components/Modal/adapters/Modal.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
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
  <p>¿Estás seguro de que deseas continuar?</p>
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
        `.trim(),
      },
    },
  },
} satisfies Meta<ModalStoryArgs>;

export default meta;
type Story = StoryObj<ModalStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const footerButtonBase: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #444',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  fontSize: '13px',
  fontWeight: 500,
};

function TriggerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...footerButtonBase,
        background: '#e55b3c',
        color: '#fff',
        border: '1px solid #e55b3c',
        padding: '10px 20px',
        fontSize: '14px',
      }}
    >
      {label}
    </button>
  );
}

function CancelBtn({ onClick, slot }: { onClick: () => void; slot?: string }) {
  return (
    <button type="button" slot={slot} onClick={onClick} style={{ ...footerButtonBase, background: 'transparent', color: colorVars.textPrimary }}>
      Cancelar
    </button>
  );
}

function ConfirmBtn({ onClick, slot }: { onClick?: () => void; slot?: string }) {
  return (
    <button
      type="button"
      slot={slot}
      onClick={onClick}
      style={{ ...footerButtonBase, background: '#e55b3c', color: '#fff', border: '1px solid #e55b3c' }}
    >
      Confirmar
    </button>
  );
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
  footer?: React.ReactNode;
  children?: React.ReactNode;
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
    <div style={{ padding: '48px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <TriggerButton label="Abrir modal" onClick={() => setIsOpen(true)} />
      <loom-modal
        ref={ref}
        title={title}
        size={size}
      >
        {children === undefined ? (
          <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '14px', color: colorVars.textSecondary }}>
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
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ title, size }) => <ControlledModal title={title} size={size} />,
};

export const Sizes: Story = {
  args: {
    size: "sm"
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
      <div style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', gap: '16px', backgroundColor: colorVars.surfaceBase }}>
        {MODAL_SIZES.map((size) => (
          <ControlledModal
            key={size}
            title={sizeLabels[size]}
            size={size}
          />
        ))}
      </div>
    );
  }
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

function WebComponentExample() {
  const ref = useRef<HTMLElementTagNameMap['loom-modal'] | null>(null);
  const setModalOpen = (open: boolean): void => {
    if (ref.current) ref.current.open = open;
  };

  return (
    <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
      <button
        type="button"
        id="modal-trigger"
        onClick={() => setModalOpen(true)}
        style={{ ...footerButtonBase, background: '#e55b3c', color: '#fff', border: '1px solid #e55b3c', padding: '10px 20px', fontSize: '14px' }}
      >
        Abrir modal
      </button>
      <loom-modal ref={ref} title="Título de prueba" size="md">
        <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '14px', color: colorVars.textSecondary }}>
          Contenido del modal para pruebas automatizadas.
        </p>
        <button
          slot="footer"
          type="button"
          id="footer-cancel"
          style={{ ...footerButtonBase, background: 'transparent', color: colorVars.textPrimary }}
          onClick={() => setModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          slot="footer"
          type="button"
          id="footer-confirm"
          style={{ ...footerButtonBase, background: '#e55b3c', color: '#fff', border: '1px solid #e55b3c' }}
        >
          Confirmar
        </button>
      </loom-modal>
    </div>
  );
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
    const triggerBtn = canvasElement.querySelector<HTMLButtonElement>('#modal-trigger');
    triggerBtn?.click();
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
    let closeDetail: ModalCloseEventDetail | null = null;
    modal.addEventListener(
      'loom-modal-close',
      (e) => { closeDetail = (e as CustomEvent<ModalCloseEventDetail>).detail; },
      { once: true },
    );
    const closeBtnEl = shadow.querySelector<HTMLButtonElement>('[part="close-btn"]');
    closeBtnEl?.click();
    await new Promise((r) => setTimeout(r, 400));
    await expect(closeDetail?.reason).toBe('close');

    // Re-open for Escape key test
    modal.setAttribute('open', '');
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    let escDetail: ModalCloseEventDetail | null = null;
    modal.addEventListener(
      'loom-modal-close',
      (e) => { escDetail = (e as CustomEvent<ModalCloseEventDetail>).detail; },
      { once: true },
    );
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, composed: true }));
    await new Promise((r) => setTimeout(r, 400));
    await expect(escDetail?.reason).toBe('escape');

    // Footer must be visible (has slotted children)
    const footerEl = shadow.querySelector('[part="footer"]') as HTMLElement;
    await expect(footerEl.hidden).toBe(false);
  },
};
