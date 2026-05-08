import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const lineHeightVars = createThemeContract({
  none: null,
  tight: null,
  snug: null,
  normal: null,
  relaxed: null,
  condensed: null,
  compact: null,
  loose: null,
});

createGlobalTheme(':root', lineHeightVars, {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.6',
  condensed: '1.2',
  compact: '1.1',
  loose: '2',
});
