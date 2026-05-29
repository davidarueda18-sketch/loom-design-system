import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BellIcon, HeartIcon, StarIcon, BookmarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';
import { BellIcon as BellMini } from '@heroicons/react/20/solid';
import { BellIcon as BellMicro } from '@heroicons/react/16/solid';

import { Icon, ICON_SIZES } from '../../../../../package/ui/primitives/Icon/index.ts';
import type { IconColor, IconSize } from '../../../../../package/ui/primitives/Icon/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Button/adapters/Button.element.ts';
import '../../../../../package/ui/primitives/Icon/adapters/Icon.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../loom-web-components.d.ts';

const COLOR_OPTIONS = [
  'textPrimary',
  'textSecondary',
  'brandPrimary',
  'brandAccent',
  'feedbackSuccess',
  'feedbackWarning',
  'feedbackDanger',
  'feedbackInfo',
] as const;

interface IconStoryArgs {
  size?: IconSize;
  color?: IconColor;
  label?: string;
  children?: ReactNode;
}

interface IconWebComponentArgs {
  size?: IconSize;
  color?: IconColor;
  label?: string;
}

const meta = {
  title: 'Primitives/Icon',
  tags: ['autodocs'],
  args: {
    size: 'md',
    children: <BellIcon />,
  },
  argTypes: {
    size:  { control: 'select', options: ICON_SIZES },
    color: { control: 'select', options: [undefined, ...COLOR_OPTIONS] },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Wrapper agnóstico de íconos canónico como Web Component. Controla tamaño y color; el SVG se inyecta en el slot.

**Sin dependencias de librería de íconos en el bundle** — el DS no importa Heroicons ni ningún otro set. El consumidor pasa el SVG directamente y obtiene tree-shaking nativo.

\`\`\`html
import { BellIcon } from '@heroicons/react/24/outline';
<loom-icon size="md">
  <BellIcon />
</loom-icon>
\`\`\`

El wrapper React \`<Icon />\` renderiza internamente \`<loom-icon>\`.

El color se controla con la prop \`color\` (token semántico) o se hereda del padre vía \`currentColor\`.
Para íconos informativos, pasa \`label\` para activar \`role="img"\`; omítelo en íconos decorativos (\`aria-hidden\`).
        `.trim(),
      },
    },
  },
} satisfies Meta<IconStoryArgs>;

export default meta;
type Story = StoryObj<IconStoryArgs>;

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <loom-box display="block" style={{ marginBottom: '40px' }}>
    <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
      {title}
    </p>
    {children}
  </loom-box>
);

const Row = ({ children }: { children: ReactNode }) => (
  <loom-inline gap="lg" align="center" wrap>
    {children}
  </loom-inline>
);

const Cell = ({ label, children }: { label: string; children: ReactNode }) => (
  <loom-stack gap="sm" align="center">
    <p className="loom-caption" style={{ color: colorVars.textSecondary, margin: 0 }}>
      {label}
    </p>
    {children}
  </loom-stack>
);

export const Default: Story = {
  args: {
    size: 'md',
    children: <BellIcon />,
  },
  render: (args) => {
    const { size, color, label, children } = args;
    return (
      <loom-box display="block" padding="lg">
        <loom-icon size={size} color={color} label={label}>
          {children}
        </loom-icon>
      </loom-box>
    );
  },
};

export const Sizes: Story = {
  name: 'Tamaños',
  parameters: {
    docs: {
      description: {
        story: 'Escala de tamaños disponibles. La segunda sección muestra el match natural con cada set de Heroicons: `sm` (16px) con micro, `mini` (20px) con mini, `md` (24px) con outline/solid.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg" style={{ color: colorVars.textPrimary }}>
      <StorySection title="Outline 24px (Heroicons outline)">
        <Row>
          {ICON_SIZES.map((s) => (
            <Cell key={s} label={s}>
              <Icon size={s}><BellIcon /></Icon>
            </Cell>
          ))}
        </Row>
      </StorySection>

      <StorySection title="Match natural con sets de Heroicons">
        <Row>
          <Cell label="micro 16"><Icon size="sm"><BellMicro /></Icon></Cell>
          <Cell label="mini 20"><Icon size="mini"><BellMini /></Icon></Cell>
          <Cell label="outline 24"><Icon size="md"><BellIcon /></Icon></Cell>
          <Cell label="solid 24"><Icon size="md"><BellSolid /></Icon></Cell>
        </Row>
      </StorySection>
    </loom-box>
  ),
};

export const Colors: Story = {
  name: 'Colores (tokens)',
  parameters: {
    docs: {
      description: {
        story: 'La prop `color` acepta cualquier token semántico de color. Aplica la CSS variable correspondiente como `color` en el wrapper, y el SVG la hereda vía `currentColor`.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <StorySection title="Con prop color (token semántico)">
        <Row>
          {COLOR_OPTIONS.map((c) => (
            <Cell key={c} label={c}>
              <Icon size="md" color={c}><HeartIcon /></Icon>
            </Cell>
          ))}
        </Row>
      </StorySection>
    </loom-box>
  ),
};

export const InheritsCurrentColor: Story = {
  name: 'Hereda currentColor',
  parameters: {
    docs: {
      description: {
        story: 'Sin prop `color`, el ícono toma el `color` CSS del ancestro más cercano. Útil dentro de componentes coloreados (botones, alertas, badges) sin necesidad de repetir el token.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
      <StorySection title="El SVG hereda el color del padre vía currentColor">
        <loom-inline gap="sm" align="center" style={{ color: colorVars.brandPrimary }}>
          <Icon size="md"><StarIcon /></Icon>
          <span className="loom-body-md">Hereda brandPrimary del contenedor</span>
        </loom-inline>
        <loom-inline gap="sm" align="center" style={{ color: colorVars.feedbackDanger, marginTop: '12px' }}>
          <Icon size="md"><ExclamationTriangleIcon /></Icon>
          <span className="loom-body-md">Hereda feedbackDanger del contenedor</span>
        </loom-inline>
        <loom-inline gap="sm" align="center" style={{ color: colorVars.feedbackSuccess, marginTop: '12px' }}>
          <Icon size="md"><CheckCircleIcon /></Icon>
          <span className="loom-body-md">Hereda feedbackSuccess del contenedor</span>
        </loom-inline>
      </StorySection>
      </loom-stack>
    </loom-box>
  ),
};

export const Accessibility: Story = {
  args: {
    color: "feedbackDanger"
  },

  name: 'A11y (decorativo vs informativo)',

  parameters: {
    docs: {
      description: {
        story: '**Decorativo** (sin `label`): acompaña texto visible → `aria-hidden="true"`, el lector de pantalla lo ignora. **Informativo** (con `label`): transmite significado por sí solo → `role="img"` + `aria-label`.',
      },
    },
  },

  render: () => (
    <loom-box display="block" padding="lg" style={{ color: colorVars.textPrimary }}>
      <StorySection title="Decorativo — sin label, aria-hidden">
        <Row>
          <Icon size="md"><BookmarkIcon /></Icon>
          <span className="loom-body-md">El ícono es decorativo, el lector de pantalla lo ignora.</span>
        </Row>
      </StorySection>

      <StorySection title='Informativo — con label, role="img"'>
        <Row>
          <Icon size="md" label="Marcar como favorito"><BookmarkIcon /></Icon>
          <span className="loom-body-md">El ícono es anunciado como "Marcar como favorito".</span>
        </Row>
      </StorySection>
    </loom-box>
  )
};

export const InsideButton: Story = {
  name: 'Uso dentro de Button',
  parameters: {
    docs: {
      description: {
        story: 'El ícono hereda el color del botón vía `currentColor`. Usa `size="sm"` (16px) con el tamaño de botón `md`. Para botones solo-ícono el `aria-label` va en el `Button`, no en el `Icon`.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg">
      <loom-stack gap="md">
      <StorySection title="Ícono + texto (hereda color del botón)">
        <Row>
          <loom-button variant="primary"><loom-icon size="sm"><BellIcon /></loom-icon>Notificaciones</loom-button>
          <loom-button variant="outline"><loom-icon size="sm"><BellIcon /></loom-icon>Notificaciones</loom-button>
          <loom-button variant="text"><loom-icon size="sm"><BellIcon /></loom-icon>Notificaciones</loom-button>
        </Row>
      </StorySection>

      <StorySection title="Solo ícono (con label para a11y)">
        <Row>
          <loom-button variant="primary" aria-label="Favorito"><loom-icon size="sm"><HeartIcon /></loom-icon></loom-button>
          <loom-button variant="outline" aria-label="Favorito"><loom-icon size="sm"><HeartIcon /></loom-icon></loom-button>
          <loom-button variant="text" aria-label="Favorito"><loom-icon size="sm"><HeartIcon /></loom-icon></loom-button>
        </Row>
      </StorySection>
      </loom-stack>
    </loom-box>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimórfico (as)',
  parameters: {
    docs: {
      description: {
        story: 'La prop `as` permite renderizar el wrapper como cualquier elemento HTML. El comportamiento visual es idéntico; cambia únicamente el nodo en el DOM.',
      },
    },
  },
  render: () => (
    <loom-box display="block" padding="lg" style={{ color: colorVars.textPrimary }}>
      <StorySection title="Como elementos semánticos distintos">
        <Row>
          <Cell label='as="span"'><Icon as="span" size="md"><BellIcon /></Icon></Cell>
          <Cell label='as="i"'><Icon as="i" size="md"><BellIcon /></Icon></Cell>
          <Cell label='as="figure"'><Icon as="figure" size="md" style={{ margin: 0 }}><BellIcon /></Icon></Cell>
        </Row>
      </StorySection>
    </loom-box>
  )
};

export const WebComponent: StoryObj<IconWebComponentArgs> = {
  name: 'Web Component (loom-icon)',
  parameters: {
    docs: {
      description: {
        story: 'Uso como custom element `<loom-icon>`. El SVG se inyecta via `<slot>`. La story incluye una prueba automática (`play`) que valida la presencia del Shadow DOM, el slot, los atributos de accesibilidad y el tamaño computado del ícono.',
      },
    },
  },
  args: {
    size: 'md',
    color: 'brandAccent',
    label: 'Notificaciones',
  },
  argTypes: {
    size:  { control: 'select', options: ICON_SIZES },
    color: { control: 'select', options: [undefined, ...COLOR_OPTIONS] },
    label: { control: 'text' },
  },
  render: ({ size, color, label }) => (
    <loom-box display="block" padding="lg">
      <loom-icon
        size={size}
        color={color}
        label={label}
      >
        <BellIcon />
      </loom-icon>
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-icon');
    if (!(host instanceof HTMLElement)) {
      throw new Error('Expected a loom-icon host in the story canvas.');
    }
    await expect(host.shadowRoot).toBeTruthy();
    await expect(host.shadowRoot!.querySelector('slot')).toBeTruthy();
    await expect(host.getAttribute('role')).toBe('img');

    const svg = host.querySelector('svg');
    if (!(svg instanceof SVGElement)) {
      throw new Error('Expected the slotted SVG to be present.');
    }
    const computed = getComputedStyle(svg);
    await expect(computed.width).toBe('24px');
    await expect(computed.height).toBe('24px');
  },
};
