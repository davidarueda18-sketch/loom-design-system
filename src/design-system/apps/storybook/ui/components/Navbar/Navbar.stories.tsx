import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import type { ReactNode } from 'react';

import '../../../loom-web-components.d.ts';

import '../../../../../package/ui/components/Navbar/adapters/Navbar.element.ts';
import '../../../../../package/ui/primitives/IconButton/adapters/IconButton.element.ts';
import '../../../../../package/ui/primitives/Icon/adapters/Icon.element.ts';

interface NavbarStoryArgs {
  application: string;
  section: string;
}

/* ------------------------------------------------------------------ *
 * Layout helpers (above the export block per the story contract)
 * ------------------------------------------------------------------ */

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ minHeight: '160px' }}>{children}</div>
);

const ICONS = {
  bell: 'fi fi-rr-bell',
  inbox: 'fi fi-rr-inbox',
};

const NavbarAction = ({ icon, label }: { icon: string; label: string }) => (
  <loom-icon-button variant="ghost" size="md" aria-label={label}>
    <loom-icon size="md">
      <i className={icon} aria-hidden="true" />
    </loom-icon>
  </loom-icon-button>
);

const SampleActions = () => (
  <>
    <NavbarAction icon={ICONS.bell} label="Notificaciones" />
    <NavbarAction icon={ICONS.inbox} label="Mensajes" />
  </>
);

/* ------------------------------------------------------------------ */

const meta = {
  title: 'Components/Navbar',
  tags: ['autodocs'],
  args: {
    application: 'NAME',
    section: 'Specific Section',
  },
  argTypes: {
    application: { control: 'text', description: 'Nombre de la aplicación (título en negrita, izquierda).' },
    section: { control: 'text', description: 'Sección/contexto actual (subtítulo; el divisor se oculta si está vacío).' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Barra de navegación superior presentacional. \`loom-navbar\` expone el nombre de la aplicación
(\`application\`, en negrita) y la sección actual (\`section\`, subtítulo) separados por un divisor
vertical interno; el slot por defecto aloja las acciones de la derecha (p. ej. \`loom-icon-button\`).
El divisor y la sección se ocultan automáticamente cuando \`section\` está vacío.

\`\`\`html
<loom-navbar application="NAME" section="Specific Section">
  <loom-icon-button variant="ghost" size="md" aria-label="Notificaciones">
    <loom-icon size="md"><i class="fi fi-rr-bell" aria-hidden="true"></i></loom-icon>
  </loom-icon-button>
  <loom-icon-button variant="ghost" size="md" aria-label="Mensajes">
    <loom-icon size="md"><i class="fi fi-rr-inbox" aria-hidden="true"></i></loom-icon>
  </loom-icon-button>
</loom-navbar>
\`\`\`

El host expone \`role="navigation"\` y refleja \`application\` como \`aria-label\` salvo que el consumidor
defina el suyo. Parts: \`container\`, \`hero\`, \`application\`, \`divider\`, \`section\`, \`options\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<NavbarStoryArgs>;

export default meta;
type Story = StoryObj<NavbarStoryArgs>;

export const Default: Story = {
  render: ({ application, section }) => (
    <Frame>
      <loom-navbar application={application} section={section} data-testid="navbar">
        <SampleActions />
      </loom-navbar>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const navbar = within(canvasElement).getByTestId('navbar');
    await waitFor(() => {
      const application = navbar.shadowRoot?.querySelector<HTMLElement>('[part="application"]');
      const divider = navbar.shadowRoot?.querySelector<HTMLElement>('[part="divider"]');
      const section = navbar.shadowRoot?.querySelector<HTMLElement>('[part="section"]');
      if (!application || !divider || !section) throw new Error('Navbar parts not found');
      expect(application).toHaveTextContent('NAME');
      expect(section).toHaveTextContent('Specific Section');
      expect(divider.hidden).toBe(false);
    });
    await expect(navbar).toHaveAttribute('role', 'navigation');
    await expect(navbar).toHaveAttribute('aria-label', 'NAME');
  },
};

export const TitleOnly: Story = {
  args: { section: '' },
  parameters: {
    docs: { description: { story: 'Sin `section`: el divisor vertical y el subtítulo se ocultan automáticamente.' } },
  },
  render: ({ application, section }) => (
    <Frame>
      <loom-navbar application={application} {...(section ? { section } : {})} data-testid="navbar-title-only">
        <SampleActions />
      </loom-navbar>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const navbar = within(canvasElement).getByTestId('navbar-title-only');
    await waitFor(() => {
      const divider = navbar.shadowRoot?.querySelector<HTMLElement>('[part="divider"]');
      const section = navbar.shadowRoot?.querySelector<HTMLElement>('[part="section"]');
      if (!divider || !section) throw new Error('Navbar parts not found');
      expect(divider.hidden).toBe(true);
      expect(section.hidden).toBe(true);
    });
  },
};

export const CSSParts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `
Personalización de internos sin romper la encapsulación del shadow root:

| Part | Elemento | Qué estilar |
|---|---|---|
| \`container\` | Barra | Fondo, padding, borde inferior |
| \`hero\` | Zona izquierda | Layout / gap del título + sección |
| \`application\` | Título | Tipografía, color |
| \`divider\` | Línea vertical | Color, grosor |
| \`section\` | Subtítulo | Tipografía, color |
| \`options\` | Zona derecha | Layout / gap de acciones |
        `.trim(),
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          .parts-demo loom-navbar::part(application) { letter-spacing: 0.12em; text-transform: uppercase; }
          .parts-demo loom-navbar::part(divider) { width: 2px; }
        `}</style>
        <div className="parts-demo">
          <Story />
        </div>
      </>
    ),
  ],
  render: () => (
    <Frame>
      <loom-navbar application="NAME" section="Specific Section">
        <SampleActions />
      </loom-navbar>
    </Frame>
  ),
};

export const WebComponent: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Uso directo del custom element `loom-navbar` (HTML puro).' } },
  },
  render: () => (
    <Frame>
      <div
        dangerouslySetInnerHTML={{
          __html: `
<loom-navbar application="NAME" section="Specific Section">
  <loom-icon-button variant="ghost" size="md" aria-label="Notificaciones">
    <loom-icon size="md"><i class="fi fi-rr-bell" aria-hidden="true"></i></loom-icon>
  </loom-icon-button>
  <loom-icon-button variant="ghost" size="md" aria-label="Mensajes">
    <loom-icon size="md"><i class="fi fi-rr-inbox" aria-hidden="true"></i></loom-icon>
  </loom-icon-button>
</loom-navbar>`,
        }}
      />
    </Frame>
  ),
};
