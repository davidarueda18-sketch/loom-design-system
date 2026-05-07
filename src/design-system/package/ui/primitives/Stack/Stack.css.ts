import { style, styleVariants } from '@vanilla-extract/css';
import { spacingVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
});

export const gap = styleVariants({
  none: { gap: spacingVars.none },
  px:   { gap: spacingVars.px },
  xxs:  { gap: spacingVars.xxs },
  xs:   { gap: spacingVars.xs },
  sm:   { gap: spacingVars.sm },
  md:   { gap: spacingVars.md },
  lg:   { gap: spacingVars.lg },
  xl:   { gap: spacingVars.xl },
  xl2:  { gap: spacingVars.xl2 },
  xl3:  { gap: spacingVars.xl3 },
  xl4:  { gap: spacingVars.xl4 },
  xl5:  { gap: spacingVars.xl5 },
  xl6:  { gap: spacingVars.xl6 },
  xl7:  { gap: spacingVars.xl7 },
  xl8:  { gap: spacingVars.xl8 },
});

export const align = styleVariants({
  start:    { alignItems: 'flex-start' },
  center:   { alignItems: 'center' },
  end:      { alignItems: 'flex-end' },
  stretch:  { alignItems: 'stretch' },
  baseline: { alignItems: 'baseline' },
});

export const justify = styleVariants({
  start:   { justifyContent: 'flex-start' },
  center:  { justifyContent: 'center' },
  end:     { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
  around:  { justifyContent: 'space-around' },
  evenly:  { justifyContent: 'space-evenly' },
});
