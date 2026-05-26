import figma from '@figma/code-connect';
import { Icon } from '../../../../../package/ui/primitives/Icon/index.ts';
import '../../../loom-web-components.d.ts';

const URL =
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=76-365';

figma.connect(Icon, URL, {
  variant: { variant: 'outline' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  example: () => (
    <loom-icon>
      <svg>{/* Heroicons 24/outline — e.g. import { BellIcon } from '@heroicons/react/24/outline' */}</svg>
    </loom-icon>
  ),
});

figma.connect(Icon, URL, {
  variant: { variant: 'solid' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  example: () => (
    <loom-icon>
      <svg>{/* Heroicons 24/solid — e.g. import { BellIcon } from '@heroicons/react/24/solid' */}</svg>
    </loom-icon>
  ),
});

figma.connect(Icon, URL, {
  variant: { variant: 'mini' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  example: () => (
    <loom-icon size="mini">
      <svg>{/* Heroicons 20/solid — e.g. import { BellIcon } from '@heroicons/react/20/solid' */}</svg>
    </loom-icon>
  ),
});

figma.connect(Icon, URL, {
  variant: { variant: 'micro' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  example: () => (
    <loom-icon size="sm">
      <svg>{/* Heroicons 16/solid — e.g. import { BellIcon } from '@heroicons/react/16/solid' */}</svg>
    </loom-icon>
  ),
});
