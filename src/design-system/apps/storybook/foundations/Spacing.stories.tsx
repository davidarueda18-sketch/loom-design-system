import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { spacingVars } from '../../../package/tokens/spacing/index.ts';

const meta = {
  title: 'Foundations/Spacing',
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
    <span style={{ fontSize: '12px', color: colorVars.textSecondary, fontFamily: 'monospace' }}>
      {value || '—'}
    </span>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: string }) => (
  <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: colorVars.textPrimary }}>
    {children}
  </h2>
);

const SpacingRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <span style={{ width: '40px', fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, textAlign: 'right', flexShrink: 0, fontFamily: 'monospace' }}>
      {name}
    </span>
    <span style={{ width: '52px', flexShrink: 0 }}>
      <TokenValue cssVar={cssVar} />
    </span>
    <div
      style={{
        height: '20px',
        width: cssVar,
        minWidth: name === 'none' ? '2px' : undefined,
        background: name === 'none' ? colorVars.borderStrong : colorVars.brandPrimary,
        borderRadius: '3px',
        flexShrink: 0,
      }}
    />
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Scale: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <SectionTitle>Spacing Scale</SectionTitle>
      <p style={{ fontSize: '14px', color: colorVars.textSecondary, marginBottom: '32px' }}>
        Escala de espaciado basada en tokens. Usar{' '}
        <code style={{ background: colorVars.surfaceNeutral, padding: '2px 6px', borderRadius: '4px', color: colorVars.textPrimary }}>
          SpacingTokenKey
        </code>{' '}
        para tipar cualquier prop de spacing.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((key) => (
          <SpacingRow key={key} name={key} cssVar={spacingVars[key]} />
        ))}
      </div>
    </div>
  ),
};
