import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { applyTheme } from '../../../package/theme/index.ts';

const meta = {
  title: 'Foundations/Theme',
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── Grouping metadata (display order — not mirror values) ────────────────────

const COLOR_GROUPS = ['surface', 'brand', 'text', 'border', 'feedback'] as const;

const GROUPS = COLOR_GROUPS.map((prefix) => ({
  label: prefix.charAt(0).toUpperCase() + prefix.slice(1),
  tokens: (Object.keys(colorVars) as Array<keyof typeof colorVars>).filter((k) => k.startsWith(prefix)),
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

const GroupLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: colorVars.textSecondary, fontFamily: 'sans-serif', margin: '20px 0 8px',
  }}>
    {children}
  </div>
);

const TokenRow = ({ tokenKey }: { tokenKey: keyof typeof colorVars }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
    <div style={{
      width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
      background: colorVars[tokenKey],
      border: `1px solid ${colorVars.borderSubtle}`,
    }} />
    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: colorVars.textPrimary }}>
      {tokenKey}
    </span>
  </div>
);

// colorVars inside ThemePanel resolve correctly because the panel has data-theme on itself
const ThemePanel = ({ theme, label }: { theme: 'dark' | 'light'; label: string }) => (
  <div
    data-theme={theme}
    style={{
      flex: 1, borderRadius: '10px', overflow: 'hidden',
      border: `1px solid ${colorVars.borderDefault}`,
    }}
  >
    <div style={{
      padding: '10px 16px',
      background: colorVars.surfaceNeutral,
      fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: colorVars.textSecondary,
    }}>
      {label}
    </div>
    <div style={{ padding: '16px 20px', background: colorVars.surfaceBase }}>
      {GROUPS.map(({ label: groupLabel, tokens }) => (
        <div key={groupLabel}>
          <GroupLabel>{groupLabel}</GroupLabel>
          {tokens.map((key) => <TokenRow key={key} tokenKey={key} />)}
        </div>
      ))}
    </div>
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Comparison: Story = {
  name: 'Dark vs Light',
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colorVars.textPrimary, margin: '0 0 6px' }}>
        Tema: Dark / Light
      </h2>
      <p style={{ fontSize: '13px', color: colorVars.textSecondary, margin: '0 0 24px' }}>
        Comparación de todos los tokens semánticos en ambos modos. El toolbar de Storybook también alterna el contexto activo de la historia.
      </p>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <ThemePanel theme="dark" label="Dark — default (:root)" />
        <ThemePanel theme="light" label='Light — [data-theme="light"]' />
      </div>
    </div>
  ),
};

export const Usage: Story = {
  name: 'Usage / API',
  render: () => {
    const [current, setCurrent] = useState<'dark' | 'light'>('dark');

    const toggle = (next: 'dark' | 'light') => {
      applyTheme(next);
      setCurrent(next);
    };

    return (
      <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: colorVars.textPrimary, margin: '0 0 6px' }}>
          Uso del sistema de temas
        </h2>
        <p style={{ fontSize: '13px', color: colorVars.textSecondary, margin: '0 0 28px' }}>
          El tema se aplica añadiendo o quitando{' '}
          <code style={{ fontFamily: 'monospace', fontSize: '12px', background: colorVars.surfaceNeutral, padding: '1px 5px', borderRadius: '3px', color: colorVars.textPrimary }}>
            data-theme="light"
          </code>{' '}
          en <code style={{ fontFamily: 'monospace', fontSize: '12px', background: colorVars.surfaceNeutral, padding: '1px 5px', borderRadius: '3px', color: colorVars.textPrimary }}>document.documentElement</code>.
          Dark mode es el estado por defecto (sin atributo).
        </p>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colorVars.textSecondary, marginBottom: '10px' }}>
            Demo interactivo
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => toggle(t)}
                style={{
                  padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                  fontFamily: 'sans-serif', cursor: 'pointer',
                  border: `1px solid ${current === t ? colorVars.brandAccent : colorVars.borderDefault}`,
                  background: current === t ? colorVars.brandAccentSubtle : colorVars.surfaceRaised,
                  color: current === t ? colorVars.brandAccent : colorVars.textSecondary,
                  transition: 'all 150ms ease',
                }}
              >
                {t === 'dark' ? 'Dark (default)' : 'Light'}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: colorVars.textSecondary, marginTop: '8px' }}>
            Tema activo: <strong style={{ color: colorVars.textPrimary }}>{current}</strong>
            {' — '}el cambio afecta el documento completo, no solo esta story.
          </p>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colorVars.textSecondary, marginBottom: '10px' }}>
            Integración en código
          </div>
          <pre style={{
            background: colorVars.surfaceNeutral, borderRadius: '8px', padding: '20px',
            fontSize: '12px', fontFamily: 'monospace', color: colorVars.textPrimary,
            border: `1px solid ${colorVars.borderSubtle}`, margin: 0, overflowX: 'auto',
          }}>{`import { applyTheme, getTheme } from '@loom-ds/core';
import type { Theme } from '@loom-ds/core';

// Activar light mode (añade data-theme="light" al <html>)
applyTheme('light');

// Volver a dark (quita el atributo — dark es el default via :root)
applyTheme('dark');

// Leer el tema actual
const current: Theme = getTheme(); // 'dark' | 'light'`}</pre>
        </div>

        <div style={{ marginTop: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colorVars.textSecondary, marginBottom: '10px' }}>
            Uso en componentes (.css.ts)
          </div>
          <pre style={{
            background: colorVars.surfaceNeutral, borderRadius: '8px', padding: '20px',
            fontSize: '12px', fontFamily: 'monospace', color: colorVars.textPrimary,
            border: `1px solid ${colorVars.borderSubtle}`, margin: 0, overflowX: 'auto',
          }}>{`import { style } from '@vanilla-extract/css';
import { colorVars, motionVars } from '../../tokens/index.ts';

// Los tokens resuelven automáticamente al tema activo.
// No se necesita ninguna condición explícita dark/light.
export const button = style({
  background: colorVars.brandAccent,
  color: colorVars.textOnBrand,
  border: \`1px solid \${colorVars.borderDefault}\`,
  transition: \`background \${motionVars.durationBase} \${motionVars.easingEaseOut}\`,
});`}</pre>
        </div>

        <div style={{ marginTop: '28px', padding: '16px', background: colorVars.surfaceNeutral, borderRadius: '8px', border: `1px solid ${colorVars.borderSubtle}` }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colorVars.textSecondary, marginBottom: '8px' }}>
            Arquitectura CSS
          </div>
          <div style={{ fontSize: '12px', color: colorVars.textSecondary, lineHeight: '1.8' }}>
            <div><code style={{ fontFamily: 'monospace', color: colorVars.textPrimary }}>:root</code> — Dark mode (default, sin atributo)</div>
            <div><code style={{ fontFamily: 'monospace', color: colorVars.textPrimary }}>[data-theme="dark"]</code> — Dark mode explícito (para panels forzados)</div>
            <div><code style={{ fontFamily: 'monospace', color: colorVars.textPrimary }}>[data-theme="light"]</code> — Light mode</div>
            <div style={{ marginTop: '8px', color: colorVars.textSecondary }}>
              La paleta primitiva (<code style={{ fontFamily: 'monospace', color: colorVars.textPrimary }}>paletteVars</code>) no cambia entre temas — solo los tokens semánticos (<code style={{ fontFamily: 'monospace', color: colorVars.textPrimary }}>colorVars</code>).
            </div>
          </div>
        </div>
      </div>
    );
  },
};
