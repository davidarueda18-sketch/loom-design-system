import type { Meta, StoryObj } from '@storybook/react-vite';
import { AVATAR_SIZES } from '../../../../../package/ui/primitives/Avatar/Avatar.types.ts';
import '../../../../../package/ui/primitives/Avatar/adapters/Avatar.element.ts';
import '../../../../../package/ui/primitives/Avatar/adapters/AvatarGroup.element.ts';
import '../../../loom-web-components.d.ts';

interface AvatarStoryArgs {
  name: string;
  email: string;
  photoUrl: string;
  size: (typeof AVATAR_SIZES)[number];
}

const meta = {
  title: 'Primitives/Avatar',
  tags: ['autodocs'],
  args: {
    name: 'David Rueda',
    email: 'david@example.com',
    photoUrl: '',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: [...AVATAR_SIZES] },
    photoUrl: { control: 'text' },
    name: { control: 'text' },
    email: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Átomo de avatar y cluster de avatares. \`loom-avatar\` muestra foto (vía \`photo-url\`) o iniciales generadas desde \`name\`, con color determinístico por \`email\`.
\`loom-avatar-group\` agupa varios \`loom-avatar\` con solapamiento y badge \`+N\` cuando superan el \`max\`.

\`\`\`html
<loom-avatar name="David Rueda" email="david@kyndryl.com" size="md"></loom-avatar>

<loom-avatar-group max="3">
  <loom-avatar name="David Rueda" email="david@kyndryl.com" size="sm"></loom-avatar>
  <loom-avatar name="Ana Gómez" email="ana@kyndryl.com" size="sm"></loom-avatar>
  <loom-avatar name="Carlos López" email="carlos@kyndryl.com" size="sm"></loom-avatar>
  <loom-avatar name="Extra Uno" email="extra@kyndryl.com" size="sm"></loom-avatar>
</loom-avatar-group>
\`\`\`

Atributos: \`name\`, \`email\`, \`photo-url\`, \`size\` (sm/md/lg). Partes: \`img\`, \`initials\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<AvatarStoryArgs>;

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

export const Default: Story = {
  render: ({ name, email, photoUrl, size }) => (
    <loom-avatar name={name} email={email} photo-url={photoUrl || undefined} size={size} />
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true }, docs: { description: { story: 'Tres tamaños: sm (24px), md (32px), lg (40px).' } } },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {AVATAR_SIZES.map((sz) => (
        <loom-avatar key={sz} name="David Rueda" email="david@example.com" size={sz} />
      ))}
    </div>
  ),
};

export const WithPhoto: Story = {
  parameters: { controls: { disable: true }, docs: { description: { story: 'Con `photo-url`; si la URL falla el avatar cae a iniciales automáticamente.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <loom-avatar
        name="David Rueda"
        email="david@example.com"
        photo-url="https://i.pravatar.cc/150?u=david"
        size="lg"
      />
      <loom-avatar
        name="Ana Gómez"
        email="ana@example.com"
        photo-url="https://i.pravatar.cc/150?u=ana"
        size="lg"
      />
    </div>
  ),
};

export const Group: Story = {
  parameters: { controls: { disable: true }, docs: { description: { story: '`loom-avatar-group` con `max=3`: el quinto miembro aparece como badge `+2`.' } } },
  render: () => (
    <loom-avatar-group max="3">
      <loom-avatar name="David Rueda" email="david@example.com" size="md" />
      <loom-avatar name="Ana Gómez" email="ana@example.com" size="md" />
      <loom-avatar name="Carlos López" email="carlos@example.com" size="md" />
      <loom-avatar name="María Torres" email="maria@example.com" size="md" />
      <loom-avatar name="Juan Pérez" email="juan@example.com" size="md" />
    </loom-avatar-group>
  ),
};
