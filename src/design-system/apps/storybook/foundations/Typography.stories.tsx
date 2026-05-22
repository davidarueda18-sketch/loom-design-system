import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { fontFamilyVars } from '../../../package/tokens/fontFamily/index.ts';
import { fontSizeVars } from '../../../package/tokens/fontSize/index.ts';
import { fontWeightVars } from '../../../package/tokens/fontWeight/index.ts';
import { lineHeightVars } from '../../../package/tokens/lineHeight/index.ts';
import { letterSpacingVars } from '../../../package/tokens/letterSpacing/index.ts';
import { Text, variantTokenMap } from '../../../package/ui/primitives/Text/index.ts';
import type { TextVariant } from '../../../package/ui/primitives/Text/index.ts';

const meta = {
  title: 'Foundations/Typography',
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
  const value = resolveToken(cssVar);
  return (
    <span style={{ fontSize: '11px', color: colorVars.textSecondary, fontFamily: 'sans-serif', marginTop: '2px' }}>
      {value || '—'}
    </span>
  );
};

// ─── Metadata (cross-references — not mirror values) ─────────────────────────

const FONT_SAMPLE: Record<keyof typeof fontFamilyVars, string> = {
  sans: 'The quick brown fox jumps over the lazy dog',
  mono: "const x = (a: string) => a.trim();",
};

const LETTER_SPACING_FIGMA: Partial<Record<keyof typeof letterSpacingVars, string>> = {
  tightest: 'Display/XL, 2XL',
  tighter:  'Display/LG',
  tight:    'Heading/H1',
  snug:     'Heading/H2',
  none:     'Body, Labels, H3–H6',
  wide:     'Overline',
};

// TypeScale grouping — prefix-based, not a list of token keys
const SCALE_PREFIXES = ['display', 'heading', 'body', 'label'] as const;
const allScaleKeys = Object.keys(variantTokenMap) as TextVariant[];
const scaleSections = SCALE_PREFIXES.map((prefix) => ({
  label: prefix.charAt(0).toUpperCase() + prefix.slice(1),
  keys: allScaleKeys.filter((k) => k.startsWith(prefix)),
}));
const utilityKeys = allScaleKeys.filter((k) => !SCALE_PREFIXES.some((p) => k.startsWith(p)));

// ─── Sub-components ───────────────────────────────────────────────────────────

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '32px 0 16px', color: colorVars.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const TokenRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', padding: '12px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div style={{ width: '120px', flexShrink: 0 }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{label}</div>
    </div>
    {children}
  </div>
);

const TokenRowWithValue = ({ label, valueVar, children }: { label: string; valueVar: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', padding: '12px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div style={{ width: '120px', flexShrink: 0 }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{label}</div>
      <TokenValue cssVar={valueVar} />
    </div>
    {children}
  </div>
);

const TypeScaleRow = ({ variant }: { variant: TextVariant }) => (
  <div style={{ padding: '12px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div style={{ fontSize: '11px', color: colorVars.textSecondary, fontFamily: 'monospace', marginBottom: '4px' }}>
      {variant}
    </div>
    <Text variant={variant} style={{ fontFamily: fontFamilyVars.sans, color: colorVars.textPrimary }}>
      Loom Design System
    </Text>
  </div>
);

const wrap = { padding: '24px' } as const;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const FontFamily: Story = {
  render: () => (
    <div style={wrap}>
      <SubTitle>Font Family</SubTitle>
      {(Object.keys(fontFamilyVars) as Array<keyof typeof fontFamilyVars>).map((key) => (
        <TokenRow key={key} label={key}>
          <span style={{ fontFamily: fontFamilyVars[key], fontSize: '18px', color: colorVars.textPrimary }}>
            {FONT_SAMPLE[key]}
          </span>
        </TokenRow>
      ))}
    </div>
  ),
};

export const FontSize: Story = {
  render: () => (
    <div style={wrap}>
      <SubTitle>Font Size</SubTitle>
      {(Object.keys(fontSizeVars) as Array<keyof typeof fontSizeVars>).map((key) => (
        <TokenRowWithValue key={key} label={key} valueVar={fontSizeVars[key]}>
          <span style={{ fontFamily: fontFamilyVars.sans, fontSize: fontSizeVars[key], color: colorVars.textPrimary, lineHeight: 1.2 }}>
            Loom Design System
          </span>
        </TokenRowWithValue>
      ))}
    </div>
  ),
};

export const FontWeight: Story = {
  render: () => (
    <div style={wrap}>
      <SubTitle>Font Weight</SubTitle>
      {(Object.keys(fontWeightVars) as Array<keyof typeof fontWeightVars>).map((key) => (
        <TokenRowWithValue key={key} label={key} valueVar={fontWeightVars[key]}>
          <span style={{ fontFamily: fontFamilyVars.sans, fontSize: '24px', fontWeight: fontWeightVars[key], color: colorVars.textPrimary }}>
            Loom Design System
          </span>
        </TokenRowWithValue>
      ))}
    </div>
  ),
};

export const LineHeight: Story = {
  render: () => (
    <div style={wrap}>
      <SubTitle>Line Height</SubTitle>
      {(Object.keys(lineHeightVars) as Array<keyof typeof lineHeightVars>).map((key) => (
        <TokenRowWithValue key={key} label={key} valueVar={lineHeightVars[key]}>
          <p style={{ fontFamily: fontFamilyVars.sans, fontSize: '14px', lineHeight: lineHeightVars[key], color: colorVars.textPrimary, margin: 0, maxWidth: '320px' }}>
            Loom Design System es la librería de componentes que garantiza consistencia visual en todos los productos de la plataforma.
          </p>
        </TokenRowWithValue>
      ))}
    </div>
  ),
};

export const LetterSpacing: Story = {
  render: () => (
    <div style={wrap}>
      <SubTitle>Letter Spacing</SubTitle>
      {(Object.keys(letterSpacingVars) as Array<keyof typeof letterSpacingVars>).map((key) => (
        <TokenRowWithValue key={key} label={`${key}${LETTER_SPACING_FIGMA[key] ? ` · ${LETTER_SPACING_FIGMA[key]}` : ''}`} valueVar={letterSpacingVars[key]}>
          <span style={{ fontFamily: fontFamilyVars.sans, fontSize: '18px', fontWeight: 600, letterSpacing: letterSpacingVars[key], color: colorVars.textPrimary }}>
            Loom Design System
          </span>
        </TokenRowWithValue>
      ))}
    </div>
  ),
};

export const TypeScale: Story = {
  render: () => (
    <div style={wrap}>
      {scaleSections.map(({ label, keys }) => (
        <div key={label}>
          <SubTitle>{label}</SubTitle>
          {keys.map((key) => <TypeScaleRow key={key} variant={key} />)}
        </div>
      ))}
      <SubTitle>Utility</SubTitle>
      {utilityKeys.map((key) => <TypeScaleRow key={key} variant={key} />)}
    </div>
  ),
};
