import type { Meta, StoryObj } from '@storybook/react';
import { fontFamilyVars } from '../../../package/tokens/fontFamily/index.ts';
import { fontSizeVars } from '../../../package/tokens/fontSize/index.ts';
import { fontWeightVars } from '../../../package/tokens/fontWeight/index.ts';
import { lineHeightVars } from '../../../package/tokens/lineHeight/index.ts';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '32px 0 16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const Row = ({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
    <div style={{ width: '120px', flexShrink: 0 }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'sans-serif' }}>{label}</div>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'sans-serif' }}>{sub}</div>
    </div>
    {children}
  </div>
);

export const FontFamily: Story = {
  name: 'Font Family',
  render: () => (
    <div>
      <SubTitle>Font Family</SubTitle>
      <Row label="sans" sub="fontFamilyVars.sans">
        <span style={{ fontFamily: fontFamilyVars.sans, fontSize: '18px', color: '#e2e8f0' }}>
          The quick brown fox jumps over the lazy dog
        </span>
      </Row>
      <Row label="mono" sub="fontFamilyVars.mono">
        <span style={{ fontFamily: fontFamilyVars.mono, fontSize: '16px', color: '#e2e8f0' }}>
          const x = (a: string) =&gt; a.trim();
        </span>
      </Row>
    </div>
  ),
};

export const FontSize: Story = {
  name: 'Font Size',
  render: () => (
    <div>
      <SubTitle>Font Size</SubTitle>
      {(
        [
          { key: 'xxs' as const, value: '10px' },
          { key: 'xs' as const, value: '12px' },
          { key: 'sm' as const, value: '14px' },
          { key: 'base' as const, value: '16px' },
          { key: 'lg' as const, value: '18px' },
          { key: 'xl' as const, value: '20px' },
          { key: 'xl2' as const, value: '24px' },
          { key: 'xl3' as const, value: '30px' },
          { key: 'xl4' as const, value: '36px' },
          { key: 'xl5' as const, value: '48px' },
          { key: 'xl6' as const, value: '60px' },
          { key: 'xl7' as const, value: '72px' },
          { key: 'xl8' as const, value: '96px' },
        ] as const
      ).map(({ key, value }) => (
        <Row key={key} label={key} sub={value}>
          <span style={{ fontFamily: fontFamilyVars.sans, fontSize: fontSizeVars[key], color: '#e2e8f0', lineHeight: 1.2 }}>
            Loom Design System
          </span>
        </Row>
      ))}
    </div>
  ),
};

export const FontWeight: Story = {
  name: 'Font Weight',
  render: () => (
    <div>
      <SubTitle>Font Weight</SubTitle>
      {(
        [
          { key: 'thin' as const,      value: '100' },
          { key: 'extralight' as const, value: '200' },
          { key: 'light' as const,     value: '300' },
          { key: 'normal' as const,    value: '400' },
          { key: 'medium' as const,    value: '500' },
          { key: 'semibold' as const,  value: '600' },
          { key: 'bold' as const,      value: '700' },
          { key: 'extrabold' as const, value: '800' },
          { key: 'black' as const,     value: '900' },
        ] as const
      ).map(({ key, value }) => (
        <Row key={key} label={key} sub={value}>
          <span style={{ fontFamily: fontFamilyVars.sans, fontSize: '24px', fontWeight: fontWeightVars[key], color: '#e2e8f0' }}>
            Loom Design System
          </span>
        </Row>
      ))}
    </div>
  ),
};

export const LineHeight: Story = {
  name: 'Line Height',
  render: () => (
    <div>
      <SubTitle>Line Height</SubTitle>
      {(
        [
          { key: 'none' as const,    value: '1' },
          { key: 'tight' as const,   value: '1.25' },
          { key: 'snug' as const,    value: '1.375' },
          { key: 'normal' as const,  value: '1.5' },
          { key: 'relaxed' as const, value: '1.625' },
          { key: 'loose' as const,   value: '2' },
        ] as const
      ).map(({ key, value }) => (
        <Row key={key} label={key} sub={value}>
          <p style={{ fontFamily: fontFamilyVars.sans, fontSize: '14px', lineHeight: lineHeightVars[key], color: '#e2e8f0', margin: 0, maxWidth: '320px' }}>
            Loom Design System es la librería de componentes que garantiza consistencia visual en todos los productos de la plataforma.
          </p>
        </Row>
      ))}
    </div>
  ),
};
