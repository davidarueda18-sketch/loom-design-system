import React from 'react';
import figma from '@figma/code-connect';
import { TabGroup } from '../../../../../package/ui/components/TabGroup/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  TabGroup,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=250-16',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    example: () => (
      <loom-tab-group active="summary">
        <loom-tab-item value="overview" label="Overview" />
        <loom-tab-item value="details"  label="Details" />
        <loom-tab-item value="summary"  label="Summary" active="" />
        <loom-tab-item value="reports"  label="Reports"  disabled="" />
      </loom-tab-group>
    ),
  },
);
