import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  fontSizeVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'flex-end',
  gap: spacingVars.sm,
  cursor: 'pointer',
  userSelect: 'none',
});

export const rootDisabled = style({
  cursor: 'not-allowed',
});

export const box = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid',
  borderRadius: radiusVars.xs,
  boxSizing: 'border-box',
  flexShrink: 0,
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  borderColor: colorVars.textPrimary,
});

export const boxSize = styleVariants({
  sm: { width: '16px', height: '16px', padding: spacingVars.xxs },
  md: { width: '20px', height: '20px', padding: spacingVars.xxs },
  lg: { width: '24px', height: '24px', padding: spacingVars.xs },
});

export const boxState = styleVariants({
  default: {
    borderColor: colorVars.textPrimary,
    color: colorVars.textPrimary,
    selectors: {
      '&:hover': { borderColor: colorVars.brandAccent },
      '&:focus-visible': {
        outline: 'none',
        borderColor: colorVars.brandAccent,
        boxShadow: '0 0 0 3px rgba(66, 217, 236, 0.4)',
      },
    },
  },
  checked: {
    borderColor: colorVars.brandAccent,
    color: colorVars.brandAccent,
    selectors: {
      '&:hover': { borderColor: colorVars.brandAccentHover },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(66, 217, 236, 0.4)',
      },
    },
  },
  indeterminate: {
    borderColor: colorVars.brandAccent,
    color: colorVars.brandAccent,
    selectors: {
      '&:hover': { borderColor: colorVars.brandAccentHover },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(66, 217, 236, 0.4)',
      },
    },
  },
  disabled: {
    borderColor: colorVars.textDisabled,
    color: colorVars.textDisabled,
    cursor: 'not-allowed',
  },
});

export const iconWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: 'inherit',
});

export const iconSize = styleVariants({
  sm: { width: '10px', height: '10px' },
  md: { width: '13px', height: '13px' },
  lg: { width: '16px', height: '16px' },
});

export const label = style({
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.medium,
  lineHeight: '1.5',
  color: colorVars.textPrimary,
});

export const labelDisabled = style({
  color: colorVars.textDisabled,
});

export const boxShape = styleVariants({
  square: { borderRadius: radiusVars.xs },
  circle: { borderRadius: '50%' },
});
