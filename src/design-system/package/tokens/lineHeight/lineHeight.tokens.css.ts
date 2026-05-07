import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const lineHeightVars = createThemeContract({
  none: null,
  tight: null,
  snug: null,
  normal: null,
  relaxed: null,
  loose: null,
});

createGlobalTheme(':root', lineHeightVars, {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
});
