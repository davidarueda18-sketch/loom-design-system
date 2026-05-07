import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import '../../../package/tokens/palette/palette.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { paletteVars } from '../../../package/tokens/palette/index.ts';

const meta = {
  title: 'Foundations/Color',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── Palette data ────────────────────────────────────────────────────────────

const PALETTE: Record<string, Array<{ key: string; value: string; cssVar: string }>> = {
  Cyan: [
    { key: 'cyan100', value: '#E0F9FC', cssVar: paletteVars.cyan100 },
    { key: 'cyan200', value: '#B8EEF5', cssVar: paletteVars.cyan200 },
    { key: 'cyan300', value: '#80E2EE', cssVar: paletteVars.cyan300 },
    { key: 'cyan400', value: '#42D8EC', cssVar: paletteVars.cyan400 },
    { key: 'cyan500', value: '#20BDD6', cssVar: paletteVars.cyan500 },
    { key: 'cyan600', value: '#1897AD', cssVar: paletteVars.cyan600 },
    { key: 'cyan700', value: '#117287', cssVar: paletteVars.cyan700 },
    { key: 'cyan800', value: '#0A4E5E', cssVar: paletteVars.cyan800 },
    { key: 'cyan900', value: '#052A33', cssVar: paletteVars.cyan900 },
  ],
  Red: [
    { key: 'red100', value: '#FFE9E5', cssVar: paletteVars.red100 },
    { key: 'red200', value: '#FFBFB3', cssVar: paletteVars.red200 },
    { key: 'red300', value: '#FF9280', cssVar: paletteVars.red300 },
    { key: 'red400', value: '#FF6650', cssVar: paletteVars.red400 },
    { key: 'red500', value: '#FF462D', cssVar: paletteVars.red500 },
    { key: 'red600', value: '#E83015', cssVar: paletteVars.red600 },
    { key: 'red700', value: '#C42208', cssVar: paletteVars.red700 },
    { key: 'red800', value: '#901905', cssVar: paletteVars.red800 },
    { key: 'red900', value: '#3D0A02', cssVar: paletteVars.red900 },
  ],
  Neutral: [
    { key: 'neutral100', value: '#E8E8E8', cssVar: paletteVars.neutral100 },
    { key: 'neutral200', value: '#C8C8C8', cssVar: paletteVars.neutral200 },
    { key: 'neutral300', value: '#A8A8A8', cssVar: paletteVars.neutral300 },
    { key: 'neutral400', value: '#848484', cssVar: paletteVars.neutral400 },
    { key: 'neutral500', value: '#666666', cssVar: paletteVars.neutral500 },
    { key: 'neutral600', value: '#525252', cssVar: paletteVars.neutral600 },
    { key: 'neutral700', value: '#3A3A3A', cssVar: paletteVars.neutral700 },
    { key: 'neutral800', value: '#252525', cssVar: paletteVars.neutral800 },
    { key: 'neutral900', value: '#181818', cssVar: paletteVars.neutral900 },
  ],
  Green: [
    { key: 'green100', value: '#E5F8E2', cssVar: paletteVars.green100 },
    { key: 'green200', value: '#BBE8B4', cssVar: paletteVars.green200 },
    { key: 'green300', value: '#7DD374', cssVar: paletteVars.green300 },
    { key: 'green400', value: '#4DC043', cssVar: paletteVars.green400 },
    { key: 'green500', value: '#2BB309', cssVar: paletteVars.green500 },
    { key: 'green600', value: '#1E8C06', cssVar: paletteVars.green600 },
    { key: 'green700', value: '#145F04', cssVar: paletteVars.green700 },
    { key: 'green800', value: '#0C3E02', cssVar: paletteVars.green800 },
    { key: 'green900', value: '#062001', cssVar: paletteVars.green900 },
  ],
  Amber: [
    { key: 'amber100', value: '#FFF3E0', cssVar: paletteVars.amber100 },
    { key: 'amber200', value: '#FFE0A0', cssVar: paletteVars.amber200 },
    { key: 'amber300', value: '#FFCC6A', cssVar: paletteVars.amber300 },
    { key: 'amber400', value: '#FFB237', cssVar: paletteVars.amber400 },
    { key: 'amber500', value: '#FF9800', cssVar: paletteVars.amber500 },
    { key: 'amber600', value: '#CC7A00', cssVar: paletteVars.amber600 },
    { key: 'amber700', value: '#995B00', cssVar: paletteVars.amber700 },
    { key: 'amber800', value: '#663D00', cssVar: paletteVars.amber800 },
    { key: 'amber900', value: '#332000', cssVar: paletteVars.amber900 },
  ],
};

// ─── Semantic color data ──────────────────────────────────────────────────────

const SEMANTIC: Array<{ group: string; tokens: Array<{ key: keyof typeof colorVars; label: string }> }> = [
  {
    group: 'Surface',
    tokens: [
      { key: 'surfaceBase', label: 'Base' },
      { key: 'surfaceRaised', label: 'Raised' },
      { key: 'surfaceSubtle', label: 'Subtle' },
      { key: 'surfaceNeutral', label: 'Neutral' },
    ],
  },
  {
    group: 'Brand',
    tokens: [
      { key: 'brandPrimary', label: 'Primary' },
      { key: 'brandPrimarySubtle', label: 'Primary Subtle' },
      { key: 'brandAccent', label: 'Accent' },
      { key: 'brandAccentSubtle', label: 'Accent Subtle' },
    ],
  },
  {
    group: 'Text',
    tokens: [
      { key: 'textPrimary', label: 'Primary' },
      { key: 'textSecondary', label: 'Secondary' },
      { key: 'textDisabled', label: 'Disabled' },
      { key: 'textInverse', label: 'Inverse' },
      { key: 'textOnBrand', label: 'On Brand' },
    ],
  },
  {
    group: 'Border',
    tokens: [
      { key: 'borderDefault', label: 'Default' },
      { key: 'borderStrong', label: 'Strong' },
      { key: 'borderSubtle', label: 'Subtle' },
    ],
  },
  {
    group: 'Feedback',
    tokens: [
      { key: 'feedbackSuccess', label: 'Success' },
      { key: 'feedbackSuccessSubtle', label: 'Success Subtle' },
      { key: 'feedbackWarning', label: 'Warning' },
      { key: 'feedbackWarningSubtle', label: 'Warning Subtle' },
      { key: 'feedbackDanger', label: 'Danger' },
      { key: 'feedbackDangerSubtle', label: 'Danger Subtle' },
    ],
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: string }) => (
  <h2 style={{ fontFamily: 'sans-serif', fontSize: '20px', fontWeight: 700, margin: '32px 0 16px', color: '#e2e8f0' }}>
    {children}
  </h2>
);

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '24px 0 12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Palette: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px', background: colorVars.surfaceBase, borderRadius: '4px' }}>
      <SectionTitle>Palette</SectionTitle>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        Colores primitivos del sistema. No usar directamente en componentes — usar los tokens semánticos.
      </p>
      {Object.entries(PALETTE).map(([scale, swatches]) => (
        <div key={scale} style={{ marginBottom: '24px' }}>
          <SubTitle>{scale}</SubTitle>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {swatches.map(({ key, value }) => (
              <div key={key} style={{ width: '96px' }}>
                <div
                  style={{
                    width: '96px',
                    height: '64px',
                    background: value,
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '6px',
                  }}
                />
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{key}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Semantic: Story = {
  name: 'Semantic Colors',
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px', background: colorVars.surfaceBase, borderRadius: '4px' }}>
      <SectionTitle>Semantic Colors</SectionTitle>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        Tokens semánticos: referencian colores de la paleta y tienen un significado de uso.
      </p>
      {SEMANTIC.map(({ group, tokens }) => (
        <div key={group} style={{ marginBottom: '24px' }}>
          <SubTitle>{group}</SubTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tokens.map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: colorVars[key],
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{key}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
