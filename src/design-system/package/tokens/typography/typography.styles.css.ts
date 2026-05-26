import { styleVariants } from '@vanilla-extract/css';
import { typographyVars } from './typography.tokens.css.ts';

export const variants = styleVariants(typographyVars, (variant) => ({
  fontSize:      variant.fontSize,
  fontWeight:    variant.fontWeight,
  lineHeight:    variant.lineHeight,
  letterSpacing: variant.letterSpacing,
  margin:        0,
}));

export const aligns = styleVariants({
  start:   { textAlign: 'start'   as const },
  center:  { textAlign: 'center'  as const },
  end:     { textAlign: 'end'     as const },
  justify: { textAlign: 'justify' as const },
});
