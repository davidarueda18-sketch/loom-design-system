import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const fontWeightVars = createThemeContract({
  thin: null,
  extralight: null,
  light: null,
  normal: null,
  medium: null,
  semibold: null,
  bold: null,
  extrabold: null,
  black: null,
});

createGlobalTheme(':root', fontWeightVars, {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
});
