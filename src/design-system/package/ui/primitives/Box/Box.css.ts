import { style, styleVariants } from '@vanilla-extract/css';
import { spacingVars } from '../../../tokens/spacing/spacing.tokens.css.ts';

export const root = style({
  display: 'block',
  boxSizing: 'border-box',
});

export const padding  = styleVariants(spacingVars, (val) => ({ padding:       val }));
export const paddingX = styleVariants(spacingVars, (val) => ({ paddingInline: val }));
export const paddingY = styleVariants(spacingVars, (val) => ({ paddingBlock:  val }));
