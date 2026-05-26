import figma from '@figma/code-connect';
import { Stepper } from '../../../../../package/ui/components/Stepper/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Stepper,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=65-177',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    example: () => (
      <loom-stepper
        steps='["Paso 1", "Paso 2", "Paso 3"]'
        current={0}
      />
    ),
  },
);
