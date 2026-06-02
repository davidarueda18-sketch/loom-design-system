import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { ReactNode } from 'react';

import '../../../storybook-assets.d.ts';
import '../../../loom-web-components.d.ts';
import kyndrylRed from '../../../../../../assets/brand/kyndryl_red.png';
import kyndrylKRed from '../../../../../../assets/brand/kyndryl_k_red.png';

import '../../../../../package/ui/components/Sidebar/adapters/Sidebar.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/SidebarItem.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/SidebarGroup.element.ts';
import '../../../../../package/ui/components/Sidebar/adapters/SidebarSubitem.element.ts';
import '../../../../../package/ui/primitives/Icon/adapters/Icon.element.ts';
import '../../../../../package/ui/primitives/IconButton/adapters/IconButton.element.ts';

interface SidebarStoryArgs {
  collapsed: boolean;
}

/* ------------------------------------------------------------------ *
 * Layout helpers (above the export block per the story contract)
 * ------------------------------------------------------------------ */

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ height: '560px', display: 'flex' }}>{children}</div>
);

const ICONS = {
  dashboard: 'fi fi-rr-home',
  book: 'fi fi-rr-book-alt',
  beaker: 'fi fi-rr-flask',
  cog: 'fi fi-rr-settings',
  chevron: 'fi fi-rr-angle-small-down',
};

const SidebarIcon = ({ className, slot }: { className: string; slot?: string }) => (
  <loom-icon size="mini" {...(slot ? { slot } : {})}>
    <i className={className} aria-hidden="true" />
  </loom-icon>
);

const MenuIcon = () => (
  <loom-icon size="mini">
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 3)">
        <path d="m.5 12.5v-10c0-1.1045695.8954305-2 2-2h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2z" />
        <path d="m2.5 12.5v-10c0-1.1045695.8954305-2 2-2h-2c-1 0-2 .8954305-2 2v10c0 1.1045695 1 2 2 2h2c-1.1045695 0-2-.8954305-2-2z" fill="currentColor" />
        <path d="m7.5 10.5-3-3 3-3" />
        <path d="m12.5 7.5h-8" />
      </g>
    </svg>
  </loom-icon>
);

const CollapseButton = () => (
  <loom-icon-button slot="header" data-sidebar-toggle variant="ghost" size="sm" aria-label="Alternar navegación">
    <MenuIcon />
  </loom-icon-button>
);

const SampleNav = ({ collapsed }: { collapsed: boolean }) => (
  <loom-sidebar
    collapsed={collapsed ? '' : undefined}
    label="Navegación principal"
    logo-src={kyndrylRed}
    compact-logo-src={kyndrylKRed}
    logo-alt="Kyndryl"
    data-testid="sidebar"
  >
    <CollapseButton />

    <loom-sidebar-item item-id="dashboard" label="Dashboard" selected>
      <SidebarIcon slot="icon" className={ICONS.dashboard} />
    </loom-sidebar-item>
    <loom-sidebar-item item-id="inventario" label="Inventario">
      <SidebarIcon slot="icon" className={ICONS.book} />
    </loom-sidebar-item>
    <loom-sidebar-group group-id="label" label="Label">
      <SidebarIcon slot="icon" className={ICONS.book} />
      <SidebarIcon slot="chevron" className={ICONS.chevron} />
      <loom-sidebar-subitem item-id="sub-1" label="Subitem 1" />
      <loom-sidebar-subitem item-id="sub-2" label="Subitem 2" selected />
      <loom-sidebar-subitem item-id="sub-3" label="Subitem 3" />
    </loom-sidebar-group>
    <loom-sidebar-item item-id="kb" label="Base de Conocimiento" />

    <loom-sidebar-item slot="footer" item-id="settings" label="Configuración y ayuda">
      <SidebarIcon slot="icon" className={ICONS.cog} />
    </loom-sidebar-item>
  </loom-sidebar>
);

/* ------------------------------------------------------------------ */

const meta = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  args: {
    collapsed: false,
  },
  argTypes: {
    collapsed: { control: 'boolean', description: 'Modo rail icon-only (96px) vs expandido (320px).' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Familia composición-first de navegación lateral. \`loom-sidebar\` posee el ancho (expandido/colapsado),
la selección single, el roving por teclado y reparte el estado \`collapsed\` a los hijos. \`loom-sidebar-item\`,
\`loom-sidebar-group\` (expansión decoplada vía \`expanded\`) y \`loom-sidebar-subitem\` son piezas composables.

\`\`\`html
<loom-sidebar
  label="Navegación principal"
  logo-src="/brand/kyndryl_red.png"
  compact-logo-src="/brand/kyndryl_k_red.png"
  logo-alt="Kyndryl"
>
  <loom-icon-button slot="header" data-sidebar-toggle variant="ghost" size="sm" aria-label="Alternar navegación">
    <loom-icon size="mini">
      <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)">
          <path d="m.5 12.5v-10c0-1.1045695.8954305-2 2-2h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2z"></path>
          <path d="m2.5 12.5v-10c0-1.1045695.8954305-2 2-2h-2c-1 0-2 .8954305-2 2v10c0 1.1045695 1 2 2 2h2c-1.1045695 0-2-.8954305-2-2z" fill="currentColor"></path>
          <path d="m7.5 10.5-3-3 3-3"></path>
          <path d="m12.5 7.5h-8"></path>
        </g>
      </svg>
    </loom-icon>
  </loom-icon-button>
  <loom-sidebar-item item-id="dashboard" label="Dashboard" selected>
    <loom-icon slot="icon" size="mini"><i class="fi fi-rr-home" aria-hidden="true"></i></loom-icon>
  </loom-sidebar-item>
  <loom-sidebar-group group-id="label" label="Label">
    <loom-icon slot="icon" size="mini"><i class="fi fi-rr-book-alt" aria-hidden="true"></i></loom-icon>
    <loom-icon slot="chevron" size="mini"><i class="fi fi-rr-angle-small-down" aria-hidden="true"></i></loom-icon>
    <loom-sidebar-subitem item-id="s1" label="Subitem 1"></loom-sidebar-subitem>
  </loom-sidebar-group>
  <loom-sidebar-item slot="footer" item-id="settings" label="Configuración">
    <loom-icon slot="icon" size="mini"><i class="fi fi-rr-settings" aria-hidden="true"></i></loom-icon>
  </loom-sidebar-item>
</loom-sidebar>
\`\`\`

Eventos: \`loom-sidebar-toggle\`, \`loom-sidebar-select\`, \`loom-sidebar-item-click\`,
\`loom-sidebar-item-select\`, \`loom-sidebar-group-toggle\`. Parts: \`header\`, \`logo\`, \`divider\`, \`nav\`, \`footer\`,
y en cada fila \`box\`, \`indicator\`, \`label\`, \`icon\`, \`chevron\`, \`options\`, \`connector\`.
Un \`loom-icon-button[data-sidebar-toggle]\` dentro del header alterna el modo colapsado.
        `.trim(),
      },
    },
  },
} satisfies Meta<SidebarStoryArgs>;

export default meta;
type Story = StoryObj<SidebarStoryArgs>;

export const Expanded: Story = {
  render: ({ collapsed }) => (
    <Frame>
      <SampleNav collapsed={collapsed} />
    </Frame>
  ),
};

export const Collapsed: Story = {
  args: { collapsed: true },
  parameters: {
    docs: { description: { story: 'Modo rail (96px): solo iconos, labels ocultos expuestos como `aria-label`/`title`.' } },
  },
  render: ({ collapsed }) => (
    <Frame>
      <SampleNav collapsed={collapsed} />
    </Frame>
  ),
};

export const SelectionAndExpansion: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Selección single (un solo activo) y expansión de grupo decoplada de la selección.' } },
  },
  render: () => (
    <Frame>
      <SampleNav collapsed={false} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const within_ = within(canvasElement);
    const sidebar = within_.getByTestId('sidebar');

    const logo = sidebar.shadowRoot?.querySelector<HTMLImageElement>('[part="logo"]');
    const toggle = sidebar.querySelector<HTMLElementTagNameMap['loom-icon-button']>('[data-sidebar-toggle]');
    if (!logo || !toggle) throw new Error('Sidebar logo or toggle not found');

    await waitFor(() => expect(logo).toHaveAttribute('src', expect.stringContaining('kyndryl_red')));
    await userEvent.click(toggle);
    await expect(sidebar).toHaveAttribute('collapsed');
    await waitFor(() => expect(logo).toHaveAttribute('src', expect.stringContaining('kyndryl_k_red')));
    await userEvent.click(toggle);
    await expect(sidebar).not.toHaveAttribute('collapsed');

    const inventario = sidebar.querySelector<HTMLElementTagNameMap['loom-sidebar-item']>(
      'loom-sidebar-item[item-id="inventario"]',
    );
    const dashboard = sidebar.querySelector<HTMLElementTagNameMap['loom-sidebar-item']>(
      'loom-sidebar-item[item-id="dashboard"]',
    );
    const group = sidebar.querySelector<HTMLElementTagNameMap['loom-sidebar-group']>(
      'loom-sidebar-group[group-id="label"]',
    );
    if (!inventario || !dashboard || !group) throw new Error('Sidebar rows not found');

    // Single selection: clicking Inventario selects it and clears Dashboard.
    await userEvent.click(inventario);
    await expect(inventario).toHaveAttribute('selected');
    await expect(dashboard).not.toHaveAttribute('selected');
    await expect(inventario).toHaveAttribute('aria-current', 'page');

    // Group expansion is independent of selection.
    await expect(group).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(group);
    await expect(group).toHaveAttribute('aria-expanded', 'true');
    await expect(inventario).toHaveAttribute('selected');
  },
};

export const WebComponent: Story = {
  parameters: {
    docs: { description: { story: 'Uso directo del custom element `loom-sidebar` (HTML puro).' } },
  },
  render: () => (
    <Frame>
      <div
        style={{ display: 'flex', height: '100%' }}
        dangerouslySetInnerHTML={{
          __html: `
<loom-sidebar
  label="Navegación principal"
  logo-src="${kyndrylRed}"
  compact-logo-src="${kyndrylKRed}"
  logo-alt="Kyndryl"
  data-testid="sidebar-wc"
>
  <loom-icon-button slot="header" data-sidebar-toggle variant="ghost" size="sm" aria-label="Alternar navegación">
    <loom-icon size="mini">
      <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)">
          <path d="m.5 12.5v-10c0-1.1045695.8954305-2 2-2h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2z"></path>
          <path d="m2.5 12.5v-10c0-1.1045695.8954305-2 2-2h-2c-1 0-2 .8954305-2 2v10c0 1.1045695 1 2 2 2h2c-1.1045695 0-2-.8954305-2-2z" fill="currentColor"></path>
          <path d="m7.5 10.5-3-3 3-3"></path>
          <path d="m12.5 7.5h-8"></path>
        </g>
      </svg>
    </loom-icon>
  </loom-icon-button>
  <loom-sidebar-item item-id="dashboard" label="Dashboard" selected>
    <loom-icon slot="icon" size="mini"><i class="fi fi-rr-home" aria-hidden="true"></i></loom-icon>
  </loom-sidebar-item>
  <loom-sidebar-item item-id="inventario" label="Inventario">
    <loom-icon slot="icon" size="mini"><i class="fi fi-rr-book-alt" aria-hidden="true"></i></loom-icon>
  </loom-sidebar-item>
  <loom-sidebar-group group-id="label" label="Label" expanded>
    <loom-icon slot="icon" size="mini"><i class="fi fi-rr-book-alt" aria-hidden="true"></i></loom-icon>
    <loom-icon slot="chevron" size="mini"><i class="fi fi-rr-angle-small-down" aria-hidden="true"></i></loom-icon>
    <loom-sidebar-subitem item-id="s1" label="Subitem 1"></loom-sidebar-subitem>
    <loom-sidebar-subitem item-id="s2" label="Subitem 2" selected></loom-sidebar-subitem>
  </loom-sidebar-group>
</loom-sidebar>`,
        }}
      />
    </Frame>
  ),
};
