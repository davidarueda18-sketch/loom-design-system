import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const iconSizeVars = createThemeContract({
  xxs: null,
  xs: null,
  sm: null,
  mini: null,
  md: null,
  lg: null,
});

createGlobalTheme(':root', iconSizeVars, {
  xxs: '12px',
  xs: '14px',
  sm: '16px',
  mini: '20px',
  md: '24px',
  lg: '32px',
});
