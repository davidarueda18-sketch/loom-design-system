import { style } from '@vanilla-extract/css';
import {
  colorVars,
  spacingVars,
  typographyVars,
  fontSizeVars,
  fontWeightVars,
  fontFamilyVars,
} from '../../../tokens/index.ts';

// Host — full-width block; the bar layout lives in the shadow `container`.
export const host = style({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: fontFamilyVars.sans,
});

// Container — the horizontal bar.
export const container = style({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minWidth: '320px',
  minHeight: '80px',
  paddingInline: spacingVars.lg,
  paddingBlock: '20px',
  backgroundColor: colorVars.surfaceSubtle,
  borderBottom: `2px solid ${colorVars.borderDefault}`,
});

// Hero — left region: application + divider + section.
export const hero = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  alignSelf: 'stretch',
  gap: '20px',
  overflow: 'clip',
  minWidth: 0,
});

// Application — bold title (Heading/H3).
export const application = style({
  margin: 0,
  whiteSpace: 'nowrap',
  color: colorVars.textPrimary,
  fontSize: fontSizeVars.lg,
  fontWeight: typographyVars.headingH3.fontWeight,
  lineHeight: typographyVars.headingH3.lineHeight,
  letterSpacing: typographyVars.headingH3.letterSpacing,
});

// Divider — decorative vertical rule between application and section.
export const divider = style({
  flex: 'none',
  alignSelf: 'stretch',
  width: '1px',
  marginBlock: spacingVars.xs,
  backgroundColor: colorVars.borderDefault,
});

// Section — light subtitle.
export const section = style({
  margin: 0,
  whiteSpace: 'nowrap',
  color: colorVars.textSecondary,
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.light,
});

// Options — right region: action slot.
export const options = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.sm,
  flex: 'none',
});
