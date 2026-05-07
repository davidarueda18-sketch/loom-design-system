import type { Meta, StoryObj } from '@storybook/react';
import { shadowVars } from '../../../package/tokens/shadow/index.ts';
import { radiusVars } from '../../../package/tokens/radius/index.ts';

const meta = {
  title: 'Foundations/Elevation',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '32px 0 16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

export const Shadows: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <SubTitle>Shadow</SubTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '32px 16px' }}>
        {(
          [
            { key: 'none' as const,  value: 'none' },
            { key: 'sm' as const,    value: 'sm' },
            { key: 'base' as const,  value: 'base' },
            { key: 'md' as const,    value: 'md' },
            { key: 'lg' as const,    value: 'lg' },
            { key: 'xl' as const,    value: 'xl' },
            { key: 'xl2' as const,   value: 'xl2' },
            { key: 'inner' as const, value: 'inner' },
          ] as const
        ).map(({ key }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: '#2d3748',
                borderRadius: '8px',
                boxShadow: shadowVars[key],
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const BorderRadius: Story = {
  name: 'Border Radius',
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <SubTitle>Border Radius</SubTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '16px' }}>
        {(
          [
            { key: 'xxs' as const, value: '2px' },
            { key: 'xs' as const,  value: '4px' },
            { key: 'sm' as const,  value: '6px' },
            { key: 'md' as const,  value: '8px' },
            { key: 'lg' as const,  value: '16px' },
          ] as const
        ).map(({ key, value }) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: '#4f46e5',
                borderRadius: radiusVars[key],
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{key}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ZIndex: Story = {
  name: 'Z-Index',
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <SubTitle>Z-Index Layers</SubTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        {(
          [
            { key: 'hide' as const,     value: '-1',  desc: 'Ocultar detrás del flujo' },
            { key: 'base' as const,     value: '0',   desc: 'Capa base del documento' },
            { key: 'raised' as const,   value: '10',  desc: 'Elementos elevados' },
            { key: 'dropdown' as const, value: '20',  desc: 'Menús desplegables' },
            { key: 'sticky' as const,   value: '30',  desc: 'Headers sticky' },
            { key: 'overlay' as const,  value: '40',  desc: 'Overlays y backdrops' },
            { key: 'modal' as const,    value: '50',  desc: 'Modales y dialogs' },
          ] as const
        ).map(({ key, value, desc }, i, arr) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 16px',
              background: `hsl(${220 + i * 5}, ${30 + i * 3}%, ${18 + i * 4}%)`,
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.06)',
              transform: `translateX(${i * 4}px)`,
              zIndex: arr.length - i,
              position: 'relative',
            }}
          >
            <code style={{ fontSize: '12px', color: '#a5b4fc', width: '64px', flexShrink: 0 }}>
              z={value}
            </code>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{key}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
