import { style, styleVariants } from '@vanilla-extract/css';
import { tagVars } from '../../../tokens/tag/tag.tokens.css.ts';
import { spacingVars, radiusVars, fontSizeVars, fontWeightVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacingVars.xs,
  paddingBlock: spacingVars.xs,
  paddingInline: spacingVars.sm,
  borderRadius: radiusVars.full,
  border: '1px solid',
  boxSizing: 'border-box',
  flexShrink: 0,
  userSelect: 'none',
  fontSize: fontSizeVars.xxs,
  fontWeight: fontWeightVars.normal,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const value = styleVariants({
  positive: {
    background: tagVars.positive.background,
    borderColor: tagVars.positive.border,
    color: tagVars.positive.foreground,
  },
  negative: {
    background: tagVars.negative.background,
    borderColor: tagVars.negative.border,
    color: tagVars.negative.foreground,
  },
  neutral: {
    background: tagVars.neutral.background,
    borderColor: tagVars.neutral.border,
    color: tagVars.neutral.foreground,
  },
});

export const iconWrapper = style({
  display: 'inline-flex',
  flexShrink: 0,
  width: '16px',
  height: '16px',
});
