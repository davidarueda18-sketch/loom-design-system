import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const heightVars = createThemeContract({
  xxs: null,
  xs: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,
});

createGlobalTheme(':root', heightVars, {
  xxs: '20px',
  xs: '24px',
  sm: '32px',
  md: '48px',
  lg: '56px',
  xl: '72px',
});
