import { globalStyle } from '@vanilla-extract/css';
import { typographyVars } from './typography.tokens.css.ts';
import { variantTokenMap } from './typography.types.ts';
import type { TypographyTokenKey } from './typography.types.ts';

for (const [variant, tokenKey] of Object.entries(variantTokenMap) as [string, TypographyTokenKey][]) {
  globalStyle(`.loom-${variant}`, {
    fontSize:      typographyVars[tokenKey].fontSize,
    fontWeight:    typographyVars[tokenKey].fontWeight,
    lineHeight:    typographyVars[tokenKey].lineHeight,
    letterSpacing: typographyVars[tokenKey].letterSpacing,
    margin:        0,
  });
}

globalStyle('.loom-text-start',   { textAlign: 'start' });
globalStyle('.loom-text-center',  { textAlign: 'center' });
globalStyle('.loom-text-end',     { textAlign: 'end' });
globalStyle('.loom-text-justify', { textAlign: 'justify' });

export const TypographyText = 'loom-typography' as const;
