import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { motionVars } from '../../../package/tokens/motion/index.ts';

const meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const wrap = { padding: '24px', background: colorVars.surfaceBase, borderRadius: '4px' } as const;

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '32px 0 16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const DURATIONS: Array<{ key: keyof typeof motionVars; value: string; usage: string }> = [
  { key: 'durationInstant', value: '0ms',   usage: 'Toggle sin animación' },
  { key: 'durationFast',    value: '100ms', usage: 'Hover, focus ring' },
  { key: 'durationBase',    value: '200ms', usage: 'Transiciones estándar' },
  { key: 'durationSlow',    value: '300ms', usage: 'Modals, drawers, dropdowns' },
  { key: 'durationSlower',  value: '500ms', usage: 'Animaciones de entrada complejas' },
];

const EASINGS: Array<{ key: keyof typeof motionVars; value: string; usage: string }> = [
  { key: 'easingLinear',    value: 'linear',                        usage: 'Loading bars, progreso uniforme' },
  { key: 'easingEaseIn',    value: 'cubic-bezier(0.4, 0, 1, 1)',    usage: 'Elementos que salen de pantalla' },
  { key: 'easingEaseOut',   value: 'cubic-bezier(0, 0, 0.2, 1)',    usage: 'Elementos que entran a pantalla' },
  { key: 'easingEaseInOut', value: 'cubic-bezier(0.4, 0, 0.2, 1)', usage: 'Cambios de estado in-place' },
];

export const Duration: Story = {
  name: 'Duration',
  render: () => (
    <div style={wrap}>
      <SubTitle>Duration</SubTitle>
      <style>{`
        @keyframes loom-slide {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(200px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {DURATIONS.map(({ key, value, usage }) => (
          <div
            key={key}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 80px 1fr',
              alignItems: 'center',
              gap: '24px',
              padding: '16px 0',
              borderBottom: '1px solid #1e293b',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>{key}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'sans-serif' }}>{usage}</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', fontFamily: 'monospace' }}>{value}</div>
            <div style={{ position: 'relative', height: '12px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: colorVars.brandAccent,
                  animation: `loom-slide ${motionVars[key]} ${motionVars.easingEaseInOut} infinite`,
                  animationDuration: value === '0ms' ? '600ms' : motionVars[key],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Easing: Story = {
  name: 'Easing',
  render: () => (
    <div style={wrap}>
      <SubTitle>Easing</SubTitle>
      <style>{`
        @keyframes loom-ease {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(240px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {EASINGS.map(({ key, value, usage }) => (
          <div
            key={key}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              alignItems: 'center',
              gap: '24px',
              padding: '20px 0',
              borderBottom: '1px solid #1e293b',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>{key}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'sans-serif' }}>{usage}</div>
              <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px', fontFamily: 'monospace' }}>{value}</div>
            </div>
            <div style={{ position: 'relative', height: '12px' }}>
              <div style={{ position: 'absolute', top: '5px', left: 0, right: 0, height: '2px', background: '#1e293b', borderRadius: '1px' }} />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: colorVars.brandPrimary,
                  animation: `loom-ease ${motionVars.durationSlower} ${motionVars[key]} infinite`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
