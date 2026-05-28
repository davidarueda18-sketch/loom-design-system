import figma from '@figma/code-connect';
import { Modal } from '../../../../../package/ui/components/Modal/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Modal,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=192-66',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      // Size — 'md' is the default → omit attribute when MD (Law: no default values)
      size: figma.enum('Size', {
        SM: 'sm',
        MD: undefined,
        LG: 'lg',
        XL: 'xl',
      }),
      title: figma.string('Title'),
    },
    example: ({ size, title }) => (
      <loom-modal open="" size={size} title={title}>
        {/* Slot content */}
        <loom-button slot="footer" variant="outline">Cancelar</loom-button>
        <loom-button slot="footer" variant="primary">Confirmar</loom-button>
      </loom-modal>
    ),
  },
);
