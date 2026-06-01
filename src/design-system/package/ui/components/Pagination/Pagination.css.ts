import { globalStyle, style } from '@vanilla-extract/css';
import {
  colorVars,
  fontFamilyVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacingVars.sm,
  rowGap: spacingVars.sm,
  paddingInline: spacingVars.md,
  paddingBlock: spacingVars.sm,
  backgroundColor: colorVars.surfaceSubtle,
  border: `1px solid ${colorVars.borderDefault}`,
  borderBottomLeftRadius: radiusVars.lg,
  borderBottomRightRadius: radiusVars.lg,
  boxSizing: 'border-box',
  fontFamily: fontFamilyVars.sans,
});

export const summary = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.xs,
  minWidth: 0,
  color: colorVars.textSecondary,
  fontSize: typographyVars.bodyBase.fontSize,
  lineHeight: typographyVars.bodyBase.lineHeight,
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.sm,
});

export const pages = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.xxs,
  selectors: { '&[hidden]': { display: 'none' } },
});

export const pageButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radiusVars.md,
});

export const pageButtonActive = style({
  outline: `1px solid ${colorVars.brandAccent}`,
  outlineOffset: '-1px',
  borderRadius: radiusVars.md,
});

export const ellipsis = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  color: colorVars.textSecondary,
});

export const sizeSelect = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacingVars.xs,
  selectors: { '&[hidden]': { display: 'none' } },
});

globalStyle(`${summary}::slotted(*)`, {
  margin: 0,
});
