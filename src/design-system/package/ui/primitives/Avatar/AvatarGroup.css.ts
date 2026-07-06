import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const item = style({
  selectors: {
    '&:not(:first-child)': {
      marginInlineStart: '-8px',
    },
    '&:hover': {
      zIndex: 10,
      transform: 'scale(1.1)',
    },
  },
  transition: 'transform 200ms ease',
});

export const overflow = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.15)',
  color: '#ffffff',
  fontWeight: 500,
  flexShrink: 0,
  selectors: {
    '&:not(:first-child)': {
      marginInlineStart: '-8px',
    },
  },
});
