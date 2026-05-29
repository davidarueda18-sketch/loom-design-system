import { style, styleVariants } from '@vanilla-extract/css';
import { spacingVars } from '../../../tokens/spacing/spacing.tokens.css.ts';

export const root = style({
  display: 'block',
  boxSizing: 'border-box',
});

export const display = styleVariants({
  block:       { display: 'block' },
  inline:      { display: 'inline' },
  inlineBlock: { display: 'inline-block' },
  flex:        { display: 'flex' },
  inlineFlex:  { display: 'inline-flex' },
  grid:        { display: 'grid' },
  inlineGrid:  { display: 'inline-grid' },
  contents:    { display: 'contents' },
  none:        { display: 'none' },
});

export const padding  = styleVariants(spacingVars, (val) => ({ padding:       val }));
export const paddingX = styleVariants(spacingVars, (val) => ({ paddingInline: val }));
export const paddingY = styleVariants(spacingVars, (val) => ({ paddingBlock:  val }));
