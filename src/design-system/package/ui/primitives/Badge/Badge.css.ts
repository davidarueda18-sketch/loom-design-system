import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars, spacingVars, radiusVars, fontSizeVars, fontWeightVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacingVars.xs,
  paddingBlock: spacingVars.sm,
  paddingInline: spacingVars.md,
  borderRadius: radiusVars.full,
  border: '1px solid',
  boxSizing: 'border-box',
  flexShrink: 0,
  userSelect: 'none',
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.normal,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const state = styleVariants({
  default: {
    borderColor: colorVars.textDisabled,
    color: colorVars.textDisabled,
  },
  progress: {
    borderColor: colorVars.brandAccent,
    color: colorVars.brandAccent,
  },
  success: {
    borderColor: colorVars.feedbackSuccess,
    color: colorVars.feedbackSuccess,
  },
  warning: {
    borderColor: colorVars.feedbackWarning,
    color: colorVars.feedbackWarning,
  },
  danger: {
    borderColor: colorVars.feedbackDanger,
    color: colorVars.feedbackDanger,
  },
  info: {
    borderColor: colorVars.feedbackInfo,
    color: colorVars.feedbackInfo,
  },
});

// Inherits color from parent via currentColor — no per-state overrides needed.
export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: radiusVars.full,
  flexShrink: 0,
  backgroundColor: 'currentColor',
});
