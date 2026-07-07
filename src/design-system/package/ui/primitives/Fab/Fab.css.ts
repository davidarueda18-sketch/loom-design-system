import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
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
    width: '20px',
    height: '20px',
    borderRadius: radiusVars.md,
  },
  md: {
    width: '24px',
    height: '24px',
    borderRadius: radiusVars.md,
  },
  lg: {
    width: '28px',
    height: '28px',
    borderRadius: radiusVars.md,
  },
  xl: {
    width: '32px',
    height: '32px',
    borderRadius: radiusVars.md,
  },
  xl2: {
    width: '36px',
    height: '36px',
    borderRadius: radiusVars.md,
  },
});

export const textLabel = styleVariants({
  sm: {
    fontSize: fontSizeVars.xxs,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
  md: {
    fontSize: fontSizeVars.xs,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
  lg: {
    fontSize: fontSizeVars.sm,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
  xl: {
    fontSize: fontSizeVars.base,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
  xl2: {
    fontSize: fontSizeVars.lg,
    fontWeight: fontWeightVars.medium,
    lineHeight: 1,
  },
});
