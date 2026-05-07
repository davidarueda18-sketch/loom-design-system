import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const fontSizeVars = createThemeContract({
  xxs: null,
  xs: null,
  sm: null,
  base: null,
  lg: null,
  xl: null,
  xl2: null,
  xl3: null,
  xl4: null,
  xl5: null,
  xl6: null,
  xl7: null,
  xl8: null,
});

createGlobalTheme(':root', fontSizeVars, {
  xxs: '10px',
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  xl2: '24px',
  xl3: '30px',
  xl4: '36px',
  xl5: '48px',
  xl6: '60px',
  xl7: '72px',
  xl8: '96px',
});
