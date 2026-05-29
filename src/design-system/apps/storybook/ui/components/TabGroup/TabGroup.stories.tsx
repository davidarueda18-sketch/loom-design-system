import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/components/TabGroup/adapters/TabGroup.element.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import type {} from '../../../../../package/ui/components/TabGroup/TabGroup.types.ts';
import type {} from '../../../../../package/ui/primitives/TabItem/TabItem.types.ts';
import '../../../loom-web-components.d.ts';

// ─── Story arg interfaces ─────────────────────────────────────────────────────

interface TabGroupStoryArgs {
  active: string;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Tab Group',
  tags: ['autodocs'],
  args: {
    active: 'details',
  },
  argTypes: {
    active: { control: 'text', description: 'Valor del tab activo (debe coincidir con el atributo value de uno de los loom-tab-item)' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Contenedor de pestañas que gestiona el estado activo de sus hijos \`<loom-tab-item>\`.
Marca automáticamente el item con \`value\` igual al atributo \`active\` del grupo, y escucha
el evento \`loom-tab-item-select\` para actualizar el estado al hacer clic.

\`\`\`html
<loom-tab-group active="details">
  <loom-tab-item value="overview" label="Resumen"></loom-tab-item>
  <loom-tab-item value="details"  label="Detalles"></loom-tab-item>
  <loom-tab-item value="reports"  label="Reportes" disabled></loom-tab-item>
</loom-tab-group>
\`\`\`

Escucha \`loom-tab-group-change\` para reaccionar a cambios de pestaña:

\`\`\`js
document.querySelector('loom-tab-group')
  .addEventListener('loom-tab-group-change', (e) => {
    console.log('Tab activo:', e.detail.value);
  });
\`\`\`
        `.trim(),
      },
    },
  },
} satisfies Meta<TabGroupStoryArgs>;

export default meta;
type Story = StoryObj<TabGroupStoryArgs>;

function ControlledTabGroup() {
  const [active, setActive] = useState('overview');
  const groupRef = useRef<HTMLElementTagNameMap['loom-tab-group'] | null>(null);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      setActive((e as CustomEvent<{ value: string }>).detail.value);
    };
    el.addEventListener('loom-tab-group-change', handler);
    return () => el.removeEventListener('loom-tab-group-change', handler);
  }, []);

  const tabs = [
    { value: 'overview', label: 'Resumen' },
    { value: 'details',  label: 'Detalles' },
    { value: 'reports',  label: 'Reportes' },
  ];

  return (
    <loom-stack gap="lg">
      <loom-tab-group ref={groupRef} active={active}>
        {tabs.map((t) => (
          <loom-tab-item key={t.value} value={t.value} label={t.label} />
        ))}
      </loom-tab-group>
      <loom-box padding-y="md" style={{
        fontFamily: 'monospace', fontSize: '12px',
        color: colorVars.textSecondary,
        borderTop: `1px solid ${colorVars.borderDefault}`,
      }}>
        Tab activo: <strong style={{ color: colorVars.textPrimary }}>{active}</strong>
      </loom-box>
    </loom-stack>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ active }) => (
    <loom-box padding="lg" style={{ backgroundColor: colorVars.surfaceBase }}>
      <loom-tab-group active={active}>
        <loom-tab-item value="overview" label="Resumen" />
        <loom-tab-item value="details"  label="Detalles" />
        <loom-tab-item value="activity" label="Actividad" />
        <loom-tab-item value="reports"  label="Reportes" />
      </loom-tab-group>
    </loom-box>
  ),
};

export const Controlled: Story = {
  name: 'Controlado (React)',
  parameters: {
    docs: {
      description: {
        story: 'Patrón controlado: el estado `active` se mantiene en React y se actualiza al escuchar `loom-tab-group-change`.',
      },
    },
  },
  render: () => (
    <loom-box padding="lg" style={{ backgroundColor: colorVars.surfaceBase }}>
      <ControlledTabGroup />
    </loom-box>
  ),
};

export const WithDisabled: Story = {
  name: 'Con pestaña deshabilitada',
  parameters: {
    docs: {
      description: {
        story: 'Las pestañas deshabilitadas no emiten eventos y no pueden ser activadas.',
      },
    },
  },
  render: () => (
    <loom-box padding="lg" style={{ backgroundColor: colorVars.surfaceBase }}>
      <loom-tab-group active="details">
        <loom-tab-item value="overview"  label="Resumen" />
        <loom-tab-item value="details"   label="Detalles" />
        <loom-tab-item value="analytics" label="Analytics" disabled="" />
        <loom-tab-item value="settings"  label="Configuración" disabled="" />
      </loom-tab-group>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<TabGroupStoryArgs> = {
  tags: ['test'],
  name: 'Web Component (loom-tab-group)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom elements compuestos. Las pruebas automáticas (\`play\`) validan:
shadow DOM del grupo, propagación de \`active\` a los hijos, emisión de \`loom-tab-group-change\`
al hacer clic y que tabs deshabilitadas no cambian el estado activo.
        `.trim(),
      },
    },
  },
  args: { active: 'b' },
  render: ({ active }) => (
    <loom-box padding="lg" style={{ backgroundColor: colorVars.surfaceBase }}>
      <loom-tab-group active={active}>
        <loom-tab-item value="a" label="Alpha" />
        <loom-tab-item value="b" label="Beta" />
        <loom-tab-item value="c" label="Gamma" disabled="" />
      </loom-tab-group>
    </loom-box>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('loom-tab-group');
    if (!(group instanceof HTMLElement)) throw new Error('Expected loom-tab-group.');

    // Shadow DOM must be attached
    await expect(group.shadowRoot).toBeTruthy();
    const shadow = group.shadowRoot!;
    const rootEl = shadow.querySelector('[part="root"]') as HTMLElement;
    await expect(rootEl.getAttribute('role')).toBe('tablist');

    // Initial active tab must be "b"
    await new Promise((r) => requestAnimationFrame(r));
    const [tabA, tabB, tabC] = Array.from(canvasElement.querySelectorAll('loom-tab-item'));
    await expect(tabA!.hasAttribute('active')).toBe(false);
    await expect(tabB!.hasAttribute('active')).toBe(true);
    await expect(tabC!.hasAttribute('active')).toBe(false);

    // Click tab "a" → group-change event fired, active switches
    let changedValue = '';
    group.addEventListener('loom-tab-group-change', (e) => {
      changedValue = (e as CustomEvent<{ value: string }>).detail.value;
    });
    const tabARootEl = tabA!.shadowRoot?.querySelector('[part="root"]') as HTMLElement;
    tabARootEl.click();
    await new Promise((r) => requestAnimationFrame(r));
    await expect(changedValue).toBe('a');
    await expect(tabA!.hasAttribute('active')).toBe(true);
    await expect(tabB!.hasAttribute('active')).toBe(false);

    // Disabled tab "c" must not change state
    const tabCRootEl = tabC!.shadowRoot?.querySelector('[part="root"]') as HTMLElement;
    tabCRootEl.click();
    await new Promise((r) => requestAnimationFrame(r));
    await expect(tabA!.hasAttribute('active')).toBe(true);
    await expect(tabC!.hasAttribute('active')).toBe(false);
  },
};
