import { style, styleVariants } from '@vanilla-extract/css';
import { typographyVars } from '../../../tokens/index.ts';

export const root = style({});

export const variants = styleVariants(typographyVars, (variant) => ({
  fontSize: variant.fontSize,
  fontWeight: variant.fontWeight,
  lineHeight: variant.lineHeight,
  letterSpacing: variant.letterSpacing,
  margin: 0,
}));

export const aligns = styleVariants({
  start:   { textAlign: 'start' },
  center:  { textAlign: 'center' },
  end:     { textAlign: 'end' },
  justify: { textAlign: 'justify' },
});
