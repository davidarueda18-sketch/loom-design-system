import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const letterSpacingVars = createThemeContract({
  none: null,
  wide: null,
  snug: null,
  tight: null,
  tighter: null,
  tightest: null,
});

createGlobalTheme(':root', letterSpacingVars, {
  none: '0em',
  wide: '0.05em',
  snug: '-0.005em',
  tight: '-0.01em',
  tighter: '-0.015em',
  tightest: '-0.02em',
});
