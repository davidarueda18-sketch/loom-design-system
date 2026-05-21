import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'inline',
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  ':focus-visible': {
    outline: `2px solid ${colorVars.brandAccent}`,
    outlineOffset: '2px',
    borderRadius: '2px',
  },
  selectors: {
    '&:disabled, &[aria-disabled="true"]': {
      color: colorVars.textDisabled,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      textDecoration: 'none',
    },
  },
});

export const color = styleVariants({
  default: {
    color: colorVars.brandAccent,
  },
  inherit: {
    color: 'inherit',
  },
});

export const underline = styleVariants({
  always: {
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  hover: {
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
  },
  none: {
    textDecoration: 'none',
  },
});
