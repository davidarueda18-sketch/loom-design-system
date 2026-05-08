import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';
import { fontSizeVars } from '../fontSize/fontSize.tokens.css.ts';
import { fontWeightVars } from '../fontWeight/fontWeight.tokens.css.ts';
import { lineHeightVars } from '../lineHeight/lineHeight.tokens.css.ts';
import { letterSpacingVars } from '../letterSpacing/letterSpacing.tokens.css.ts';

export const typographyVars = createThemeContract({
  bodyBase:   { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  bodySm:     { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  bodyLg:     { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  labelBase:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  labelSm:    { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  labelLg:    { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  headingH1:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  headingH2:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  headingH3:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  headingH4:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  headingH5:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  headingH6:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  displayLg:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  displayXl:  { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  display2xl: { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  overline:   { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
  caption:    { fontSize: null, fontWeight: null, lineHeight: null, letterSpacing: null },
});

createGlobalTheme(':root', typographyVars, {
  bodyBase:   { fontSize: fontSizeVars.base,  fontWeight: fontWeightVars.normal,  lineHeight: lineHeightVars.relaxed,   letterSpacing: letterSpacingVars.none     },
  bodySm:     { fontSize: fontSizeVars.sm,    fontWeight: fontWeightVars.normal,  lineHeight: lineHeightVars.relaxed,   letterSpacing: letterSpacingVars.none     },
  bodyLg:     { fontSize: fontSizeVars.lg,    fontWeight: fontWeightVars.normal,  lineHeight: lineHeightVars.relaxed,   letterSpacing: letterSpacingVars.none     },
  labelBase:  { fontSize: fontSizeVars.sm,    fontWeight: fontWeightVars.medium,  lineHeight: lineHeightVars.normal,    letterSpacing: letterSpacingVars.none     },
  labelSm:    { fontSize: fontSizeVars.xs,    fontWeight: fontWeightVars.medium,  lineHeight: lineHeightVars.normal,    letterSpacing: letterSpacingVars.none     },
  labelLg:    { fontSize: fontSizeVars.base,  fontWeight: fontWeightVars.medium,  lineHeight: lineHeightVars.normal,    letterSpacing: letterSpacingVars.none     },
  headingH1:  { fontSize: fontSizeVars.xl4,   fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.condensed, letterSpacing: letterSpacingVars.tight    },
  headingH2:  { fontSize: fontSizeVars.xl3,   fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.condensed, letterSpacing: letterSpacingVars.snug     },
  headingH3:  { fontSize: fontSizeVars.xl2,   fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.condensed, letterSpacing: letterSpacingVars.none     },
  headingH4:  { fontSize: fontSizeVars.xl,    fontWeight: fontWeightVars.medium,  lineHeight: lineHeightVars.condensed, letterSpacing: letterSpacingVars.none     },
  headingH5:  { fontSize: fontSizeVars.lg,    fontWeight: fontWeightVars.medium,  lineHeight: lineHeightVars.condensed, letterSpacing: letterSpacingVars.none     },
  headingH6:  { fontSize: fontSizeVars.base,  fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.condensed, letterSpacing: letterSpacingVars.none     },
  displayLg:  { fontSize: fontSizeVars.xl5,   fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.compact,   letterSpacing: letterSpacingVars.tighter  },
  displayXl:  { fontSize: fontSizeVars.xl6,   fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.compact,   letterSpacing: letterSpacingVars.tightest },
  display2xl: { fontSize: fontSizeVars.xl7,   fontWeight: fontWeightVars.bold,    lineHeight: lineHeightVars.compact,   letterSpacing: letterSpacingVars.tightest },
  overline:   { fontSize: fontSizeVars.xxs,   fontWeight: fontWeightVars.medium,  lineHeight: lineHeightVars.normal,    letterSpacing: letterSpacingVars.wide     },
  caption:    { fontSize: fontSizeVars.xs,    fontWeight: fontWeightVars.normal,  lineHeight: lineHeightVars.normal,    letterSpacing: letterSpacingVars.none     },
});
