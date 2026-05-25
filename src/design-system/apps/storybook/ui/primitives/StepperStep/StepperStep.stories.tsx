import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { StepperStep, STEPPER_STEP_STATES } from '../../../../../package/ui/primitives/StepperStep/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/StepperStep/adapters/StepperStep.element.ts';
import '../../../loom-web-components.d.ts';

const meta = {
  title: 'Primitives/StepperStep',
  tags: ['autodocs'],
  args: {
    step: '1',
    label: 'Descripción del paso',
    state: 'default',
  },
  argTypes: {
    state: { control: 'select', options: STEPPER_STEP_STATES },
    step: { control: 'text' },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Indicador de paso individual como Web Component. Muestra un círculo numerado con un label descriptivo.
Soporta tres estados: \`default\` (gris), \`active\` (cyan con anillo), \`completed\` (cyan sólido con checkmark).

\`\`\`html
<loom-stepper-step step="1" label="Configuración" state="active"></loom-stepper-step>
<loom-stepper-step step="2" label="Revisión" state="completed"></loom-stepper-step>
<loom-stepper-step step="3" label="Confirmación" state="default"></loom-stepper-step>
\`\`\`

CSS hooks: \`::part(circle)\`, \`::part(number)\`, \`::part(check)\`, \`::part(label)\`.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
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
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '24px' }}>
      {children}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ step, label, state }) => (
    <div style={{ padding: '24px' }}>
      <loom-stepper-step
        step={step as string}
        label={label as string}
        state={state as string}
      />
    </div>
  ),
};

export const States: Story = {
  name: 'Estados (state)',
  parameters: {
    docs: {
      description: {
        story: 'Los tres estados del paso: default (pendiente), active (actual) y completed (completado con checkmark).',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Section title="Todos los estados">
        <Row>
          {STEPPER_STEP_STATES.map((s) => (
            <StepperStep key={s} step="1" label={s.charAt(0).toUpperCase() + s.slice(1)} state={s} />
          ))}
        </Row>
      </Section>
      <Section title="Numeración de pasos">
        <Row>
          <StepperStep step="1" label="Configuración" state="completed" />
          <StepperStep step="2" label="Revisión" state="active" />
          <StepperStep step="3" label="Confirmación" state="default" />
        </Row>
      </Section>
    </div>
  ),
};

export const WebComponent: StoryObj<{
  step?: string;
  label?: string;
  state?: string;
}> = {
  tags: ['test'],
  name: 'Web Component (loom-stepper-step)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element \`<loom-stepper-step>\`. Las props son atributos HTML.
La story incluye pruebas automáticas que validan el shadow DOM y el cambio de estado.
        `.trim(),
      },
    },
  },
  args: {
    step: '1',
    label: 'Descripción del paso',
    state: 'default',
  },
  argTypes: {
    state: { control: 'select', options: STEPPER_STEP_STATES },
    step: { control: 'text' },
    label: { control: 'text' },
  },
  render: (args) => (
    <div style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <loom-stepper-step step={args.step} label={args.label} state={args.state} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-stepper-step');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-stepper-step in canvas.');

    await expect(host.shadowRoot).toBeTruthy();

    const shadow = host.shadowRoot!;

    const circleEl = shadow.querySelector('[part="circle"]');
    await expect(circleEl).toBeTruthy();

    const labelEl = shadow.querySelector('[part="label"]');
    await expect(labelEl).toBeTruthy();
    await expect(labelEl!.textContent).toBe('Descripción del paso');

    // Test state change
    host.setAttribute('state', 'active');
    await new Promise((r) => requestAnimationFrame(r));

    const numberEl = shadow.querySelector('[part="number"]');
    await expect(numberEl).toBeTruthy();
    await expect((numberEl as HTMLElement).hidden).toBe(false);

    // Test completed state shows check, hides number
    host.setAttribute('state', 'completed');
    await new Promise((r) => requestAnimationFrame(r));
    await expect((numberEl as HTMLElement).hidden).toBe(true);

    const checkEl = shadow.querySelector('[part="check"]');
    await expect(checkEl).toBeTruthy();
    await expect((checkEl as HTMLElement).hidden).toBe(false);

    // Restore
    host.setAttribute('state', 'default');
  },
};
