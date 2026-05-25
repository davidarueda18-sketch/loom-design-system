import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars, spacingVars, radiusVars, fontSizeVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacingVars.xs,
  width: 'fit-content',
  minWidth: 'min-content',
  maxWidth: '96px',
  flexShrink: 0,
});

export const circle = style({
  width: '40px',
  height: '40px',
  borderRadius: radiusVars.full,
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
});

export const circleState = styleVariants({
  default: {
    backgroundColor: colorVars.surfaceNeutral,
    borderColor: colorVars.textDisabled,
  },
  active: {
    backgroundColor: colorVars.brandAccentSubtle,
    borderColor: colorVars.brandAccent,
  },
  completed: {
    backgroundColor: colorVars.brandAccent,
    borderColor: colorVars.brandAccent,
  },
});

export const number = style({
  fontSize: fontSizeVars.xl,
  textAlign: 'center',
  lineHeight: 'normal',
  fontStyle: 'normal',
  fontWeight: 400,
});

export const numberState = styleVariants({
  default: { color: colorVars.textDisabled },
  active: { color: colorVars.brandAccent },
  completed: { color: colorVars.surfaceNeutral },
});

export const label = style({
  display: 'inline-block',
  fontSize: fontSizeVars.base,
  textAlign: 'center',
  minWidth: 'min-content',
  maxWidth: '96px',
  lineHeight: '1.6',
  whiteSpace: 'normal',
  overflowWrap: 'normal',
  wordBreak: 'normal',
  hyphens: 'none',
  fontStyle: 'normal',
  fontWeight: 400,
});

export const labelState = styleVariants({
  default: { color: colorVars.textDisabled },
  active: { color: colorVars.brandAccent },
  completed: { color: colorVars.brandAccent },
});
