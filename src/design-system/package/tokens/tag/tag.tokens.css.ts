import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';
import { paletteVars } from '../palette/palette.tokens.css.ts';

export const tagVars = createThemeContract({
  positive: { background: null, border: null, foreground: null },
  negative: { background: null, border: null, foreground: null },
  neutral:  { background: null, border: null, foreground: null },
});

const darkValues = {
  positive: {
    background: '#283739',
    border:     paletteVars.cyan400,
    foreground: paletteVars.cyan400,
  },
  negative: {
    background: '#402929',
    border:     paletteVars.red500,
    foreground: paletteVars.red500,
  },
  neutral: {
    background: '#343434',
    border:     paletteVars.neutral200,
    foreground: paletteVars.neutral200,
  },
};

createGlobalTheme(':root', tagVars, darkValues);
createGlobalTheme('[data-theme="dark"]', tagVars, darkValues);

createGlobalTheme('[data-theme="light"]', tagVars, {
  positive: {
    background: paletteVars.cyan100,
    border:     paletteVars.cyan700,
    foreground: paletteVars.cyan700,
  },
  negative: {
    background: paletteVars.red100,
    border:     paletteVars.red600,
    foreground: paletteVars.red600,
  },
  neutral: {
    background: paletteVars.neutral100,
    border:     paletteVars.neutral500,
    foreground: paletteVars.neutral500,
  },
});
