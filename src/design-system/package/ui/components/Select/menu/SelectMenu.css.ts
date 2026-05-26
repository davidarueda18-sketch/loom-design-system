import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  fontSizeVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  shadowVars,
  zIndexVars,
} from '../../../../tokens/index.ts';

// ─── Panel (loom-select-menu) ─────────────────────────────────────────────────

export const panel = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: zIndexVars.dropdown,
  background: colorVars.surfaceRaised,
  border: '1px solid',
  borderColor: colorVars.borderDefault,
  borderRadius: radiusVars.md,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  boxShadow: shadowVars.lg,
  maxHeight: '296px',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: spacingVars.xs,
  paddingBottom: spacingVars.xs,
  boxSizing: 'border-box',
});

// ─── Option row (loom-select-option) ─────────────────────────────────────────

export const optionRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.sm,
  paddingTop: '13px',
  paddingBottom: '13px',
  paddingLeft: spacingVars.md,
  paddingRight: spacingVars.md,
  cursor: 'pointer',
  userSelect: 'none',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'background 0.1s ease',
});

export const optionRowState = styleVariants({
  default: {
    background: colorVars.surfaceRaised,
    color: colorVars.textPrimary,
    selectors: {
      '&:hover': { background: colorVars.surfaceNeutral },
    },
  },
  selected: {
    background: colorVars.brandAccentSubtle,
    color: colorVars.brandAccent,
    selectors: {
      '&:hover': { background: colorVars.brandAccentSubtle },
    },
  },
  disabled: {
    background: colorVars.surfaceRaised,
    color: colorVars.textDisabled,
    cursor: 'not-allowed',
  },
});

export const optionRowFocused = style({
  boxShadow: `inset 0 0 0 2px ${colorVars.brandAccent}`,
});

export const optionTextContainer = style({
  flex: '1',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const optionLabel = style({
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.normal,
  lineHeight: '1.5',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'inherit',
});

export const optionLabelSelected = style({
  fontWeight: fontWeightVars.medium,
});

export const optionDescription = style({
  fontSize: fontSizeVars.xs,
  color: colorVars.textSecondary,
  lineHeight: '1.5',
});

export const optionLeadingIcon = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'inherit',
});

export const optionCheck = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  color: colorVars.brandAccent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
