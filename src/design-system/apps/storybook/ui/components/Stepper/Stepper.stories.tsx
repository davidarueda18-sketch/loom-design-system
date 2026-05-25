import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { colorVars } from '../../../../../package/tokens/color/index.ts';
import '../../../../../package/tokens/color/color.tokens.css.ts';
import '../../../../../package/ui/components/Stepper/adapters/Stepper.element.ts';
import '../../../loom-web-components.d.ts';

const DEFAULT_STEPS = ['Configuración', 'Revisión', 'Confirmación', 'Finalización'];

interface StepperStoryArgs {
  steps: string;
  current: number;
}

const meta = {
  title: 'Components/Stepper',
  tags: ['autodocs'],
  args: {
    steps: JSON.stringify(DEFAULT_STEPS),
    current: 0,
  },
  argTypes: {
    steps: { control: 'text', description: 'JSON string[] con los labels de cada paso' },
    current: { control: { type: 'number', min: 0, max: 3 }, description: 'Índice del paso activo (base 0)' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Componente compuesto que renderiza N pasos con conectores horizontales entre ellos.
El estado se controla completamente desde fuera mediante el atributo \`current\`.

\`\`\`html
<loom-stepper
  steps='["Configuración","Revisión","Confirmación"]'
  current="1">
</loom-stepper>
\`\`\`

Escucha el evento \`loom-stepper-change\` para detectar clicks en los pasos:

\`\`\`js
document.querySelector('loom-stepper')
  .addEventListener('loom-stepper-change', (e) => {
    console.log('Step clicked:', e.detail.step); // índice base 0
  });
\`\`\`

Pasos anteriores a \`current\` = **completed** (cyan sólido + checkmark).
Paso en \`current\` = **active** (anillo cyan).
Pasos siguientes = **default** (gris).
        `.trim(),
      },
    },
  },
} satisfies Meta<StepperStoryArgs>;

export default meta;
type Story = StoryObj<StepperStoryArgs>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{
        fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: colorVars.textSecondary, margin: '0 0 24px',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ControlledStepper() {
  const [current, setCurrent] = useState(0);
  const stepperRef = useRef<HTMLElementTagNameMap['loom-stepper']>(null);

  useEffect(() => {
    const stepper = stepperRef.current;
    if (!stepper) return undefined;

    const handleStepperChange = (event: Event) => {
      setCurrent((event as CustomEvent<{ step: number }>).detail.step);
    };

    stepper.addEventListener('loom-stepper-change', handleStepperChange);
    return () => stepper.removeEventListener('loom-stepper-change', handleStepperChange);
  }, []);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <loom-stepper
        ref={stepperRef}
        steps={JSON.stringify(DEFAULT_STEPS)}
        current={String(current)}
      />
      <div style={{ fontFamily: 'sans-serif', fontSize: '13px', color: colorVars.textSecondary }}>
        Paso activo: <strong style={{ color: colorVars.brandAccent }}>{current + 1} - {DEFAULT_STEPS[current]}</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
          disabled={current === 0}
          style={{ fontFamily: 'sans-serif', fontSize: '13px', padding: '6px 14px', cursor: current === 0 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrent((value) => Math.min(DEFAULT_STEPS.length - 1, value + 1))}
          disabled={current === DEFAULT_STEPS.length - 1}
          style={{ fontFamily: 'sans-serif', fontSize: '13px', padding: '6px 14px', cursor: current === DEFAULT_STEPS.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: ({ steps, current }) => (
    <div style={{ padding: '24px' }}>
      <loom-stepper steps={steps} current={String(current)} />
    </div>
  ),
};

export const AllStates: Story = {
  name: 'Estados de paso',
  parameters: {
    docs: {
      description: {
        story: 'Cada variante de `current` muestra cómo los pasos completados, activo y pendientes se colorean progresivamente.',
      },
    },
  },
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {[0, 1, 2, 3].map((cur) => (
        <Section key={cur} title={`current = ${cur}`}>
          <loom-stepper steps={JSON.stringify(DEFAULT_STEPS)} current={String(cur)} />
        </Section>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Modo controlado (interactivo)',
  parameters: {
    docs: {
      description: {
        story: `
Ejemplo de control externo: los pasos son clickeables y emiten \`loom-stepper-change\`.
El estado se actualiza desde React vía \`useState\`.
        `.trim(),
      },
    },
  },
  render: () => <ControlledStepper />,
};

export const WebComponent: Story = {
  tags: ['test'],
  name: 'Web Component (loom-stepper)',
  parameters: {
    docs: {
      description: {
        story: `
Uso canónico como custom element. La story incluye pruebas automáticas que validan
el shadow DOM, los steps internos, y el evento \`loom-stepper-change\`.
        `.trim(),
      },
    },
  },
  args: {
    steps: JSON.stringify(DEFAULT_STEPS),
    current: 1,
  },
  argTypes: {
    steps: { control: 'text' },
    current: { control: { type: 'number', min: 0, max: 3 } },
  },
  render: (args) => (
    <div style={{ padding: '24px' }}>
      <loom-stepper steps={args.steps} current={String(args.current)} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('loom-stepper');
    if (!(host instanceof HTMLElement)) throw new Error('Expected loom-stepper in canvas.');

    await expect(host.shadowRoot).toBeTruthy();
    const shadow = host.shadowRoot!;

    // Should render 4 step elements
    const stepEls = shadow.querySelectorAll('loom-stepper-step');
    await expect(stepEls.length).toBe(4);

    // Should render 3 connectors (between 4 steps)
    const connectors = shadow.querySelectorAll('[part="connector"]');
    await expect(connectors.length).toBe(3);

    // With current=1: step 0 = completed, step 1 = active, steps 2-3 = default
    await expect(stepEls[0].getAttribute('state')).toBe('completed');
    await expect(stepEls[1].getAttribute('state')).toBe('active');
    await expect(stepEls[2].getAttribute('state')).toBe('default');
    await expect(stepEls[3].getAttribute('state')).toBe('default');

    // Test loom-stepper-change event on click
    let receivedStep: number | null = null;
    host.addEventListener('loom-stepper-change', (e) => {
      receivedStep = (e as CustomEvent<{ step: number }>).detail.step;
    });

    const thirdStep = stepEls[2] as HTMLElement;
    thirdStep.click();
    await expect(receivedStep).toBe(2);

    // Test attribute update re-renders steps
    host.setAttribute('current', '2');
    await new Promise((r) => requestAnimationFrame(r));
    const updatedSteps = shadow.querySelectorAll('loom-stepper-step');
    await expect(updatedSteps[1].getAttribute('state')).toBe('completed');
    await expect(updatedSteps[2].getAttribute('state')).toBe('active');

    // Restore
    host.setAttribute('current', '1');
  },
};
