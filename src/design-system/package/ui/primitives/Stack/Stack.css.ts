import { style, styleVariants } from '@vanilla-extract/css';
import { spacingVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
});

export const gap = styleVariants(spacingVars, (val) => ({ gap: val }));

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
