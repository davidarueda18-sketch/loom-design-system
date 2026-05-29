import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  heightVars,
  radiusVars,
  fontSizeVars,
  fontWeightVars,
  zIndexVars,
} from '../../../tokens/index.ts';

export const host = style({
  display: 'inline-flex',
  boxSizing: 'border-box',
  selectors: {
    '&[disabled]': {
      cursor: 'not-allowed',
    },
  },
});

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  zIndex: zIndexVars.raised,
  background: colorVars.surfaceRaised,
  color: colorVars.textPrimary,
  transition: 'background 0.15s ease, color 0.15s ease',
  ':hover': {
    background: colorVars.surfaceNeutral,
  },
  ':active': {
    background: colorVars.brandAccentPressed,
  },
  ':focus-visible': {
    outline: '2px solid',
    outlineOffset: '2px',
    outlineColor: colorVars.brandAccent,
  },
  selectors: {
    '&:disabled, &[aria-disabled="true"], &:disabled:hover, &[aria-disabled="true"]:hover, &:disabled:active, &[aria-disabled="true"]:active': {
      opacity: 0.45,
      background: colorVars.surfaceSubtle,
      color: colorVars.textDisabled,
      cursor: 'not-allowed',
    },
  },
});

export const size = styleVariants({
  sm: {
    width: heightVars.sm,
    height: heightVars.sm,
    borderRadius: radiusVars.md,
  },
  md: {
    width: heightVars.md,
    height: heightVars.md,
    borderRadius: radiusVars.md,
  },
  lg: {
    width: heightVars.lg,
    height: heightVars.lg,
    borderRadius: radiusVars.lg,
  },
});

export const textLabel = styleVariants({
  sm: {
    fontSize: fontSizeVars.sm,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
  md: {
    fontSize: fontSizeVars.lg,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
  lg: {
    fontSize: fontSizeVars.xl,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
});
