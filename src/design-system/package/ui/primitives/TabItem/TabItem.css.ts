import { style } from '@vanilla-extract/css';
import { colorVars, radiusVars, fontSizeVars, fontWeightVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-end',
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '16px',
  paddingRight: '16px',
  borderTopLeftRadius: radiusVars.sm,
  borderTopRightRadius: radiusVars.sm,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 150ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: colorVars.brandAccentHover,
    },
  },
});

export const rootActive = style({
  backgroundColor: colorVars.brandAccentSubtle,
  borderBottom: `2px solid ${colorVars.brandAccent}`,
  selectors: {
    '&:hover': {
      backgroundColor: colorVars.brandAccentSubtle,
    },
  },
});

export const rootDisabled = style({
  cursor: 'not-allowed',
  pointerEvents: 'none',
});

export const label = style({
  fontSize: fontSizeVars.lg,
  fontWeight: fontWeightVars.medium,
  lineHeight: '1.2',
  color: colorVars.textPrimary,
  whiteSpace: 'nowrap',
});

export const labelDisabled = style({
  color: colorVars.textDisabled,
});
