import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { shadowVars } from '../../../package/tokens/shadow/index.ts';
import { radiusVars } from '../../../package/tokens/radius/index.ts';
import { zIndexVars } from '../../../package/tokens/zIndex/index.ts';

const meta = {
  title: 'Foundations/Elevation',
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
    <span style={{ fontSize: '11px', color: colorVars.textSecondary, fontFamily: 'monospace' }}>
      {value || '—'}
    </span>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '32px 0 16px', color: colorVars.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const ShadowCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: '80px',
      height: '80px',
      background: colorVars.surfaceRaised,
      borderRadius: '8px',
      boxShadow: cssVar,
    }} />
    <span style={{ fontSize: '12px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</span>
  </div>
);

const RadiusCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
    <div style={{
      width: '80px',
      height: '80px',
      background: colorVars.brandPrimarySubtle,
      border: `2px solid ${colorVars.brandPrimary}`,
      borderRadius: cssVar,
    }} />
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
      <TokenValue cssVar={cssVar} />
    </div>
  </div>
);

const Z_DESC: Record<keyof typeof zIndexVars, string> = {
  hide:     'Ocultar detrás del flujo',
  base:     'Capa base del documento',
  raised:   'Elementos elevados',
  dropdown: 'Menús desplegables',
  sticky:   'Headers sticky',
  overlay:  'Overlays y backdrops',
  modal:    'Modales y dialogs',
};

const ZIndexLayer = ({ name, cssVar, index, total }: { name: string; cssVar: string; index: number; total: number }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    background: colorVars.surfaceSubtle,
    borderRadius: '6px',
    border: `1px solid ${colorVars.borderDefault}`,
    transform: `translateX(${index * 4}px)`,
    position: 'relative',
    zIndex: total - index,
  }}>
    <span style={{ fontSize: '12px', color: colorVars.brandAccent, width: '64px', flexShrink: 0, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '2px' }}>
      {'z='}<TokenValue cssVar={cssVar} />
    </span>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'sans-serif' }}>{name}</div>
      <div style={{ fontSize: '11px', color: colorVars.textSecondary, marginTop: '2px', fontFamily: 'sans-serif' }}>
        {Z_DESC[name as keyof typeof zIndexVars]}
      </div>
    </div>
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Shadows: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <SubTitle>Shadow</SubTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '16px' }}>
        {(Object.keys(shadowVars) as Array<keyof typeof shadowVars>).map((key) => (
          <ShadowCard key={key} name={key} cssVar={shadowVars[key]} />
        ))}
      </div>
    </div>
  ),
};

export const BorderRadius: Story = {
  name: 'Border Radius',
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <SubTitle>Border Radius</SubTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '16px' }}>
        {(Object.keys(radiusVars) as Array<keyof typeof radiusVars>).map((key) => (
          <RadiusCard key={key} name={key} cssVar={radiusVars[key]} />
        ))}
      </div>
    </div>
  ),
};

export const ZIndex: Story = {
  name: 'Z-Index',
  render: () => {
    const keys = Object.keys(zIndexVars) as Array<keyof typeof zIndexVars>;
    return (
      <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
        <SubTitle>Z-Index Layers</SubTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
          {keys.map((key, i) => (
            <ZIndexLayer
              key={key}
              name={key}
              cssVar={zIndexVars[key]}
              index={i}
              total={keys.length}
            />
          ))}
        </div>
      </div>
    );
  },
};
