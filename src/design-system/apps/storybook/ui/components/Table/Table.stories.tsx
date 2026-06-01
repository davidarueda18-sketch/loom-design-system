import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import '../../../../../package/ui/components/Table/adapters/Table.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableRow.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableCell.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableHeaderCell.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableExpansion.element.ts';
import '../../../../../package/ui/components/Pagination/adapters/Pagination.element.ts';
import '../../../../../package/ui/primitives/Badge/adapters/Badge.element.ts';
import '../../../../../package/ui/primitives/Link/adapters/Link.element.ts';
import '../../../loom-web-components.d.ts';

import {
  TABLE_SELECTABLE_MODES,
  TABLE_DENSITIES,
  TABLE_LAYOUTS,
} from '../../../../../package/ui/components/Table/Table.types.ts';

interface TableStoryArgs {
  selectable: (typeof TABLE_SELECTABLE_MODES)[number];
  density: (typeof TABLE_DENSITIES)[number];
  layout: (typeof TABLE_LAYOUTS)[number];
}

interface Asset {
  id: string;
  name: string;
  owner: string;
  status: string;
  risk: string;
}

const ASSETS: Asset[] = [
  { id: 'a1', name: 'api-gateway', owner: 'Plataforma', status: 'Activo', risk: '12' },
  { id: 'a2', name: 'auth-service', owner: 'Identidad', status: 'Degradado', risk: '47' },
  { id: 'a3', name: 'billing-db', owner: 'Finanzas', status: 'Activo', risk: '3' },
  { id: 'a4', name: 'edge-cdn', owner: 'Plataforma', status: 'Activo', risk: '21' },
];

const HeaderRow = () => (
  <loom-table-row header>
    <loom-table-header-cell>Servicio</loom-table-header-cell>
    <loom-table-header-cell>Responsable</loom-table-header-cell>
    <loom-table-header-cell>Estado</loom-table-header-cell>
    <loom-table-header-cell numeric sort="none" column-id="risk">Riesgo</loom-table-header-cell>
  </loom-table-row>
);

const DataRow = ({ asset }: { asset: Asset }) => (
  <loom-table-row row-id={asset.id}>
    <loom-table-cell mobile-label="Servicio"><p className="loom-body-md">{asset.name}</p></loom-table-cell>
    <loom-table-cell mobile-label="Responsable">{asset.owner}</loom-table-cell>
    <loom-table-cell mobile-label="Estado">
      <loom-badge slot="leading" state={asset.status === 'Activo' ? 'success' : 'warning'} label={asset.status} />
    </loom-table-cell>
    <loom-table-cell numeric mobile-label="Riesgo">{asset.risk}</loom-table-cell>
  </loom-table-row>
);

const meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  args: {
    selectable: 'none',
    density: 'comfortable',
    layout: 'auto',
  },
  argTypes: {
    selectable: { control: 'inline-radio', options: [...TABLE_SELECTABLE_MODES], description: 'Modo de selección de filas.' },
    density: { control: 'inline-radio', options: [...TABLE_DENSITIES], description: 'Densidad vertical de las celdas.' },
    layout: { control: 'inline-radio', options: [...TABLE_LAYOUTS], description: 'Estrategia responsive: auto (container query), scroll o stacked.' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Familia composición-first de tabla. \`loom-table\` posee el grid (alineación de columnas por CSS Grid +
subgrid en las filas), la semántica ARIA, la selección agregada y el modo responsive. \`loom-table-row\`,
\`loom-table-cell\`, \`loom-table-header-cell\` y \`loom-table-expansion\` son piezas composables.
\`loom-pagination\` vive como componente separado y se coordina por eventos.

\`\`\`html
<loom-table selectable="multiple" expandable>
  <loom-table-row header>
    <loom-table-header-cell>Servicio</loom-table-header-cell>
    <loom-table-header-cell numeric sort="none" column-id="risk">Riesgo</loom-table-header-cell>
  </loom-table-row>
  <loom-table-row row-id="a1" expandable>
    <loom-table-cell>api-gateway</loom-table-cell>
    <loom-table-cell numeric>12</loom-table-cell>
    <loom-table-expansion>Detalle…</loom-table-expansion>
  </loom-table-row>
</loom-table>
\`\`\`

Eventos: \`loom-table-selection-change\`, \`loom-table-row-toggle\`, \`loom-table-row-click\`,
\`loom-table-sort-change\`. Parts: \`scroll-container\`, \`table\`, \`empty\`, \`loading\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<TableStoryArgs>;

export const Default: Story = {
  render: ({ selectable, density, layout }) => (
    <loom-table selectable={selectable} density={density} layout={layout}>
      <HeaderRow />
      {ASSETS.map((asset) => (
        <DataRow key={asset.id} asset={asset} />
      ))}
    </loom-table>
  ),
};

export const Selectable: Story = {
  args: { selectable: 'multiple' },
  parameters: {
    docs: { description: { story: 'Selección múltiple con checkbox por fila y select-all (indeterminado) en la cabecera.' } },
  },
  render: ({ density, layout }) => (
    <loom-table selectable="multiple" density={density} layout={layout}>
      <HeaderRow />
      {ASSETS.map((asset) => (
        <DataRow key={asset.id} asset={asset} />
      ))}
    </loom-table>
  ),
};

export const Expandable: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Filas expandibles tipo accordion. El toggle expone `aria-expanded`/`aria-controls`.' } },
  },
  render: () => (
    <loom-table expandable>
      <HeaderRow />
      {ASSETS.map((asset) => (
        <loom-table-row key={asset.id} row-id={asset.id} expandable>
          <loom-table-cell mobile-label="Servicio">{asset.name}</loom-table-cell>
          <loom-table-cell mobile-label="Responsable">{asset.owner}</loom-table-cell>
          <loom-table-cell mobile-label="Estado">{asset.status}</loom-table-cell>
          <loom-table-cell numeric mobile-label="Riesgo">{asset.risk}</loom-table-cell>
          <loom-table-expansion>
            <p className="loom-body-sm">
              Detalle de <strong>{asset.name}</strong>: responsable {asset.owner}, índice de riesgo {asset.risk}.
            </p>
          </loom-table-expansion>
        </loom-table-row>
      ))}
    </loom-table>
  ),
};

export const Interactive: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Filas con click de fila (`interactive`). Un click sobre un control interno no dispara el click de fila.' } },
  },
  render: () => (
    <loom-table>
      <HeaderRow />
      {ASSETS.map((asset) => (
        <loom-table-row key={asset.id} row-id={asset.id} interactive>
          <loom-table-cell mobile-label="Servicio">{asset.name}</loom-table-cell>
          <loom-table-cell mobile-label="Responsable">{asset.owner}</loom-table-cell>
          <loom-table-cell mobile-label="Estado">{asset.status}</loom-table-cell>
          <loom-table-cell numeric mobile-label="Riesgo">
            <loom-link slot="trailing" href="#" data-row-interactive-zone>Ver</loom-link>
          </loom-table-cell>
        </loom-table-row>
      ))}
    </loom-table>
  ),
};

export const WithPagination: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '`loom-pagination` separado, coordinado por el consumidor. Pensado para ir pegado al borde inferior del card.' } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 0 }}>
      <loom-table>
        <HeaderRow />
        {ASSETS.map((asset) => (
          <DataRow key={asset.id} asset={asset} />
        ))}
      </loom-table>
      <loom-pagination page={1} page-size={10} total-items={48} page-size-options="10,25,50">
        <span slot="summary">Mostrando del 1 al 10 de 48 resultados</span>
      </loom-pagination>
    </div>
  ),
};

export const WebComponent: Story = {
  parameters: {
    docs: { description: { story: 'Uso directo del custom element `loom-table` con selección múltiple.' } },
  },
  render: () => (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<loom-table data-testid="table-wc" selectable="multiple">
  <loom-table-row header>
    <loom-table-header-cell>Servicio</loom-table-header-cell>
    <loom-table-header-cell numeric>Riesgo</loom-table-header-cell>
  </loom-table-row>
  <loom-table-row row-id="a1">
    <loom-table-cell>api-gateway</loom-table-cell>
    <loom-table-cell numeric>12</loom-table-cell>
  </loom-table-row>
  <loom-table-row row-id="a2">
    <loom-table-cell>auth-service</loom-table-cell>
    <loom-table-cell numeric>47</loom-table-cell>
  </loom-table-row>
</loom-table>
        `.trim(),
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId('table-wc') as HTMLElementTagNameMap['loom-table'];
    await expect(table).toBeTruthy();
    await expect(table.selectable).toBe('multiple');
    const rows = table.querySelectorAll('loom-table-row');
    await expect(rows.length).toBe(3);
    const grid = table.shadowRoot?.querySelector('[part="table"]');
    await expect(grid?.getAttribute('role')).toBe('table');
  },
};
