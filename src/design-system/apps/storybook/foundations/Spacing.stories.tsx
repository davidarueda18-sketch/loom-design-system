import type { Meta, StoryObj } from '@storybook/react';
import { spacingVars } from '../../../package/tokens/spacing/index.ts';

const meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SCALE: Array<{ key: keyof typeof spacingVars; value: string }> = [
  { key: 'none',  value: '0px' },
  { key: 'px',    value: '1px' },
  { key: 'xxs',   value: '2px' },
  { key: 'xs',    value: '4px' },
  { key: 'sm',    value: '8px' },
  { key: 'md',    value: '16px' },
  { key: 'lg',    value: '24px' },
  { key: 'xl',    value: '32px' },
  { key: 'xl2',   value: '48px' },
  { key: 'xl3',   value: '64px' },
  { key: 'xl4',   value: '96px' },
  { key: 'xl5',   value: '128px' },
  { key: 'xl6',   value: '192px' },
  { key: 'xl7',   value: '256px' },
  { key: 'xl8',   value: '384px' },
];

export const Scale: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#e2e8f0' }}>Spacing Scale</h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px' }}>
        Escala de espaciado basada en tokens. Usar <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>SpacingTokenKey</code> para tipar cualquier prop de spacing.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SCALE.map(({ key, value }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ width: '40px', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', textAlign: 'right', flexShrink: 0 }}>
              {key}
            </span>
            <span style={{ width: '52px', fontSize: '12px', color: '#64748b', flexShrink: 0 }}>
              {value}
            </span>
            <div
              style={{
                height: '20px',
                width: spacingVars[key],
                minWidth: key === 'none' ? '2px' : undefined,
                background: key === 'none' ? '#334155' : '#6366f1',
                borderRadius: '3px',
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
