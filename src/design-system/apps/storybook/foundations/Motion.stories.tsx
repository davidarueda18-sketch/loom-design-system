import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { motionVars } from '../../../package/tokens/motion/index.ts';

const meta = {
  title: 'Foundations/Motion',
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveToken = (cssVar: string): string => {
  if (typeof window === 'undefined') return '';
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar.replace(/^var\((.+)\)$/, '$1').trim())
    .trim();
  return value || '—';
};

const TokenValue = ({ cssVar }: { cssVar: string }) => {
  const [value, setValue] = useState('');
  useEffect(() => { setValue(resolveToken(cssVar)); }, [cssVar]);
  return (
    <span style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textSecondary, fontFamily: 'monospace' }}>
      {value || '—'}
    </span>
  );
};

// ─── Metadata (usage descriptions — not mirror values) ────────────────────────

const DURATION_USAGE: Partial<Record<keyof typeof motionVars, string>> = {
  durationInstant: 'Toggle sin animación',
  durationFast:    'Hover, focus ring',
  durationBase:    'Transiciones estándar',
  durationSlow:    'Modals, drawers, dropdowns',
  durationSlower:  'Animaciones de entrada complejas',
};

const EASING_USAGE: Partial<Record<keyof typeof motionVars, string>> = {
  easingLinear:    'Loading bars, progreso uniforme',
  easingEaseIn:    'Elementos que salen de pantalla',
  easingEaseOut:   'Elementos que entran a pantalla',
  easingEaseInOut: 'Cambios de estado in-place',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '32px 0 16px', color: colorVars.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const DurationRow = ({ tokenKey }: { tokenKey: keyof typeof motionVars }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '180px 80px 1fr',
    alignItems: 'center',
    gap: '24px',
    padding: '16px 0',
    borderBottom: `1px solid ${colorVars.borderSubtle}`,
  }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{tokenKey}</div>
      <div style={{ fontSize: '11px', color: colorVars.textSecondary, marginTop: '2px', fontFamily: 'sans-serif' }}>
        {DURATION_USAGE[tokenKey] ?? ''}
      </div>
    </div>
    <TokenValue cssVar={motionVars[tokenKey]} />
    <div style={{ position: 'relative', height: '12px', overflow: 'hidden' }}>
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: colorVars.brandAccent,
          animation: `loom-slide ${tokenKey === 'durationInstant' ? '600ms' : motionVars[tokenKey]} ${motionVars.easingEaseInOut} infinite`,
        }}
      />
    </div>
  </div>
);

const EasingRow = ({ tokenKey }: { tokenKey: keyof typeof motionVars }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    alignItems: 'center',
    gap: '24px',
    padding: '20px 0',
    borderBottom: `1px solid ${colorVars.borderSubtle}`,
  }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{tokenKey}</div>
      <div style={{ fontSize: '11px', color: colorVars.textSecondary, marginTop: '2px', fontFamily: 'sans-serif' }}>
        {EASING_USAGE[tokenKey] ?? ''}
      </div>
      <div style={{ marginTop: '4px' }}>
        <TokenValue cssVar={motionVars[tokenKey]} />
      </div>
    </div>
    <div style={{ position: 'relative', height: '12px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '5px', left: 0, right: 0, height: '2px', background: colorVars.borderStrong, borderRadius: '1px' }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: colorVars.brandPrimary,
          animation: `loom-ease ${motionVars.durationSlower} ${motionVars[tokenKey]} infinite`,
        }}
      />
    </div>
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Duration: Story = {
  name: 'Duration',
  render: () => (
    <div style={{ padding: '24px' }}>
      <style>{`
        @keyframes loom-slide {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(200px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <SubTitle>Duration</SubTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {(Object.keys(motionVars) as Array<keyof typeof motionVars>)
          .filter((key) => key.startsWith('duration'))
          .map((key) => (
            <DurationRow key={key} tokenKey={key} />
          ))
        }
      </div>
    </div>
  ),
};

export const Easing: Story = {
  name: 'Easing',
  render: () => (
    <div style={{ padding: '24px' }}>
      <style>{`
        @keyframes loom-ease {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(240px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <SubTitle>Easing</SubTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {(Object.keys(motionVars) as Array<keyof typeof motionVars>)
          .filter((key) => key.startsWith('easing'))
          .map((key) => (
            <EasingRow key={key} tokenKey={key} />
          ))
        }
      </div>
    </div>
  ),
};
