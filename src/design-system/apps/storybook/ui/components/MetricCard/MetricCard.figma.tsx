import figma from '@figma/code-connect';
import { MetricCard } from '../../../../../package/ui/components/MetricCard/index.ts';
import '../../../loom-web-components.d.ts';

const METRIC_CARD_FIGMA_NODE = 'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=65-445';

figma.connect(
  MetricCard,
  METRIC_CARD_FIGMA_NODE,
  {
    variant: { type: 'Default' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      title: figma.string('title'),
      content: figma.string('content'),
      tagValue: figma.string('tagValue'),
      showTag: figma.boolean('showTag', {
        true: true,
        false: undefined,
      }),
      showAdditionalDescription: figma.boolean('showAditionalDescription', {
        true: true,
        false: undefined,
      }),
      showCallToAction: figma.boolean('showCallToAction', {
        true: true,
        false: undefined,
      }),
    },
    example: ({ title, content, showTag, tagValue, showAdditionalDescription, showCallToAction }) => (
      <loom-metric-card
        title={title}
        metric={content}
        description="Vulnerabilidades se encuentran retenidas por su impacto"
      >
        {showTag ? <loom-tag slot="tag" value="positive" label={tagValue} show-icon="true" /> : undefined}
        {showAdditionalDescription ? <p slot="footer">Additional description</p> : undefined}
        {showCallToAction ? <loom-link slot="action" href="#">Call To Action</loom-link> : undefined}
      </loom-metric-card>
    ),
  },
);

figma.connect(
  MetricCard,
  METRIC_CARD_FIGMA_NODE,
  {
    variant: { type: 'Multiple' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      title: figma.string('title'),
      showAdditionalDescription: figma.boolean('showAditionalDescription', {
        true: true,
        false: undefined,
      }),
      showCallToAction: figma.boolean('showCallToAction', {
        true: true,
        false: undefined,
      }),
    },
    example: ({ title, showAdditionalDescription, showCallToAction }) => (
      <loom-metric-card title={title}>
        <loom-stack gap="xs">
          <loom-inline align="baseline" gap="xs"><span>Alta:</span> <strong>32.4 seg</strong> <small>(12)</small></loom-inline>
          <loom-inline align="baseline" gap="xs"><span>Media:</span> <strong>27.1 seg</strong> <small>(119)</small></loom-inline>
          <loom-inline align="baseline" gap="xs"><span>Baja:</span> <strong>10.4 seg</strong> <small>(321)</small></loom-inline>
        </loom-stack>
        {showAdditionalDescription ? <p slot="footer">Additional description</p> : undefined}
        {showCallToAction ? <loom-link slot="action" href="#">Call To Action</loom-link> : undefined}
      </loom-metric-card>
    ),
  },
);

figma.connect(
  MetricCard,
  METRIC_CARD_FIGMA_NODE,
  {
    variant: { type: 'Dynamic' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      title: figma.string('title'),
      showAdditionalDescription: figma.boolean('showAditionalDescription', {
        true: true,
        false: undefined,
      }),
      showCallToAction: figma.boolean('showCallToAction', {
        true: true,
        false: undefined,
      }),
    },
    example: ({ title, showAdditionalDescription, showCallToAction }) => (
      <loom-metric-card title={title}>
        <loom-box></loom-box>
        {showAdditionalDescription ? <p slot="footer">Additional description</p> : undefined}
        {showCallToAction ? <loom-link slot="action" href="#">Call To Action</loom-link> : undefined}
      </loom-metric-card>
    ),
  },
);