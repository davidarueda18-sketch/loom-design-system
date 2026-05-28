import React from 'react';
import figma from '@figma/code-connect';
import { TabItem } from '../../../../../package/ui/primitives/TabItem/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  TabItem,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=239-3102',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      active: figma.enum('Status', {
        Selected: true,
      }),
      disabled: figma.enum('Status', {
        Disabled: true,
      }),
      showIcon: figma.boolean('Has Icon'),
    },
    example: ({ label, active, disabled, showIcon }) => (
      <loom-tab-item
        value="tab"
        label={label}
        active={active}
        disabled={disabled}
        show-icon={showIcon}
      />
    ),
  },
);
