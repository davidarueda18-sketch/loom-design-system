import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  paletteVars,
  fontSizeVars,
  fontWeightVars,
  spacingVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacingVars.sm,
  cursor: 'pointer',
  userSelect: 'none',
});

export const rootDisabled = style({
  cursor: 'not-allowed',
});

export const track = style({
  position: 'relative',
  width: '44px',
  height: '24px',
  borderRadius: '9999px',
  flexShrink: 0,
  transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
  boxSizing: 'border-box',
  cursor: 'inherit',
  // Focus target: allow keyboard focus via tabindex
  ':focus-visible': {
    outline: 'none',
    boxShadow: `0 0 0 2px ${colorVars.brandAccent}`,
  },
});

export const trackState = styleVariants({
  off: {
    backgroundColor: paletteVars.neutral700,
    selectors: {
      '&:hover': { backgroundColor: colorVars.borderStrong },
    },
  },
  on: {
    backgroundColor: colorVars.brandAccentSubtle,
    selectors: {
      '&:hover': { backgroundColor: colorVars.brandAccentHover },
    },
  },
  disabled: {
    backgroundColor: colorVars.surfaceNeutral,
  },
});

export const thumb = style({
  position: 'absolute',
  top: '3px',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  transition: 'left 0.15s ease',
  pointerEvents: 'none',
});

export const thumbState = styleVariants({
  off: {
    left: '3px',
    backgroundColor: colorVars.textInverse,
  },
  on: {
    left: '23px',
    backgroundColor: colorVars.brandAccent,
  },
  disabledOff: {
    left: '3px',
    backgroundColor: colorVars.borderInteractive,
  },
  disabledOn: {
    left: '23px',
    backgroundColor: colorVars.borderInteractive,
  },
});

export const label = style({
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.medium,
  lineHeight: '1.5',
  color: colorVars.textPrimary,
  transition: 'color 0.15s ease',
});

export const labelOn = style({
  color: colorVars.textPrimary,
});

export const labelDisabled = style({
  color: colorVars.textDisabled,
});
