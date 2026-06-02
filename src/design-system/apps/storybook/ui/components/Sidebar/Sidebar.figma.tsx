import figma from '@figma/code-connect';
import {
  Sidebar,
  SidebarItem,
  SidebarGroup,
  SidebarSubitem,
} from '../../../../../package/ui/components/Sidebar/index.ts';
import '../../../loom-web-components.d.ts';

const FILE = 'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System';

const ITEM_ICON_SVG = (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 3.5C2 2.67 2.67 2 3.5 2h9c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-9C2.67 14 2 13.33 2 12.5v-9z" fill="none" stroke="currentColor" />
    <path d="M5 6h6M5 8h6M5 10h4" fill="none" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const CHEVRON_ICON_SVG = (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 6.5 8 10l3.5-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── SidebarItem — leaf nav item (node 65:932, type=Item, Show icon=True) ─ */
figma.connect(SidebarItem, `${FILE}?node-id=65-932`, {
  variant: { type: 'Item', 'Show icon': true },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    label: figma.string('Label'),
    selected: figma.enum('Selected', { Selected: true }),
    disabled: figma.enum('State', { Disable: true }),
  },
  example: ({ label, selected, disabled }) => (
    <loom-sidebar-item label={label} selected={selected} disabled={disabled}>
      <loom-icon slot="icon" size="mini">{ITEM_ICON_SVG}</loom-icon>
    </loom-sidebar-item>
  ),
});

figma.connect(SidebarItem, `${FILE}?node-id=65-932`, {
  variant: { type: 'Item', 'Show icon': false },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    label: figma.string('Label'),
    selected: figma.enum('Selected', { Selected: true }),
    disabled: figma.enum('State', { Disable: true }),
  },
  example: ({ label, selected, disabled }) => (
    <loom-sidebar-item label={label} selected={selected} disabled={disabled} />
  ),
});

/* ── SidebarSubitem — child of a group (node 65:932, type=Subitem) ──────── */
figma.connect(SidebarSubitem, `${FILE}?node-id=65-932`, {
  variant: { type: 'Subitem' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    label: figma.string('Label'),
    selected: figma.enum('Selected', { Selected: true }),
    disabled: figma.enum('State', { Disable: true }),
  },
  example: ({ label, selected, disabled }) => (
    <loom-sidebar-subitem label={label} selected={selected} disabled={disabled} />
  ),
});

/* ── SidebarGroup — expandable group (node 273:1947, Show icon=True) ────── */
figma.connect(SidebarGroup, `${FILE}?node-id=273-1947`, {
  variant: { 'Show icon': true },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    label: figma.string('Label'),
    selected: figma.enum('Selected', { Selected: true }),
    expanded: figma.enum('Expanded', { True: true }),
    disabled: figma.enum('State', { Disable: true }),
  },
  example: ({ label, selected, expanded, disabled }) => (
    <loom-sidebar-group
      label={label}
      selected={selected}
      expanded={expanded}
      disabled={disabled}
    >
      <loom-icon slot="icon" size="mini">{ITEM_ICON_SVG}</loom-icon>
      <loom-icon slot="chevron" size="mini">{CHEVRON_ICON_SVG}</loom-icon>
      <loom-sidebar-subitem label="Subitem 1" />
      <loom-sidebar-subitem label="Subitem 2" />
    </loom-sidebar-group>
  ),
});

figma.connect(SidebarGroup, `${FILE}?node-id=273-1947`, {
  variant: { 'Show icon': false },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    label: figma.string('Label'),
    selected: figma.enum('Selected', { Selected: true }),
    expanded: figma.enum('Expanded', { True: true }),
    disabled: figma.enum('State', { Disable: true }),
  },
  example: ({ label, selected, expanded, disabled }) => (
    <loom-sidebar-group
      label={label}
      selected={selected}
      expanded={expanded}
      disabled={disabled}
    >
      <loom-icon slot="chevron" size="mini">{CHEVRON_ICON_SVG}</loom-icon>
      <loom-sidebar-subitem label="Subitem 1" />
      <loom-sidebar-subitem label="Subitem 2" />
    </loom-sidebar-group>
  ),
});

/* ── Sidebar — container (node 65:984; Modal Open → collapsed) ──────────── */
figma.connect(Sidebar, `${FILE}?node-id=65-984`, {
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    // Modal Open=False → rail (collapsed); Modal Open=True → expanded (default, attribute omitted).
    collapsed: figma.enum('Modal Open', { False: true }),
  },
  example: ({ collapsed }) => (
    <loom-sidebar
      label="Navegación principal"
      collapsed={collapsed}
      logo-src="https://example.com/logo-full.svg"
      compact-logo-src="https://example.com/logo-compact.svg"
      logo-alt="Brand"
    >
      <loom-sidebar-item item-id="dashboard" label="Dashboard" selected>
        <loom-icon slot="icon" size="mini">{ITEM_ICON_SVG}</loom-icon>
      </loom-sidebar-item>
      <loom-sidebar-group group-id="label" label="Label">
        <loom-icon slot="icon" size="mini">{ITEM_ICON_SVG}</loom-icon>
        <loom-icon slot="chevron" size="mini">{CHEVRON_ICON_SVG}</loom-icon>
        <loom-sidebar-subitem item-id="s1" label="Subitem 1" />
      </loom-sidebar-group>
      <loom-sidebar-item slot="footer" item-id="settings" label="Configuración y ayuda">
        <loom-icon slot="icon" size="mini">{ITEM_ICON_SVG}</loom-icon>
      </loom-sidebar-item>
    </loom-sidebar>
  ),
});
