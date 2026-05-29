import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { StepperStep, STEPPER_STEP_STATES } from '../../../../../package/ui/primitives/StepperStep/index.ts';
import type { StepperStepState } from '../../../../../package/ui/primitives/StepperStep/index.ts';
import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/primitives/Box/adapters/Box.element.ts';
import '../../../../../package/ui/primitives/Inline/adapters/Inline.element.ts';
import '../../../../../package/ui/primitives/Stack/adapters/Stack.element.ts';
import '../../../../../package/ui/primitives/StepperStep/adapters/StepperStep.element.ts';
import '../../../loom-web-components.d.ts';

interface StepperStepStoryArgs {
  step?: string;
  label?: string;
  state?: StepperStepState;
}

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
} satisfies Meta<StepperStepStoryArgs>;

export default meta;
type Story = StoryObj<StepperStepStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <loom-box display="block" style={{ marginBottom: '32px' }}>
      <p className="loom-overline" style={{ color: colorVars.textSecondary, margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </loom-box>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <loom-inline gap="lg" align="start" wrap>
      {children}
    </loom-inline>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ step, label, state }) => (
    <loom-box display="block" padding="lg">
      <loom-stepper-step
        step={step}
        label={label}
        state={state}
      />
    </loom-box>
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
    <loom-box display="block" padding="lg">
      <loom-stack gap="xl">
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
      </loom-stack>
    </loom-box>
  ),
};

export const WebComponent: StoryObj<StepperStepStoryArgs> = {
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
    <loom-box display="block" padding="lg">
      <loom-inline gap="lg" align="start">
      <loom-stepper-step step={args.step} label={args.label} state={args.state} />
      </loom-inline>
    </loom-box>
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
