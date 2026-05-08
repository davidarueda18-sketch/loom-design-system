import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { fontFamilyVars } from '../../../package/tokens/fontFamily/index.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { fontSizeVars } from '../../../package/tokens/fontSize/index.ts';
import { fontWeightVars } from '../../../package/tokens/fontWeight/index.ts';
import { lineHeightVars } from '../../../package/tokens/lineHeight/index.ts';
import { letterSpacingVars } from '../../../package/tokens/letterSpacing/index.ts';
import { Text } from '../../../package/ui/primitives/Text/index.ts';

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

const wrap = { padding: '24px', background: colorVars.surfaceBase, borderRadius: '4px' } as const;

export const FontFamily: Story = {
  name: 'Font Family',
  render: () => (
    <div style={wrap}>
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
    <div style={wrap}>
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
    <div style={wrap}>
      <SubTitle>Font Weight</SubTitle>
      {(
        [
          { key: 'thin' as const,       value: '100' },
          { key: 'extralight' as const, value: '200' },
          { key: 'light' as const,      value: '300' },
          { key: 'normal' as const,     value: '400' },
          { key: 'medium' as const,     value: '500' },
          { key: 'semibold' as const,   value: '600' },
          { key: 'bold' as const,       value: '700' },
          { key: 'extrabold' as const,  value: '800' },
          { key: 'black' as const,      value: '900' },
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
    <div style={wrap}>
      <SubTitle>Line Height</SubTitle>
      {(
        [
          { key: 'none' as const,      value: '1' },
          { key: 'compact' as const,   value: '1.1' },
          { key: 'condensed' as const, value: '1.2' },
          { key: 'tight' as const,     value: '1.25' },
          { key: 'snug' as const,      value: '1.375' },
          { key: 'normal' as const,    value: '1.5' },
          { key: 'relaxed' as const,   value: '1.6' },
          { key: 'loose' as const,     value: '2' },
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

export const LetterSpacing: Story = {
  name: 'Letter Spacing',
  render: () => (
    <div style={wrap}>
      <SubTitle>Letter Spacing</SubTitle>
      {(
        [
          { key: 'tightest' as const, value: '-0.02em',  figma: 'Display/XL, 2XL' },
          { key: 'tighter'  as const, value: '-0.015em', figma: 'Display/LG' },
          { key: 'tight'    as const, value: '-0.01em',  figma: 'Heading/H1' },
          { key: 'snug'     as const, value: '-0.005em', figma: 'Heading/H2' },
          { key: 'none'     as const, value: '0em',      figma: 'Body, Labels, H3–H6' },
          { key: 'wide'     as const, value: '0.05em',   figma: 'Overline' },
        ] as const
      ).map(({ key, value, figma }) => (
        <Row key={key} label={key} sub={`${value} · ${figma}`}>
          <span style={{ fontFamily: fontFamilyVars.sans, fontSize: '18px', fontWeight: 600, letterSpacing: letterSpacingVars[key], color: '#e2e8f0' }}>
            Loom Design System
          </span>
        </Row>
      ))}
    </div>
  ),
};

export const TypeScale: Story = {
  name: 'Type Scale',
  render: () => (
    <div style={wrap}>
      <SubTitle>Display</SubTitle>
      {(
        [
          { key: 'display2xl' as const, label: 'Display / 2XL', figma: 'Display/2XL' },
          { key: 'displayXl'  as const, label: 'Display / XL',  figma: 'Display/XL'  },
          { key: 'displayLg'  as const, label: 'Display / LG',  figma: 'Display/LG'  },
        ] as const
      ).map(({ key, label, figma }) => (
        <div key={key} style={{ padding: '16px 0', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'sans-serif', marginBottom: '4px' }}>
            {label} · <span style={{ color: '#475569' }}>{figma}</span>
          </div>
          <Text
            variant={key}
            style={{ fontFamily: fontFamilyVars.sans, color: '#e2e8f0' }}
          >
            Loom Design System
          </Text>
        </div>
      ))}

      <SubTitle>Heading</SubTitle>
      {(
        [
          { key: 'headingH1' as const, label: 'Heading / H1', figma: 'Heading/H1' },
          { key: 'headingH2' as const, label: 'Heading / H2', figma: 'Heading/H2' },
          { key: 'headingH3' as const, label: 'Heading / H3', figma: 'Heading/H3' },
          { key: 'headingH4' as const, label: 'Heading / H4', figma: 'Heading/H4' },
          { key: 'headingH5' as const, label: 'Heading / H5', figma: 'Heading/H5' },
          { key: 'headingH6' as const, label: 'Heading / H6', figma: 'Heading/H6' },
        ] as const
      ).map(({ key, label, figma }) => (
        <div key={key} style={{ padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'sans-serif', marginBottom: '4px' }}>
            {label} · <span style={{ color: '#475569' }}>{figma}</span>
          </div>
          <Text
            variant={key}
            style={{ fontFamily: fontFamilyVars.sans, color: '#e2e8f0' }}
          >
            Loom Design System
          </Text>
        </div>
      ))}

      <SubTitle>Body</SubTitle>
      {(
        [
          { key: 'bodyLg'   as const, label: 'Body / LG',   figma: 'Body/LG'   },
          { key: 'bodyBase' as const, label: 'Body / Base', figma: 'Body/Base' },
          { key: 'bodySm'   as const, label: 'Body / SM',   figma: 'Body/SM'   },
        ] as const
      ).map(({ key, label, figma }) => (
        <div key={key} style={{ padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'sans-serif', marginBottom: '4px' }}>
            {label} · <span style={{ color: '#475569' }}>{figma}</span>
          </div>
          <Text
            variant={key}
            style={{ fontFamily: fontFamilyVars.sans, color: '#e2e8f0', maxWidth: '480px' }}
          >
            Loom Design System es la librería de componentes que garantiza consistencia visual en todos los productos.
          </Text>
        </div>
      ))}

      <SubTitle>Label</SubTitle>
      {(
        [
          { key: 'labelLg'   as const, label: 'Label / LG',   figma: 'Label/LG'   },
          { key: 'labelBase' as const, label: 'Label / Base', figma: 'Label/Base' },
          { key: 'labelSm'   as const, label: 'Label / SM',   figma: 'Label/SM'   },
        ] as const
      ).map(({ key, label, figma }) => (
        <div key={key} style={{ padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'sans-serif', marginBottom: '4px' }}>
            {label} · <span style={{ color: '#475569' }}>{figma}</span>
          </div>
          <Text
            variant={key}
            style={{ fontFamily: fontFamilyVars.sans, color: '#e2e8f0' }}
          >
            Estado del componente
          </Text>
        </div>
      ))}

      <SubTitle>Utility</SubTitle>
      {(
        [
          { key: 'overline' as const, label: 'Overline', figma: 'Overline' },
          { key: 'caption'  as const, label: 'Caption',  figma: 'Caption'  },
        ] as const
      ).map(({ key, label, figma }) => (
        <div key={key} style={{ padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'sans-serif', marginBottom: '4px' }}>
            {label} · <span style={{ color: '#475569' }}>{figma}</span>
          </div>
          <Text
            variant={key}
            style={{ fontFamily: fontFamilyVars.sans, color: '#94a3b8', textTransform: key === 'overline' ? 'uppercase' : undefined }}
          >
            {key === 'overline' ? 'Categoría de sección' : 'Texto de ayuda o descripción secundaria'}
          </Text>
        </div>
      ))}
    </div>
  ),
};
