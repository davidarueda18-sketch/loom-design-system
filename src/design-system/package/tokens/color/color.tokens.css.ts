import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';
import { paletteVars } from '../palette/palette.tokens.css.ts';

export const colorVars = createThemeContract({
  // Surface
  surfaceRaised: null,
  surfaceBase: null,
  surfaceSubtle: null,
  surfaceNeutral: null,

  // Brand — describes intent, not color name
  brandPrimary: null,
  brandPrimarySubtle: null,
  brandAccent: null,
  brandAccentSubtle: null,

  // Border
  borderDefault: null,
  borderStrong: null,
  borderSubtle: null,

  // Text
  textPrimary: null,
  textSecondary: null,
  textDisabled: null,
  textInverse: null,
  textOnBrand: null,

  // Feedback — reference palette tokens to avoid value duplication
  feedbackSuccess: null,
  feedbackSuccessSubtle: null,
  feedbackWarning: null,
  feedbackWarningStrong: null,
  feedbackWarningSubtle: null,
  feedbackDanger: null,
  feedbackDangerSubtle: null,
});

createGlobalTheme(':root', colorVars, {
  // Surface
  surfaceRaised: '#2B2D2E',
  surfaceBase: '#181818',
  surfaceSubtle: '#252525',
  surfaceNeutral: '#2F3031',

  // Brand
  brandPrimary: paletteVars.red500,
  brandPrimarySubtle: paletteVars.red900,
  brandAccent: paletteVars.cyan400,
  brandAccentSubtle: paletteVars.cyan900,

  // Border
  borderDefault: '#343434',
  borderStrong: paletteVars.neutral600,
  borderSubtle: '#2A2A2A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: paletteVars.neutral400,
  textDisabled: paletteVars.neutral200,
  textInverse: '#181818',
  textOnBrand: '#0A1F22',

  // Feedback — all reference palette, single source of truth
  feedbackSuccess: paletteVars.green500,
  feedbackSuccessSubtle: paletteVars.green900,
  feedbackWarning: paletteVars.amber400,
  feedbackWarningStrong: paletteVars.red400,
  feedbackWarningSubtle: paletteVars.amber900,
  feedbackDanger: paletteVars.red500,
  feedbackDangerSubtle: paletteVars.red900,
});
