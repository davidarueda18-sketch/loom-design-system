import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars } from '../../../tokens/index.ts';

export const host = style({ display: 'contents' });

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
  textDecoration: 'none',
  ':focus-visible': {
    outline: '2px solid',
    outlineOffset: '2px',
  },
  selectors: {
    '&:disabled, &[aria-disabled="true"]': {
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
});

export const variant = styleVariants({
  primary: {
    background: colorVars.brandPrimary,
    color: colorVars.textOnBrand,
    border: 'none',
    ':hover': { background: colorVars.brandPrimaryHover },
    ':active': { background: colorVars.brandPrimaryPressed },
    ':focus-visible': { outlineColor: colorVars.textOnBrand },
    selectors: {
      '&:disabled, &[aria-disabled="true"]': {
        background: colorVars.surfaceSubtle,
        color: colorVars.textDisabled,
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
      borderColor: 'transparent',
    },
    ':focus-visible': {
      outline: 'none',
      color: colorVars.brandAccent,
      borderColor: colorVars.brandAccent,
    },
    selectors: {
      '&:disabled, &[aria-disabled="true"]': {
        border: 'none',
        color: colorVars.textDisabled,
      },
    },
  },
  text: {
    background: 'transparent',
    color: colorVars.brandAccent,
    border: 'none',
    ':hover': { background: colorVars.brandAccentHover },
    ':active': { background: colorVars.brandAccentPressed, color: colorVars.brandAccent },
    ':focus-visible': { outlineColor: colorVars.brandAccent, color: colorVars.brandAccent },
    selectors: {
      '&:disabled, &[aria-disabled="true"]': {
        color: colorVars.textDisabled,
      },
    },
  },
});

export const size = styleVariants({
  sm: { height: '28px', padding: '6px 16px', borderRadius: '6px' },
  md: { height: '36px', padding: '8px 16px', borderRadius: '8px' },
  lg: { height: '44px', padding: '12px 24px', borderRadius: '8px' },
});
