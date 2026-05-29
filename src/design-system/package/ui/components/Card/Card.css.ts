import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  spacingVars,
  radiusVars,
  shadowVars,
  typographyVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'block',
  width: '320px',
  borderRadius: radiusVars.lg,
  overflow: 'hidden',
  boxSizing: 'border-box',
});

export const variantMap = styleVariants({
  default: {
    backgroundColor: colorVars.surfaceRaised,
  },
  elevated: {
    backgroundColor: colorVars.surfaceRaised,
    boxShadow: shadowVars.md,
  },
  outlined: {
    backgroundColor: colorVars.surfaceNeutral,
    border: `1px solid ${colorVars.borderDefault}`,
  },
});

export const imageSlot = style({
  overflow: 'hidden',
  flexShrink: 0,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  padding: spacingVars.md,
  gap: spacingVars.smMd,
  boxSizing: 'border-box',
});

export const title = style({
  margin: 0,
  padding: 0,
  fontSize: typographyVars.headingH5.fontSize,
  fontWeight: typographyVars.headingH5.fontWeight,
  lineHeight: typographyVars.headingH5.lineHeight,
  letterSpacing: typographyVars.headingH5.letterSpacing,
  color: colorVars.textPrimary,
});

export const description = style({
  margin: 0,
  padding: 0,
  fontSize: typographyVars.bodySm.fontSize,
  fontWeight: typographyVars.bodySm.fontWeight,
  lineHeight: typographyVars.bodySm.lineHeight,
  letterSpacing: typographyVars.bodySm.letterSpacing,
  color: colorVars.textSecondary,
});

export const cta = style({
  display: 'flex',
  justifyContent: 'flex-end',
});
