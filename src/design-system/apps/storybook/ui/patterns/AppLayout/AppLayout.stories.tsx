import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import '../../../storybook-assets.d.ts';
import '../../../loom-web-components.d.ts';
import kyndrylRed from '../../../../../../assets/brand/kyndryl_red.png';
import kyndrylKRed from '../../../../../../assets/brand/kyndryl_k_red.png';

import '../../../../../package/ui/patterns/AppLayout/adapters/AppLayout.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/Sidebar.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/SidebarItem.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/SidebarGroup.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/SidebarSubitem.element.ts';
import '../../../../../package/ui/components/Navbar/adapters/Navbar.element.ts';
import '../../../../../package/ui/primitives/Icon/adapters/Icon.element.ts';
import '../../../../../package/ui/primitives/IconButton/adapters/IconButton.element.ts';
import { MENU_BUTTON_MODES } from '../../../../../package/ui/patterns/AppLayout/AppLayout.types.ts';

interface AppLayoutStoryArgs {
  responsive: boolean;
  mobileBreakpoint: string;
  menuButton: (typeof MENU_BUTTON_MODES)[number];
}

/* ------------------------------------------------------------------ *
 * Composition helpers (above the export block per the story contract)
 * ------------------------------------------------------------------ */

const ICONS = {
  dashboard: 'fi fi-rr-home',
  book: 'fi fi-rr-book-alt',
  cog: 'fi fi-rr-settings',
  chevron: 'fi fi-rr-angle-small-down',
  bell: 'fi fi-rr-bell',
  inbox: 'fi fi-rr-inbox',
};

const SidebarIcon = ({ className, slot }: { className: string; slot?: string }) => (
  <loom-icon size="mini" {...(slot ? { slot } : {})}>
    <i className={className} aria-hidden="true" />
  </loom-icon>
);

const SampleSidebar = () => (
  <loom-sidebar
    slot="sidebar"
    label="Navegación principal"
    logo-src={kyndrylRed}
    compact-logo-src={kyndrylKRed}
    logo-alt="Kyndryl"
    data-testid="sidebar"
  >
    <loom-sidebar-item item-id="dashboard" label="Dashboard" selected>
      <SidebarIcon slot="icon" className={ICONS.dashboard} />
    </loom-sidebar-item>
    <loom-sidebar-item item-id="inventario" label="Inventario">
      <SidebarIcon slot="icon" className={ICONS.book} />
    </loom-sidebar-item>
    <loom-sidebar-group group-id="reportes" label="Reportes">
      <SidebarIcon slot="icon" className={ICONS.book} />
      <SidebarIcon slot="chevron" className={ICONS.chevron} />
      <loom-sidebar-subitem item-id="sub-1" label="Mensuales" />
      <loom-sidebar-subitem item-id="sub-2" label="Anuales" />
    </loom-sidebar-group>
    <loom-sidebar-item slot="footer" item-id="settings" label="Configuración y ayuda">
      <SidebarIcon slot="icon" className={ICONS.cog} />
    </loom-sidebar-item>
  </loom-sidebar>
);

const SampleNavbar = () => (
  <loom-navbar slot="navbar" application="NAME" section="Specific Section">
    <loom-icon-button variant="ghost" size="md" aria-label="Notificaciones">
      <loom-icon size="md">
        <i className={ICONS.bell} aria-hidden="true" />
      </loom-icon>
    </loom-icon-button>
    <loom-icon-button variant="ghost" size="md" aria-label="Mensajes">
      <loom-icon size="md">
        <i className={ICONS.inbox} aria-hidden="true" />
      </loom-icon>
    </loom-icon-button>
  </loom-navbar>
);

const SampleContent = () => (
  <div style={{ padding: '24px' }}>
    <h1 style={{ marginTop: 0 }}>Contenido</h1>
    <p>
      El área de contenido se reacomoda automáticamente al ancho del sidebar. Alterna el
      sidebar (con su toggle integrado o la hamburguesa) y observa cómo el navbar y este
      contenido se ajustan sin saltos.
    </p>
    <p style={{ height: '120vh' }}>Bloque alto para demostrar que solo el contenido hace scroll.</p>
  </div>
);

const Shell = ({
  responsive,
  mobileBreakpoint,
  menuButton,
  testid = 'app-layout',
}: AppLayoutStoryArgs & { testid?: string }) => (
  <loom-app-layout
    data-testid={testid}
    {...(responsive ? { responsive: '' } : {})}
    {...(mobileBreakpoint ? { 'mobile-breakpoint': mobileBreakpoint } : {})}
    {...(menuButton ? { 'menu-button': menuButton } : {})}
  >
    <SampleSidebar />
    <SampleNavbar />
    <SampleContent />
  </loom-app-layout>
);

/* ------------------------------------------------------------------ */

const meta = {
  title: 'Patterns/AppLayout',
  tags: ['autodocs'],
  args: {
    responsive: false,
    mobileBreakpoint: '768px',
    menuButton: 'auto',
  },
  argTypes: {
    responsive: {
      control: 'boolean',
      description: 'Activa el modo drawer off-canvas bajo `mobile-breakpoint`.',
    },
    mobileBreakpoint: {
      control: 'text',
      description: 'Umbral (max-width) para el modo móvil/drawer. Default `768px`.',
    },
    menuButton: {
      control: 'select',
      options: [...MENU_BUTTON_MODES],
      description: 'Visibilidad de la hamburguesa integrada: `auto` (solo móvil), `always`, `never`.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Pattern de layout "app shell": compone \`loom-sidebar\` (\`slot="sidebar"\`), \`loom-navbar\`
(\`slot="navbar"\`) y el contenido (slot por defecto). En escritorio el contenido se reacomoda
**solo con CSS** porque el host del sidebar reserva y anima su propio ancho (320/96 px). Con
\`responsive\`, bajo \`mobile-breakpoint\` el sidebar pasa a drawer off-canvas con scrim, controlado
por la hamburguesa integrada.

\`\`\`html
<loom-app-layout responsive mobile-breakpoint="768px" menu-button="auto">
  <loom-sidebar slot="sidebar" label="Navegación principal"> … </loom-sidebar>
  <loom-navbar slot="navbar" application="NAME" section="Specific Section"> … </loom-navbar>
  <main><!-- contenido (slot por defecto; única región con scroll) --></main>
</loom-app-layout>
\`\`\`

Atributos: \`responsive\`, \`mobile-breakpoint\`, \`menu-button\` (\`auto|always|never\`). Estado reflejado:
\`data-mobile\`, \`data-drawer-open\`. Métodos: \`openDrawer()\`, \`closeDrawer()\`, \`toggleDrawer()\`.
Evento: \`loom-app-layout-drawer-toggle\` (\`detail: { open }\`). Parts: \`sidebar-dock\`, \`scrim\`,
\`main\`, \`topbar\`, \`menu-toggle\`, \`content\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<AppLayoutStoryArgs>;

export default meta;
type Story = StoryObj<AppLayoutStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Escritorio: el sidebar reserva su ancho y el contenido + navbar se reacomodan al colapsar/expandir (con el toggle integrado del sidebar). La hamburguesa queda oculta (`menu-button="auto"`).',
      },
    },
  },
  render: (args) => <Shell {...args} />,
  play: async ({ canvasElement }) => {
    const layout = within(canvasElement).getByTestId('app-layout');
    await waitFor(() => {
      const menu = layout.shadowRoot?.querySelector<HTMLButtonElement>('[part="menu-toggle"]');
      const content = layout.shadowRoot?.querySelector<HTMLElement>('[part="content"]');
      if (!menu || !content) throw new Error('AppLayout parts not found');
      // auto + escritorio (canvas ancho) ⇒ hamburguesa oculta.
      expect(menu.hidden).toBe(true);
    });
  },
};

export const DesktopHamburger: Story = {
  args: { menuButton: 'always' },
  parameters: {
    docs: {
      description: {
        story: '`menu-button="always"`: la hamburguesa también aparece en escritorio y alterna el modo rail del sidebar (`sidebar.toggle()`).',
      },
    },
  },
  render: (args) => <Shell {...args} testid="app-layout-desktop" />,
  play: async ({ canvasElement }) => {
    const layout = within(canvasElement).getByTestId('app-layout-desktop');
    const sidebar = layout.querySelector('loom-sidebar');
    if (!sidebar) throw new Error('Sidebar not found');

    const menu = await waitFor(() => {
      const el = layout.shadowRoot?.querySelector<HTMLButtonElement>('[part="menu-toggle"]');
      if (!el || el.hidden) throw new Error('Hamburger not visible');
      return el;
    });

    await expect(sidebar).not.toHaveAttribute('collapsed');
    await userEvent.click(menu);
    await expect(sidebar).toHaveAttribute('collapsed');
    await userEvent.click(menu);
    await expect(sidebar).not.toHaveAttribute('collapsed');
  },
};

export const Responsive: Story = {
  args: {
    responsive: true,
    // Umbral alto para que el canvas estándar entre en modo móvil y se vea el drawer.
    mobileBreakpoint: '1600px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Modo responsive: bajo el breakpoint el sidebar es un drawer off-canvas. La hamburguesa lo abre, el scrim o `Escape` lo cierran, y seleccionar un item también. (Breakpoint puesto en 1600px para demostrarlo en el canvas estándar.)',
      },
    },
  },
  render: (args) => <Shell {...args} testid="app-layout-responsive" />,
  play: async ({ canvasElement }) => {
    const layout = within(canvasElement).getByTestId('app-layout-responsive');

    const menu = await waitFor(() => {
      const el = layout.shadowRoot?.querySelector<HTMLButtonElement>('[part="menu-toggle"]');
      if (!el || el.hidden) throw new Error('Hamburger not visible in mobile mode');
      return el;
    });
    await expect(layout).toHaveAttribute('data-mobile');
    await expect(layout).not.toHaveAttribute('data-drawer-open');

    // Abrir el drawer.
    await userEvent.click(menu);
    await expect(layout).toHaveAttribute('data-drawer-open');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');

    // Cerrar tocando el scrim.
    const scrim = layout.shadowRoot?.querySelector<HTMLElement>('[part="scrim"]');
    if (!scrim) throw new Error('Scrim not found');
    await userEvent.click(scrim);
    await expect(layout).not.toHaveAttribute('data-drawer-open');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  },
};

export const WebComponent: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Uso directo del custom element `loom-app-layout` (HTML puro).' } },
  },
  render: () => (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<loom-app-layout responsive mobile-breakpoint="768px">
  <loom-sidebar slot="sidebar" label="Navegación principal" logo-src="${kyndrylRed}" compact-logo-src="${kyndrylKRed}" logo-alt="Kyndryl">
    <loom-sidebar-item item-id="dashboard" label="Dashboard" selected>
      <loom-icon slot="icon" size="mini"><i class="fi fi-rr-home" aria-hidden="true"></i></loom-icon>
    </loom-sidebar-item>
    <loom-sidebar-item item-id="inventario" label="Inventario">
      <loom-icon slot="icon" size="mini"><i class="fi fi-rr-book-alt" aria-hidden="true"></i></loom-icon>
    </loom-sidebar-item>
  </loom-sidebar>
  <loom-navbar slot="navbar" application="NAME" section="Specific Section">
    <loom-icon-button variant="ghost" size="md" aria-label="Notificaciones">
      <loom-icon size="md"><i class="fi fi-rr-bell" aria-hidden="true"></i></loom-icon>
    </loom-icon-button>
  </loom-navbar>
  <main style="padding:24px"><h1 style="margin-top:0">Contenido</h1></main>
</loom-app-layout>`,
      }}
    />
  ),
};
