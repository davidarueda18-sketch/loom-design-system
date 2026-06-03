import { globalStyle, style } from '@vanilla-extract/css';
import {
  colorVars,
  fontFamilyVars,
  fontWeightVars,
  motionVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacingVars.sm,
  padding: spacingVars.md,
  boxSizing: 'border-box',
  borderRadius: radiusVars.lg,
  backgroundColor: colorVars.surfaceRaised,
  color: colorVars.textPrimary,
  fontFamily: fontFamilyVars.sans,
  minWidth: '320px',
});

export const dropzone = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacingVars.smMd,
  minHeight: '256px',
  paddingInline: spacingVars.smMd,
  paddingBlock: spacingVars.sm,
  boxSizing: 'border-box',
  borderRadius: radiusVars.lg,
  border: `2px dashed ${colorVars.borderDefault}`,
  backgroundColor: 'transparent',
  textAlign: 'center',
  cursor: 'pointer',
  outline: 'none',
  transitionProperty: 'border-color, background-color',
  transitionDuration: motionVars.durationFast,
  transitionTimingFunction: motionVars.easingEaseOut,
  selectors: {
    '&:focus-visible': {
      borderColor: colorVars.brandAccent,
      boxShadow: `0 0 0 2px ${colorVars.brandAccentSubtle}`,
    },
    '&:hover': {
      borderColor: colorVars.borderInteractive,
    },
  },
});

export const dropzoneDragOver = style({
  borderColor: colorVars.brandAccent,
  backgroundColor: colorVars.brandAccentSubtle,
});

export const dropzoneDisabled = style({
  cursor: 'not-allowed',
  opacity: 0.6,
  selectors: {
    '&:hover': {
      borderColor: colorVars.borderDefault,
    },
  },
});

export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  color: colorVars.textPrimary,
});

export const label = style({
  margin: 0,
  fontSize: typographyVars.headingH5.fontSize,
  fontWeight: fontWeightVars.bold,
  lineHeight: typographyVars.headingH5.lineHeight,
  letterSpacing: typographyVars.headingH5.letterSpacing,
  color: colorVars.textPrimary,
  wordBreak: 'break-word',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const description = style({
  margin: 0,
  fontSize: typographyVars.bodySm.fontSize,
  fontWeight: typographyVars.bodySm.fontWeight,
  lineHeight: typographyVars.bodySm.lineHeight,
  letterSpacing: typographyVars.bodySm.letterSpacing,
  color: colorVars.textSecondary,
  wordBreak: 'break-word',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const fileInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const files = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacingVars.sm,
  textAlign: 'start',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const fileRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacingVars.xxs,
  paddingInline: spacingVars.smMd,
});

export const fileHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacingVars.sm,
  minWidth: 0,
});

export const fileName = style({
  flex: '1 1 auto',
  minWidth: 0,
  fontSize: typographyVars.bodySm.fontSize,
  fontWeight: fontWeightVars.medium,
  lineHeight: typographyVars.bodySm.lineHeight,
  color: colorVars.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const fileMeta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacingVars.sm,
  fontSize: typographyVars.labelSm.fontSize,
  fontWeight: fontWeightVars.medium,
  lineHeight: typographyVars.labelSm.lineHeight,
  letterSpacing: typographyVars.labelSm.letterSpacing,
});

export const fileMetaSecondary = style({
  color: colorVars.textSecondary,
  whiteSpace: 'nowrap',
});

export const fileMetaPrimary = style({
  color: colorVars.textPrimary,
  whiteSpace: 'nowrap',
});

export const fileMetaError = style({
  color: colorVars.feedbackDanger,
  whiteSpace: 'nowrap',
});

export const fileProgress = style({
  display: 'block',
});

export const removeButton = style({
  flex: '0 0 auto',
});

globalStyle(`${icon} svg`, {
  width: '100%',
  height: '100%',
});

globalStyle(`${icon} ::slotted(*)`, {
  width: '100%',
  height: '100%',
});
