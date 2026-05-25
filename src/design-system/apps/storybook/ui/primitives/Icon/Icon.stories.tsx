import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BellIcon, HeartIcon, StarIcon, BookmarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';
import { BellIcon as BellMini } from '@heroicons/react/20/solid';
import { BellIcon as BellMicro } from '@heroicons/react/16/solid';

import { Icon, ICON_SIZES } from '../../../../../package/ui/primitives/Icon/index.ts';
import { Button } from '../../../../../package/ui/primitives/Button/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Icon/adapters/Icon.element.ts';
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const StorySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: '40px' }}>
    <h3 style={{
      fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: colorVars.textSecondary, margin: '0 0 16px',
    }}>
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
    {children}
  </div>
);

const Cell = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    <div style={{
      fontSize: '10px', fontWeight: 700, fontFamily: 'monospace',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: colorVars.textSecondary,
    }}>
      {label}
    </div>
    {children}
  </div>
);

export const Default: Story = {
  args: {
    size: 'md',
    children: <BellIcon />,
  },
  render: (args) => {
    const { size, color, label, children } = args as {
      size?: string;
      color?: string;
      label?: string;
      children?: ReactNode;
    };
    return (
      <div style={{ padding: '24px' }}>
        <loom-icon size={size} color={color} label={label}>
          {children}
        </loom-icon>
      </div>
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
    <div style={{ padding: '24px', color: colorVars.textPrimary }}>
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
    </div>
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
    <div style={{ padding: '24px' }}>
      <StorySection title="Con prop color (token semántico)">
        <Row>
          {COLOR_OPTIONS.map((c) => (
            <Cell key={c} label={c}>
              <Icon size="md" color={c}><HeartIcon /></Icon>
            </Cell>
          ))}
        </Row>
      </StorySection>
    </div>
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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <StorySection title="El SVG hereda el color del padre vía currentColor">
        <div style={{ color: colorVars.brandPrimary, fontFamily: 'sans-serif', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Icon size="md"><StarIcon /></Icon>
          <span>Hereda brandPrimary del contenedor</span>
        </div>
        <div style={{ color: colorVars.feedbackDanger, fontFamily: 'sans-serif', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <Icon size="md"><ExclamationTriangleIcon /></Icon>
          <span>Hereda feedbackDanger del contenedor</span>
        </div>
        <div style={{ color: colorVars.feedbackSuccess, fontFamily: 'sans-serif', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <Icon size="md"><CheckCircleIcon /></Icon>
          <span>Hereda feedbackSuccess del contenedor</span>
        </div>
      </StorySection>
    </div>
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
    <div style={{ padding: '24px', color: colorVars.textPrimary }}>
      <StorySection title="Decorativo — sin label, aria-hidden">
        <Row>
          <Icon size="md"><BookmarkIcon /></Icon>
          <span style={{ fontFamily: 'sans-serif' }}>El ícono es decorativo, el lector de pantalla lo ignora.</span>
        </Row>
      </StorySection>

      <StorySection title='Informativo — con label, role="img"'>
        <Row>
          <Icon size="md" label="Marcar como favorito"><BookmarkIcon /></Icon>
          <span style={{ fontFamily: 'sans-serif' }}>El ícono es anunciado como "Marcar como favorito".</span>
        </Row>
      </StorySection>
    </div>
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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <StorySection title="Ícono + texto (hereda color del botón)">
        <Row>
          <Button variant="primary"><Icon size="sm"><BellIcon /></Icon>Notificaciones</Button>
          <Button variant="outline"><Icon size="sm"><BellIcon /></Icon>Notificaciones</Button>
          <Button variant="text"><Icon size="sm"><BellIcon /></Icon>Notificaciones</Button>
        </Row>
      </StorySection>

      <StorySection title="Solo ícono (con label para a11y)">
        <Row>
          <Button variant="primary" aria-label="Favorito"><Icon size="sm"><HeartIcon /></Icon></Button>
          <Button variant="outline" aria-label="Favorito"><Icon size="sm"><HeartIcon /></Icon></Button>
          <Button variant="text" aria-label="Favorito"><Icon size="sm"><HeartIcon /></Icon></Button>
        </Row>
      </StorySection>
    </div>
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
    <div style={{ padding: '24px', color: colorVars.textPrimary }}>
      <StorySection title="Como elementos semánticos distintos">
        <Row>
          <Cell label='as="span"'><Icon as="span" size="md"><BellIcon /></Icon></Cell>
          <Cell label='as="i"'><Icon as="i" size="md"><BellIcon /></Icon></Cell>
          <Cell label='as="figure"'><Icon as="figure" size="md" style={{ margin: 0 }}><BellIcon /></Icon></Cell>
        </Row>
      </StorySection>
    </div>
  )
};

export const WebComponent: StoryObj<{
  size?: string;
  color?: string;
  label?: string;
}> = {
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
    <div style={{ padding: '24px' }}>
      <loom-icon
        size={size as string}
        color={color as string | undefined}
        label={label as string | undefined}
      >
        <BellIcon />
      </loom-icon>
    </div>
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
