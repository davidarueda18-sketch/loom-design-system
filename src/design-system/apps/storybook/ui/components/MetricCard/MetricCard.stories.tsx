import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import '../../../../../package/ui/components/MetricCard/adapters/MetricCard.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Link/adapters/Link.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../../../package/ui/primitives/Tag/adapters/Tag.element.ts';
import '../../../loom-web-components.d.ts';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import { fontFamilyVars } from '../../../../../package/tokens/fontFamily/index.ts';

interface MetricCardStoryArgs {
  title: string;
  metric: string;
  description: string;
  tagLabel: string;
  footerText: string;
  ctaLabel: string;
  ctaHref: string;
}

const MetricCardStoryStyles = () => (
  <style>{`
    .metric-card-showcase {
      align-items: stretch;
      font-family: ${fontFamilyVars.sans};
    }

    .metric-tag {
      align-self: start;
    }

    .severity-list {
      display: grid;
      gap: 6px;
      min-height: 72px;
      align-content: center;
    }

    .severity-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin: 0;
      color: ${colorVars.textPrimary};
      font-family: ${fontFamilyVars.sans};
    }

    .severity-label {
      font-size: 18px;
      font-weight: 400;
      line-height: 1;
    }

    .severity-value {
      font-size: 20px;
      font-weight: 700;
      line-height: 1;
    }

    .severity-count {
      margin-left: 6px;
      font-size: 11px;
      font-weight: 400;
      color: ${colorVars.textSecondary};
    }

    .severity-high { color: ${colorVars.feedbackDanger}; }
    .severity-medium { color: ${colorVars.feedbackDanger}; }
    .severity-low { color: ${colorVars.feedbackWarning}; }

    .empty-metric-space {
      min-height: 72px;
    }

    .metric-footer {
      color: ${colorVars.textSecondary};
    }

    .metric-action {
      color: ${colorVars.brandAccent};
      text-decoration: underline;
    }

    .description-width-showcase {
      align-items: stretch;
      max-width: 720px;
    }

    .description-width-custom-property {
      --loom-metric-card-description-max-width: 112px;
    }

    .description-width-part-demo loom-metric-card::part(description) {
      max-width: 144px;
      color: ${colorVars.textSecondary};
    }
  `}</style>
);

const TrendTag = ({ label }: { label: string }) => (
  <loom-tag className="metric-tag" slot="tag" value="positive" label={label} show-icon="true" />
);

const Footer = ({ footerText, ctaLabel, ctaHref }: Pick<MetricCardStoryArgs, 'footerText' | 'ctaLabel' | 'ctaHref'>) => (
  <>
    <p className="metric-footer" slot="footer">{footerText}</p>
    <loom-link className="metric-action" slot="action" href={ctaHref} underline="always">{ctaLabel}</loom-link>
  </>
);

const getMetricCard = (canvasElement: HTMLElement, testId: string): HTMLElementTagNameMap['loom-metric-card'] => {
  const canvas = within(canvasElement);
  const card = canvas.getByTestId(testId);
  if (!(card instanceof HTMLElement)) {
    throw new Error(`Expected ${testId} to resolve to a loom-metric-card host.`);
  }
  return card as HTMLElementTagNameMap['loom-metric-card'];
};

const getMetricCardDescription = (card: HTMLElementTagNameMap['loom-metric-card']): HTMLParagraphElement => {
  const description = card.shadowRoot?.querySelector<HTMLParagraphElement>('[part="description"]');
  if (!description) {
    throw new Error('Expected loom-metric-card to expose part="description".');
  }
  return description;
};

const meta = {
  title: 'Components/MetricCard',
  tags: ['autodocs'],
  args: {
    title: 'Crad Title',
    metric: '46%',
    description: 'Vulnerabilidades se encuentran retenidas por su impacto',
    tagLabel: '99%',
    footerText: 'Additional description',
    ctaLabel: 'Call To Action',
    ctaHref: '#',
  },
  argTypes: {
    title: { control: 'text', description: 'Título opcional del shell.' },
    metric: { control: 'text', description: 'Contenido de ejemplo para la story.' },
    description: { control: 'text', description: 'Texto de ejemplo para la story.' },
    tagLabel: { control: 'text', description: 'Contenido de ejemplo para el slot `tag`.' },
    footerText: { control: 'text', description: 'Contenido de ejemplo para el slot `footer`.' },
    ctaLabel: { control: 'text', description: 'Contenido de ejemplo para el slot `action`.' },
    ctaHref: { control: 'text', description: 'Href de ejemplo para el slot `action`.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Shell composable para KPIs de dashboard. El componente aporta superficie, header, footer y slots;
el consumidor define el contenido interno según su caso. La descripción estructurada ya no aplica
un ancho fijo interno: por defecto ocupa el track disponible del body y conserva el control externo
por CSS custom property o \`::part(description)\`.

\`\`\`html
<loom-metric-card
  title="Card Title"
  metric="46%"
  description="Vulnerabilidades se encuentran retenidas por su impacto"
>
  <loom-tag slot="tag" value="positive" label="99%" show-icon="true"></loom-tag>
  <p slot="footer">Additional description</p>
  <loom-link slot="action" href="#">Call To Action</loom-link>
</loom-metric-card>
\`\`\`

Para limitar el ancho sin romper el default fluido, define \`--loom-metric-card-description-max-width\` en el host:

\`\`\`css
loom-metric-card.compact-description {
  --loom-metric-card-description-max-width: 8rem;
}
\`\`\`

También puedes estilizar directamente la parte pública:

\`\`\`css
loom-metric-card::part(description) {
  max-width: 10rem;
}
\`\`\`

Slots: \`title\`, \`tag\`, default body, \`footer\`, \`action\`.
Parts: \`header\`, \`title\`, \`tag\`, \`body\`, \`content\`, \`metric\`, \`description\`, \`custom-body\`, \`footer\`, \`footer-content\`, \`action\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<MetricCardStoryArgs>;

export default meta;
type Story = StoryObj<MetricCardStoryArgs>;

export const Default: Story = {
  render: ({ title, metric, description, tagLabel, footerText, ctaLabel, ctaHref }) => (
    <>
      <MetricCardStoryStyles />
      <loom-metric-card title={title} metric={metric} description={description}>
        <TrendTag label={tagLabel} />
        <Footer footerText={footerText} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </loom-metric-card>
    </>
  ),
};

export const Recipes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Tres composiciones sobre el mismo shell: métrica con tag, filas de severidad y tarjeta con body vacío.',
      },
    },
  },
  render: () => (
    <>
      <MetricCardStoryStyles />
      <loom-inline className="metric-card-showcase" gap="smMd" align="stretch" wrap>
        <loom-metric-card
          title="Crad Title"
          metric="46%"
          description="Vulnerabilidades se encuentran retenidas por su impacto"
        >
          <TrendTag label="99%" />
          <Footer footerText="Additional description" ctaLabel="Call To Action" ctaHref="#" />
        </loom-metric-card>

        <loom-metric-card title="Crad Title">
          <loom-stack className="severity-list" gap="xs">
            <loom-inline className="severity-row" align="baseline" gap="xs">
              <span className="severity-label severity-high">Alta:</span>
              <span className="severity-value">32.4 seg</span>
              <span className="severity-count">(12)</span>
            </loom-inline>
            <loom-inline className="severity-row" align="baseline" gap="xs">
              <span className="severity-label severity-medium">Media:</span>
              <span className="severity-value">27.1 seg</span>
              <span className="severity-count">(119)</span>
            </loom-inline>
            <loom-inline className="severity-row" align="baseline" gap="xs">
              <span className="severity-label severity-low">Baja:</span>
              <span className="severity-value">10.4 seg</span>
              <span className="severity-count">(321)</span>
            </loom-inline>
          </loom-stack>
          <Footer footerText="Additional description" ctaLabel="Call To Action" ctaHref="#" />
        </loom-metric-card>

        <loom-metric-card title="Crad Title">
          <loom-box className="empty-metric-space" />
          <Footer footerText="Additional description" ctaLabel="Call To Action" ctaHref="#" />
        </loom-metric-card>
      </loom-inline>
    </>
  ),
};

export const CustomTitleSlot: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'El slot `title` permite que el consumidor controle completamente el contenido del encabezado.',
      },
    },
  },
  render: () => (
    <>
      <MetricCardStoryStyles />
      <loom-metric-card metric="247" description="Activos con vulnerabilidades críticas sin remediar.">
        <h3 slot="title">Crad Title</h3>
        <TrendTag label="99%" />
        <Footer footerText="Datos actualizados cada 24 horas" ctaLabel="Ver activos" ctaHref="#" />
      </loom-metric-card>
    </>
  ),
};

export const DescriptionWidth: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'La descripción usa el ancho disponible por defecto. La custom property pública limita el ancho de forma no-breaking y `::part(description)` mantiene el canal de estilado externo.',
      },
    },
  },
  render: () => (
    <>
      <MetricCardStoryStyles />
      <loom-inline className="description-width-showcase" gap="smMd" align="stretch" wrap>
        <loom-metric-card
          data-testid="metric-card-description-fluid"
          title="Default fluid"
          metric="46%"
          description="Descripción larga que debe ocupar el espacio disponible del body sin un max-width fijo heredado."
        >
          <TrendTag label="99%" />
          <Footer footerText="Additional description" ctaLabel="Call To Action" ctaHref="#" />
        </loom-metric-card>

        <loom-metric-card
          className="description-width-custom-property"
          data-testid="metric-card-description-custom-property"
          title="Custom property"
          metric="46%"
          description="Descripción larga limitada por una variable CSS pública definida en el host."
        >
          <TrendTag label="99%" />
          <Footer footerText="Additional description" ctaLabel="Call To Action" ctaHref="#" />
        </loom-metric-card>

        <loom-stack className="description-width-part-demo" gap="sm">
          <loom-metric-card
            data-testid="metric-card-description-part"
            title="Part override"
            metric="46%"
            description="Descripción larga limitada desde el selector público ::part(description)."
          >
            <TrendTag label="99%" />
            <Footer footerText="Additional description" ctaLabel="Call To Action" ctaHref="#" />
          </loom-metric-card>
        </loom-stack>
      </loom-inline>
    </>
  ),
  play: async ({ canvasElement }) => {
    const fluidCard = getMetricCard(canvasElement, 'metric-card-description-fluid');
    const customPropertyCard = getMetricCard(canvasElement, 'metric-card-description-custom-property');
    const partCard = getMetricCard(canvasElement, 'metric-card-description-part');

    const fluidDescription = getMetricCardDescription(fluidCard);
    const customPropertyDescription = getMetricCardDescription(customPropertyCard);
    const partDescription = getMetricCardDescription(partCard);

    await expect(getComputedStyle(fluidDescription).maxWidth).toBe('none');
    await expect(fluidDescription.getBoundingClientRect().width).toBeGreaterThan(132);
    await expect(getComputedStyle(customPropertyDescription).maxWidth).toBe('112px');
    await expect(customPropertyDescription.getBoundingClientRect().width).toBeLessThanOrEqual(112);
    await expect(getComputedStyle(partDescription).maxWidth).toBe('144px');
    await expect(partDescription.getBoundingClientRect().width).toBeLessThanOrEqual(144);
  },
};

export const WebComponent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Uso directo del custom element `loom-metric-card` con slots.',
      },
    },
  },
  render: () => (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<loom-metric-card
  data-testid="metric-card-wc"
  title="Incidentes activos"
  metric="42"
  description="Incidentes sin resolver en los últimos 7 días."
>
  <loom-tag slot="tag" value="positive" label="5%" show-icon="true"></loom-tag>
  <p slot="footer">Additional description</p>
  <loom-link slot="action" href="#">Call To Action</loom-link>
</loom-metric-card>
        `.trim(),
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId('metric-card-wc') as HTMLElementTagNameMap['loom-metric-card'];
    await expect(card).toBeTruthy();
    await expect(card.getAttribute('title')).toBe('Incidentes activos');
    await expect(card.getAttribute('metric')).toBe('42');
    await expect(card.getAttribute('description')).toBe('Incidentes sin resolver en los últimos 7 días.');
    await expect(card.querySelector('[slot="tag"]')?.getAttribute('label')).toBe('5%');
    await expect(card.querySelector('[slot="action"]')?.textContent).toBe('Call To Action');
  },
};