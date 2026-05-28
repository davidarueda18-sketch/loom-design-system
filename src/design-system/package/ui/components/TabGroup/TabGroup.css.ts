import { style } from '@vanilla-extract/css';
import { colorVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  borderBottom: `1px solid ${colorVars.borderDefault}`,
});
