import { globalStyle, style } from '@vanilla-extract/css';
import {
  colorVars,
  fontFamilyVars,
  spacingVars,
  radiusVars,
  typographyVars,
  fontWeightVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  width: '312px',
  minHeight: '172px',
  padding: spacingVars.md,
  gap: spacingVars.smMd,
  boxSizing: 'border-box',
  borderRadius: radiusVars.lg,
  border: `1px solid ${colorVars.borderDefault}`,
  backgroundColor: colorVars.surfaceRaised,
  color: colorVars.textPrimary,
  fontFamily: fontFamilyVars.sans,
  overflow: 'hidden',
});

export const header = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'start',
  gap: spacingVars.sm,
  minHeight: '32px',
});

export const title = style({
  margin: 0,
  padding: 0,
  minWidth: 0,
  fontSize: typographyVars.headingH5.fontSize,
  fontWeight: fontWeightVars.bold,
  lineHeight: typographyVars.headingH5.lineHeight,
  letterSpacing: typographyVars.headingH5.letterSpacing,
  color: colorVars.textPrimary,
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const titleSlot = style({
  display: 'block',
  minWidth: 0,
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  minHeight: '62px',
  justifyContent: 'center',
});

export const structuredBody = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'center',
  columnGap: spacingVars.smMd,
  minHeight: '64px',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const metric = style({
  margin: 0,
  fontSize: typographyVars.displayLg.fontSize,
  fontWeight: fontWeightVars.bold,
  lineHeight: typographyVars.displayLg.lineHeight,
  letterSpacing: typographyVars.displayLg.letterSpacing,
  color: colorVars.textPrimary,
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const description = style({
  margin: 0,
  maxWidth: '132px',
  fontSize: typographyVars.caption.fontSize,
  fontWeight: typographyVars.caption.fontWeight,
  lineHeight: typographyVars.caption.lineHeight,
  letterSpacing: typographyVars.caption.letterSpacing,
  textAlign: 'start',
  color: colorVars.textPrimary,
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const customBody = style({
  display: 'block',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const bodySlot = style({
  display: 'block',
});

export const footer = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'end',
  gap: spacingVars.sm,
  marginTop: 'auto',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const footerContent = style({
  minWidth: 0,
  color: colorVars.textSecondary,
  fontSize: typographyVars.caption.fontSize,
  fontWeight: typographyVars.caption.fontWeight,
  lineHeight: typographyVars.caption.lineHeight,
  letterSpacing: typographyVars.caption.letterSpacing,
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const footerSlot = style({
  display: 'block',
});

export const action = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  color: colorVars.brandAccent,
  fontSize: typographyVars.labelSm.fontSize,
  fontWeight: typographyVars.labelSm.fontWeight,
  lineHeight: typographyVars.labelSm.lineHeight,
  letterSpacing: typographyVars.labelSm.letterSpacing,
  whiteSpace: 'nowrap',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
  },
});

export const actionSlot = style({
  display: 'block',
});

globalStyle(`${titleSlot}::slotted(*)`, {
  margin: 0,
  color: colorVars.textPrimary,
  fontSize: typographyVars.headingH5.fontSize,
  fontWeight: fontWeightVars.bold,
  lineHeight: typographyVars.headingH5.lineHeight,
  letterSpacing: typographyVars.headingH5.letterSpacing,
});

globalStyle(`${bodySlot}::slotted(*)`, {
  marginBlock: 0,
});

globalStyle(`${footerSlot}::slotted(*)`, {
  margin: 0,
});

globalStyle(`${actionSlot}::slotted(a)`, {
  color: colorVars.brandAccent,
  textDecoration: 'underline',
});