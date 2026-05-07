import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const spacingVars = createThemeContract({
  none: null,
  px: null,
  xxs: null,
  xs: null,
  sm: null,
  md: null,
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

createGlobalTheme(':root', spacingVars, {
  none: '0px',
  px: '1px',
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xl2: '48px',
  xl3: '64px',
  xl4: '96px',
  xl5: '128px',
  xl6: '192px',
  xl7: '256px',
  xl8: '384px',
});
