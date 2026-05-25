import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const radiusVars = createThemeContract({
  xxs: null,
  xs: null,
  sm: null,
  md: null,
  lg: null,
  full: null,
});

createGlobalTheme(':root', radiusVars, {
  xxs: '2px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '16px',
  full: '9999px',
});
