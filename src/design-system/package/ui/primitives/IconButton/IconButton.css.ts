import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars, radiusVars } from '../../../tokens/index.ts';

export const host = style({
  display: 'inline-flex',
  boxSizing: 'border-box',
});

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: radiusVars.full,
  transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
  selectors: {
    '&:disabled, &[aria-disabled="true"]': {
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
});

export const variant = styleVariants({
  filled: {
    background: colorVars.surfaceRaised,
    color: colorVars.textPrimary,
    border: 'none',
    ':hover':  { background: colorVars.brandAccentPressed },
    ':active': { background: colorVars.brandAccentPressed },
    ':focus-visible': {
      border: `2px solid ${colorVars.brandAccent}`,
    },
    selectors: {
      '&[aria-pressed="true"]': {
        background: colorVars.brandAccentPressed,
        border: `2px solid ${colorVars.brandAccent}`,
      },
      '&:disabled, &[aria-disabled="true"]': {
        background: colorVars.surfaceSubtle,
        border: 'none',
      },
      '&:disabled ::slotted(*), &[aria-disabled="true"] ::slotted(*)': {
        opacity: '0.3',
      },
    },
  },

  ghost: {
    background: 'transparent',
    color: colorVars.textPrimary,
    border: 'none',
    ':hover':  { background: colorVars.brandAccentPressed },
    ':active': { background: colorVars.brandAccentPressed },
    ':focus-visible': {
      border: `2px solid ${colorVars.brandAccent}`,
    },
    selectors: {
      '&[aria-pressed="true"]': {
        background: colorVars.brandAccentPressed,
        border: `2px solid ${colorVars.brandAccent}`,
      },
      '&:disabled, &[aria-disabled="true"]': {
        background: 'transparent',
      },
      '&:disabled ::slotted(*), &[aria-disabled="true"] ::slotted(*)': {
        opacity: '0.3',
      },
    },
  },

  outline: {
    background: 'transparent',
    color: colorVars.textPrimary,
    border: `1.5px solid ${colorVars.borderStrong}`,
    ':hover': {
      background: colorVars.brandAccentPressed,
      borderColor: colorVars.brandAccent,
    },
    ':active': {
      background: colorVars.brandAccentPressed,
      border: 'none',
    },
    ':focus-visible': {
      borderColor: colorVars.brandAccent,
    },
    selectors: {
      '&[aria-pressed="true"]': {
        background: colorVars.brandAccentPressed,
        borderColor: colorVars.brandAccent,
      },
      '&:disabled, &[aria-disabled="true"]': {
        background: 'transparent',
        borderColor: colorVars.borderStrong,
      },
      '&:disabled ::slotted(*), &[aria-disabled="true"] ::slotted(*)': {
        opacity: '0.3',
      },
    },
  },

  brand: {
    background: colorVars.brandAccent,
    color: colorVars.textInverse,
    border: `1px solid ${colorVars.borderDefault}`,
    ':hover': {
      background: colorVars.brandAccentPressed,
      color: colorVars.textPrimary,
      border: 'none',
    },
    ':active': {
      background: colorVars.brandAccentPressed,
      color: colorVars.textPrimary,
      border: 'none',
    },
    ':focus-visible': {
      background: colorVars.brandAccent,
      color: colorVars.textInverse,
      border: `2px solid ${colorVars.borderDefault}`,
    },
    selectors: {
      '&[aria-pressed="true"]': {
        background: colorVars.brandAccentPressed,
        color: colorVars.textPrimary,
        border: `2px solid ${colorVars.textPrimary}`,
      },
      '&:disabled, &[aria-disabled="true"]': {
        background: colorVars.surfaceSubtle,
        border: 'none',
      },
      '&:disabled ::slotted(*), &[aria-disabled="true"] ::slotted(*)': {
        opacity: '0.3',
      },
    },
  },
});

export const size = styleVariants({
  sm: { width: '32px', height: '32px', padding: '6px' },
  md: { width: '40px', height: '40px', padding: '8px' },
  lg: { width: '48px', height: '48px', padding: '12px' },
});
