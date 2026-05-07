import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Introduction',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const Badge = ({ children }: { children: string }) => (
  <span style={{ display: 'inline-block', background: '#312e81', color: '#a5b4fc', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
    {children}
  </span>
);

const Card = ({ title, desc, badge }: { title: string; desc: string; badge: string }) => (
  <div style={{ padding: '20px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}>
    <div style={{ marginBottom: '8px' }}>
      <Badge>{badge}</Badge>
    </div>
    <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>{title}</div>
    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
  </div>
);

export const Welcome: Story = {
  name: 'Welcome',
  render: () => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '720px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#e2e8f0', margin: '0 0 12px' }}>
          Loom Design System
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          Sistema de diseño construido con <strong style={{ color: '#e2e8f0' }}>React</strong>,{' '}
          <strong style={{ color: '#e2e8f0' }}>TypeScript</strong> y{' '}
          <strong style={{ color: '#e2e8f0' }}>Vanilla Extract</strong>.
          Tokens tipados, primitivos polimórficos y componentes accesibles.
        </p>
      </div>

      <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
        Estructura
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        <Card
          badge="Foundations"
          title="Tokens"
          desc="Variables de diseño: colores, tipografía, espaciado, sombras, radio y z-index."
        />
        <Card
          badge="Primitives"
          title="Box · Stack · Inline"
          desc="Bloques base de layout. Polimórficos, tipados y basados en tokens de espaciado."
        />
        <Card
          badge="Components"
          title="Próximamente"
          desc="Componentes con estado: Button, Dialog, Tabs, Accordion, Select…"
        />
        <Card
          badge="Patterns"
          title="Próximamente"
          desc="Composiciones de alto nivel: FormField, PageLayout, DataTable…"
        />
      </div>

      <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
        Stack técnico
      </h2>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['React 19', 'TypeScript ~6', 'Vite 8', 'Vanilla Extract', 'Storybook 10'].map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </div>
  ),
};
