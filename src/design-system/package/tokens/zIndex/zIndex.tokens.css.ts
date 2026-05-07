import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const zIndexVars = createThemeContract({
  hide: null,
  base: null,
  raised: null,
  dropdown: null,
  sticky: null,
  overlay: null,
  modal: null,
});

createGlobalTheme(':root', zIndexVars, {
  hide: '-1',
  base: '0',
  raised: '10',
  dropdown: '20',
  sticky: '30',
  overlay: '40',
  modal: '50',
});
