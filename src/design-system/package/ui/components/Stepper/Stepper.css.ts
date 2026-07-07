import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: '100%',
});

export const connector = style({
  flex: '1 0 0',
  height: '1px',
  alignSelf: 'flex-start',
  minWidth: '8px',
  flexShrink: 1,
});

// marginTop centers the connector on the step circle (half of its height).
export const connectorSize = styleVariants({
  sm: { marginTop: '16px' },
  md: { marginTop: '20px' },
  lg: { marginTop: '24px' },
});

export const connectorState = styleVariants({
  default: { backgroundColor: colorVars.textDisabled },
  active: { backgroundColor: colorVars.brandAccent },
  completed: { backgroundColor: colorVars.brandAccent },
});
