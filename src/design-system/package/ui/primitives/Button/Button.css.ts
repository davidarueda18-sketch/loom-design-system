import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars, typographyVars } from '../../../tokens/index.ts';

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
  gap: '8px',
  boxSizing: 'border-box',
  border: '2px solid transparent',
  cursor: 'pointer',
  transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
  textDecoration: 'none',
  ':focus-visible': {
    outline: 'none',
  },
  selectors: {
    '&:disabled, &[aria-disabled="true"]': {
      cursor: 'not-allowed',
    },
  },
});

export const variant = styleVariants({
  primary: {
    background: colorVars.brandPrimary,
    color: colorVars.textOnBrand,
    ':hover': { background: colorVars.brandPrimaryHover },
    ':active': { background: colorVars.brandPrimaryPressed },
    ':focus-visible': { boxShadow: `0 0 0 2px ${colorVars.textOnBrand}` },
    selectors: {
      '&:disabled, &[aria-disabled="true"], &:disabled:hover, &[aria-disabled="true"]:hover, &:disabled:active, &[aria-disabled="true"]:active': {
        background: colorVars.surfaceSubtle,
        color: colorVars.textDisabled,
        borderColor: 'transparent',
        boxShadow: 'none',
      },
    },
  },
  outline: {
    background: 'transparent',
    color: colorVars.textPrimary,
    border: `2px solid ${colorVars.borderInteractive}`,
    ':hover': {
      background: colorVars.brandAccentHover,
      borderColor: colorVars.brandAccent,
    },
    ':active': {
      background: colorVars.brandAccentPressed,
      color: colorVars.brandAccent,
      borderColor: colorVars.brandAccent,
    },
    ':focus-visible': {
      color: colorVars.brandAccent,
      borderColor: colorVars.brandAccent,
      boxShadow: `0 0 0 2px ${colorVars.brandAccent}`,
    },
    selectors: {
      '&:disabled, &[aria-disabled="true"], &:disabled:hover, &[aria-disabled="true"]:hover, &:disabled:active, &[aria-disabled="true"]:active': {
        background: 'transparent',
        borderColor: 'transparent',
        color: colorVars.textDisabled,
        boxShadow: 'none',
      },
    },
  },
  text: {
    background: 'transparent',
    color: colorVars.brandAccent,
    ':hover': { background: colorVars.brandAccentHover },
    ':active': { background: colorVars.brandAccentPressed, color: colorVars.brandAccent },
    ':focus-visible': {
      boxShadow: `0 0 0 2px ${colorVars.brandAccent}`,
      color: colorVars.brandAccent,
    },
    selectors: {
      '&:disabled, &[aria-disabled="true"], &:disabled:hover, &[aria-disabled="true"]:hover, &:disabled:active, &[aria-disabled="true"]:active': {
        background: 'transparent',
        color: colorVars.textDisabled,
        borderColor: 'transparent',
        boxShadow: 'none',
      },
    },
  },
});

export const size = styleVariants({
  sm: {
    height: '28px', padding: '6px 16px', borderRadius: '6px',
    fontSize: typographyVars.labelSm.fontSize,
    fontWeight: typographyVars.labelSm.fontWeight,
    lineHeight: typographyVars.labelSm.lineHeight,
    letterSpacing: typographyVars.labelSm.letterSpacing,
  },
  md: {
    height: '36px', padding: '8px 16px', borderRadius: '8px',
    fontSize: typographyVars.labelBase.fontSize,
    fontWeight: typographyVars.labelBase.fontWeight,
    lineHeight: typographyVars.labelBase.lineHeight,
    letterSpacing: typographyVars.labelBase.letterSpacing,
  },
  lg: {
    height: '44px', padding: '12px 24px', borderRadius: '8px',
    fontSize: typographyVars.labelLg.fontSize,
    fontWeight: typographyVars.labelLg.fontWeight,
    lineHeight: typographyVars.labelLg.lineHeight,
    letterSpacing: typographyVars.labelLg.letterSpacing,
  },
});
