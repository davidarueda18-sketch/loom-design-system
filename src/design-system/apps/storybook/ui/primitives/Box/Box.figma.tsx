import figma from '@figma/code-connect';
import { Box } from '../../../../../package/ui/primitives/Box/index.ts';
import '../../../loom-web-components.d.ts';

const BOX_URL = 'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=171-240';

const tokenEnum = figma.enum('Token', {
  xs:  'xs',
  sm:  'sm',
  md:  'md',
  lg:  'lg',
  xl:  'xl',
  xl2: 'xl2',
});

// Axis=all → padding attribute
figma.connect(Box, BOX_URL, {
  variant: { Axis: 'all' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: { token: tokenEnum },
  example: ({ token }) => (
    <loom-box padding={token}>
      {/* content */}
    </loom-box>
  ),
});

// Axis=x → padding-x attribute
figma.connect(Box, BOX_URL, {
  variant: { Axis: 'x' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: { token: tokenEnum },
  example: ({ token }) => (
    <loom-box padding-x={token}>
      {/* content */}
    </loom-box>
  ),
});

// Axis=y → padding-y attribute
figma.connect(Box, BOX_URL, {
  variant: { Axis: 'y' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: { token: tokenEnum },
  example: ({ token }) => (
    <loom-box padding-y={token}>
      {/* content */}
    </loom-box>
  ),
});
