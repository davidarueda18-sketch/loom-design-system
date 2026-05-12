import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../package/tokens/color/color.tokens.css.ts';
import '../../../package/tokens/palette/palette.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { paletteVars } from '../../../package/tokens/palette/index.ts';

const meta = {
  title: 'Foundations/Color',
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
    <span style={{ fontSize: '10px', color: colorVars.textSecondary, fontFamily: 'monospace', marginTop: '2px', display: 'block' }}>
      {value || '—'}
    </span>
  );
};

// ─── Grouping metadata (display order — not mirror values) ────────────────────

const HUES = ['cyan', 'red', 'neutral', 'green', 'amber', 'blue'] as const;
const SEMANTIC_GROUPS = ['surface', 'brand', 'text', 'border', 'feedback'] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: string }) => (
  <h2 style={{ fontFamily: 'sans-serif', fontSize: '20px', fontWeight: 700, margin: '32px 0 16px', color: colorVars.textPrimary }}>
    {children}
  </h2>
);

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '24px 0 12px', color: colorVars.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const PaletteCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ width: '80px' }}>
    <div style={{
      width: '80px',
      height: '56px',
      background: cssVar,
      borderRadius: '6px',
      border: `1px solid ${colorVars.borderSubtle}`,
      marginBottom: '6px',
    }} />
    <div style={{ fontSize: '11px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
    <TokenValue cssVar={cssVar} />
  </div>
);

const SemanticRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div style={{
      width: '48px',
      height: '48px',
      flexShrink: 0,
      background: cssVar,
      borderRadius: '6px',
      border: `1px solid ${colorVars.borderSubtle}`,
    }} />
    <div style={{ fontFamily: 'monospace', fontSize: '13px', color: colorVars.textPrimary }}>{name}</div>
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Palette: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <SectionTitle>Palette</SectionTitle>
      <p style={{ fontSize: '14px', color: colorVars.textSecondary, marginBottom: '24px' }}>
        Colores primitivos del sistema. No usar directamente en componentes — usar los tokens semánticos.
      </p>
      {HUES.map((hue) => (
        <div key={hue} style={{ marginBottom: '24px' }}>
          <SubTitle>{hue}</SubTitle>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(Object.keys(paletteVars) as Array<keyof typeof paletteVars>)
              .filter((key) => key.startsWith(hue))
              .map((key) => (
                <PaletteCard key={key} name={key} cssVar={paletteVars[key]} />
              ))
            }
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Semantic: Story = {
  name: 'Semantic Colors',
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <SectionTitle>Semantic Colors</SectionTitle>
      <p style={{ fontSize: '14px', color: colorVars.textSecondary, marginBottom: '24px' }}>
        Tokens semánticos: referencian colores de la paleta y tienen un significado de uso.
      </p>
      {SEMANTIC_GROUPS.map((group) => (
        <div key={group} style={{ marginBottom: '24px' }}>
          <SubTitle>{group}</SubTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {(Object.keys(colorVars) as Array<keyof typeof colorVars>)
              .filter((key) => key.startsWith(group))
              .map((key) => (
                <SemanticRow key={key} name={key} cssVar={colorVars[key]} />
              ))
            }
          </div>
        </div>
      ))}
    </div>
  ),
};
