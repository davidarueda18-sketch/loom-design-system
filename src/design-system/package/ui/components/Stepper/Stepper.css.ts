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
  marginTop: '20px',
  minWidth: '8px',
  flexShrink: 1,
});

export const connectorState = styleVariants({
  default: { backgroundColor: colorVars.textDisabled },
  active: { backgroundColor: colorVars.brandAccent },
  completed: { backgroundColor: colorVars.brandAccent },
});
