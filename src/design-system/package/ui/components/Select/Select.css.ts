import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  fontSizeVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
} from '../../../tokens/index.ts';

export const label = style({
  display: 'block',
  fontSize: fontSizeVars.xs,
  fontWeight: fontWeightVars.medium,
  color: colorVars.textSecondary,
  marginBottom: spacingVars.xs,
  lineHeight: '1.5',
});

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: '48px',
  padding: `${spacingVars.sm} ${spacingVars.smMd}`,
  background: colorVars.surfaceRaised,
  border: '1px solid',
  borderColor: colorVars.borderStrong,
  borderRadius: radiusVars.md,
  cursor: 'pointer',
  boxSizing: 'border-box',
  gap: spacingVars.sm,
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  textAlign: 'left',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  selectors: {
    '&:hover:not(:disabled)': {
      borderColor: colorVars.brandAccent,
    },
  },
});

export const triggerState = styleVariants({
  default: {},
  focused: {
    borderColor: colorVars.brandAccent,
    boxShadow: '0 0 0 3px rgba(66, 217, 236, 0.4)',
    outline: 'none',
  },
  disabled: {
    background: colorVars.surfaceNeutral,
    borderColor: colorVars.borderDefault,
    cursor: 'not-allowed',
    color: colorVars.textDisabled,
  },
  error: {
    borderColor: colorVars.feedbackDanger,
  },
  open: {
    borderColor: colorVars.brandAccent,
    boxShadow: '0 0 0 3px rgba(66, 217, 236, 0.4)',
    outline: 'none',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export const value = style({
  flex: '1',
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.normal,
  color: colorVars.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const valuePlaceholder = style({
  color: colorVars.textSecondary,
});

export const chevron = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  color: colorVars.textSecondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease',
});

export const chevronOpen = style({
  transform: 'rotate(180deg)',
});

export const errorMessage = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.xs,
  marginTop: spacingVars.xs,
  fontSize: fontSizeVars.xs,
  lineHeight: '1.5',
  color: colorVars.feedbackDanger,
});
