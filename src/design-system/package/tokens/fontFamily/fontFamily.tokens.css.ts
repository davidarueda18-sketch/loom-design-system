import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const fontFamilyVars = createThemeContract({
  sans: null,
  mono: null,
});

createGlobalTheme(':root', fontFamilyVars, {
  sans: "'TWK Everett', system-ui, sans-serif",
  mono: 'ui-monospace, Consolas, monospace',
});
