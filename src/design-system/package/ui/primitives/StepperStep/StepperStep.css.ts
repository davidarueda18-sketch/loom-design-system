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
  '@media': {
    'screen and (max-width: 767px)': {
      width: '40px',
      minWidth: '40px',
      maxWidth: '40px',
    },
  },
});

export const circle = style({
  borderRadius: radiusVars.full,
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
});

export const circleSize = styleVariants({
  sm: { width: '32px', height: '32px' },
  md: { width: '40px', height: '40px' },
  lg: { width: '48px', height: '48px' },
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
  textAlign: 'center',
  lineHeight: 'normal',
  fontStyle: 'normal',
  fontWeight: 400,
});

export const numberSize = styleVariants({
  sm: { fontSize: fontSizeVars.lg },
  md: { fontSize: fontSizeVars.xl },
  lg: { fontSize: fontSizeVars.xl2 },
});

export const numberState = styleVariants({
  default: { color: colorVars.textDisabled },
  active: { color: colorVars.brandAccent },
  completed: { color: colorVars.surfaceNeutral },
});

export const label = style({
  display: 'inline-block',
  textAlign: 'center',
  minWidth: 'min-content',
  maxWidth: '96px',
  lineHeight: '1.4',
  whiteSpace: 'normal',
  overflowWrap: 'normal',
  wordBreak: 'normal',
  hyphens: 'none',
  fontStyle: 'normal',
  fontWeight: 400,
});

export const labelSize = styleVariants({
  sm: { fontSize: fontSizeVars.sm },
  md: { fontSize: fontSizeVars.base },
  lg: { fontSize: fontSizeVars.lg },
});

export const labelState = styleVariants({
  default: {
    color: colorVars.textDisabled,
    '@media': {
      'screen and (max-width: 767px)': { display: 'none' },
    },
  },
  active: { color: colorVars.brandAccent },
  completed: {
    color: colorVars.brandAccent,
    '@media': {
      'screen and (max-width: 767px)': { display: 'none' },
    },
  },
});
