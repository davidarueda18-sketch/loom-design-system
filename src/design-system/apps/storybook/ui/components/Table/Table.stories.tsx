import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import '../../../../../package/ui/components/Table/adapters/Table.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableRow.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableCell.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableHeaderCell.element.ts';
import '../../../../../package/ui/components/Table/adapters/TableExpansion.element.ts';
import '../../../../../package/ui/components/Pagination/adapters/Pagination.element.ts';
import '../../../../../package/ui/primitives/Badge/adapters/Badge.element.ts';
import '../../../../../package/ui/primitives/Progress/adapters/ProgressLinear.element.ts';
import '../../../../../package/ui/primitives/Link/adapters/Link.element.ts';
import '../../../../../package/ui/primitives/Avatar/adapters/Avatar.element.ts';
import '../../../../../package/ui/primitives/Avatar/adapters/AvatarGroup.element.ts';
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

// ── TypedCells ───────────────────────────────────────────────────────────────

export const TypedCells: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Celdas tipadas: `variant="default"`, `"key-value"`, `"state"`, `"progress"`. El `variant="team"` se ve en la story **TeamColumn**.' },
    },
  },
  render: () => (
    <loom-table columns="minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)">
      <loom-table-row header>
        <loom-table-header-cell>Iniciativa</loom-table-header-cell>
        <loom-table-header-cell>Responsable</loom-table-header-cell>
        <loom-table-header-cell>Fechas</loom-table-header-cell>
        <loom-table-header-cell>Estado</loom-table-header-cell>
      </loom-table-row>
      <loom-table-row row-id="r1" interactive>
        <loom-table-cell
          variant="default"
          label="Migración de infraestructura cloud"
          description="Mover todos los servicios legacy a AWS EKS con Terraform."
          badge-label="PoC"
          badge-state="info"
        />
        <loom-table-cell
          variant="key-value"
          cell-key="Responsable:"
          label="David Rueda"
          description-key="Creación:"
          description="15/01/2024"
        />
        <loom-table-cell
          variant="progress"
          start-date="2024-01-01"
          target-date="2024-06-30"
        />
        <loom-table-cell
          variant="state"
          badge-state="success"
          label="Activo"
        />
      </loom-table-row>
      <loom-table-row row-id="r2" interactive>
        <loom-table-cell
          variant="default"
          label="Portal de analítica"
          description="Dashboard ejecutivo con Power BI Embedded."
        />
        <loom-table-cell
          variant="key-value"
          cell-key="Responsable:"
          label="Ana Gómez"
          description-key="Creación:"
          description="20/03/2024"
          show-progress
          progress-value="65"
        />
        <loom-table-cell
          variant="progress"
          start-date="2024-03-01"
          target-date="2024-09-01"
        />
        <loom-table-cell
          variant="state"
          badge-state="warning"
          label="En revisión"
        />
      </loom-table-row>
    </loom-table>
  ),
};

// ── Striped ──────────────────────────────────────────────────────────────────

export const Striped: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Filas alternas con fondo `rowBgAlt` activado con el atributo `striped`. Las filas hijas (nivel > 0) no reciben el zebra.' } },
  },
  render: () => (
    <loom-table striped hoverable columns="minmax(0,2fr) minmax(0,1fr) 1fr">
      <loom-table-row header>
        <loom-table-header-cell>Servicio</loom-table-header-cell>
        <loom-table-header-cell>Responsable</loom-table-header-cell>
        <loom-table-header-cell>Estado</loom-table-header-cell>
      </loom-table-row>
      {ASSETS.map((asset) => (
        <loom-table-row key={asset.id} row-id={asset.id}>
          <loom-table-cell mobile-label="Servicio">{asset.name}</loom-table-cell>
          <loom-table-cell mobile-label="Responsable">{asset.owner}</loom-table-cell>
          <loom-table-cell mobile-label="Estado">
            <loom-badge slot="leading" state={asset.status === 'Activo' ? 'success' : 'warning'} label={asset.status} />
          </loom-table-cell>
        </loom-table-row>
      ))}
    </loom-table>
  ),
};

// ── TreeExpansion ─────────────────────────────────────────────────────────────

export const TreeExpansion: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Árbol de 3 niveles: iniciativa → historia de usuario → tarea. Cada nivel tiene `level` e `accent` distintos. El consumidor controla el estado de expansión.',
      },
    },
  },
  render: () => (
    <loom-table expandable striped columns="44px minmax(0,2fr) minmax(0,1fr) 1fr">
      <loom-table-row header>
        <loom-table-header-cell></loom-table-header-cell>
        <loom-table-header-cell>Elemento</loom-table-header-cell>
        <loom-table-header-cell>Asignado</loom-table-header-cell>
        <loom-table-header-cell>Estado</loom-table-header-cell>
      </loom-table-row>

      {/* Iniciativa */}
      <loom-table-row row-id="ini-1" expandable expanded>
        <loom-table-cell></loom-table-cell>
        <loom-table-cell variant="default" label="Migración cloud" description="AWS EKS + Terraform" badge-label="Delivery" badge-state="info" />
        <loom-table-cell>Plataforma</loom-table-cell>
        <loom-table-cell><loom-badge state="success" label="Activo" /></loom-table-cell>
      </loom-table-row>

      {/* Historia (level=1, accent=info) */}
      <loom-table-row row-id="us-1" level="1" accent="info" expandable expanded>
        <loom-table-cell></loom-table-cell>
        {/* padding-inline-start consume --loom-tree-row-indent set by the row */}
        <loom-table-cell style={{ paddingInlineStart: 'var(--loom-tree-row-indent, 0)' }} variant="default" label="Configurar cluster EKS" />
        <loom-table-cell>David R.</loom-table-cell>
        <loom-table-cell><loom-badge state="progress" label="En curso" /></loom-table-cell>
      </loom-table-row>

      {/* Tarea (level=2, accent=warning) */}
      <loom-table-row row-id="task-1" level="2" accent="warning">
        <loom-table-cell></loom-table-cell>
        <loom-table-cell style={{ paddingInlineStart: 'var(--loom-tree-row-indent, 0)' }} variant="key-value" cell-key="Tarea:" label="Setup IAM roles" show-progress progress-value="80" />
        <loom-table-cell>David R.</loom-table-cell>
        <loom-table-cell><loom-badge state="success" label="Hecho" /></loom-table-cell>
      </loom-table-row>

      <loom-table-row row-id="task-2" level="2" accent="warning">
        <loom-table-cell></loom-table-cell>
        <loom-table-cell style={{ paddingInlineStart: 'var(--loom-tree-row-indent, 0)' }} variant="key-value" cell-key="Tarea:" label="Configurar VPC" show-progress progress-value="40" />
        <loom-table-cell>Ana G.</loom-table-cell>
        <loom-table-cell><loom-badge state="progress" label="En curso" /></loom-table-cell>
      </loom-table-row>
    </loom-table>
  ),
};

// ── TeamColumn ───────────────────────────────────────────────────────────────

export const TeamColumn: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Columna `variant="team"` con `leader-label` y cluster de avatares con `loom-avatar-group`.' } },
  },
  render: () => (
    <loom-table columns="minmax(0,2fr) minmax(0,1fr) minmax(0,1.2fr) 1fr">
      <loom-table-row header>
        <loom-table-header-cell>Iniciativa</loom-table-header-cell>
        <loom-table-header-cell>Estado</loom-table-header-cell>
        <loom-table-header-cell>Equipo</loom-table-header-cell>
        <loom-table-header-cell>Fechas</loom-table-header-cell>
      </loom-table-row>
      <loom-table-row row-id="t1" interactive>
        <loom-table-cell variant="default" label="Migración cloud" description="AWS EKS + Terraform" />
        <loom-table-cell><loom-badge state="success" label="Activo" /></loom-table-cell>
        <loom-table-cell variant="team" leader-label="Lider: David Rueda">
          <loom-avatar-group max="4">
            <loom-avatar name="David Rueda" email="david@test.com" size="sm" />
            <loom-avatar name="Ana Gómez" email="ana@test.com" size="sm" />
            <loom-avatar name="Carlos López" email="carlos@test.com" size="sm" />
            <loom-avatar name="María Torres" email="maria@test.com" size="sm" />
            <loom-avatar name="Juan Pérez" email="juan@test.com" size="sm" />
          </loom-avatar-group>
        </loom-table-cell>
        <loom-table-cell variant="progress" start-date="2024-01-01" target-date="2024-06-30" />
      </loom-table-row>
      <loom-table-row row-id="t2" interactive>
        <loom-table-cell variant="default" label="Portal analítica" description="Power BI Embedded" />
        <loom-table-cell><loom-badge state="warning" label="Revisión" /></loom-table-cell>
        <loom-table-cell variant="team" leader-label="Lider: Ana Gómez">
          <loom-avatar-group max="3">
            <loom-avatar name="Ana Gómez" email="ana@test.com" size="sm" />
            <loom-avatar name="Luis Mora" email="luis@test.com" size="sm" />
          </loom-avatar-group>
        </loom-table-cell>
        <loom-table-cell variant="progress" start-date="2024-03-01" target-date="2024-09-01" />
      </loom-table-row>
    </loom-table>
  ),
};

// ── MobileCards ───────────────────────────────────────────────────────────────

export const MobileCards: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Redimensiona a menos de 640px para ver las cards. `mobile-layout="pairs"` convierte las celdas en grid 2 columnas. `mobile-order` reordena el badge de estado a la parte superior.' } },
  },
  render: () => (
    <loom-table mobile-layout="pairs" layout="auto" columns="minmax(0,2fr) minmax(0,1fr) 1fr 1fr">
      <loom-table-row header>
        <loom-table-header-cell>Iniciativa</loom-table-header-cell>
        <loom-table-header-cell>Responsable</loom-table-header-cell>
        <loom-table-header-cell>Fechas</loom-table-header-cell>
        <loom-table-header-cell>Estado</loom-table-header-cell>
      </loom-table-row>
      {ASSETS.map((asset) => (
        <loom-table-row key={asset.id} row-id={asset.id} mobile-layout="pairs">
          {/* Estado arriba (order:1) y a la derecha */}
          <loom-table-cell mobile-order="1" mobile-span="full" mobile-align="end">
            <loom-badge state={asset.status === 'Activo' ? 'success' : 'warning'} label={asset.status} />
          </loom-table-cell>
          {/* Nombre ocupa el ancho completo (order:2) */}
          <loom-table-cell mobile-order="2" mobile-span="full" mobile-label="Iniciativa">
            {asset.name}
          </loom-table-cell>
          {/* Responsable y fechas en pares */}
          <loom-table-cell mobile-order="3" mobile-label="Responsable">{asset.owner}</loom-table-cell>
          <loom-table-cell mobile-order="4" mobile-label="Riesgo">{asset.risk}</loom-table-cell>
        </loom-table-row>
      ))}
    </loom-table>
  ),
};
