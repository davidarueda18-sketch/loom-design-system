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
  brandAccentHover: null,

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
  feedbackInfo: null,
  feedbackInfoSubtle: null,
});

createGlobalTheme('[data-theme="light"]', colorVars, {
  // Surface
  surfaceRaised:  '#FFFFFF',
  surfaceBase:    '#F6F6F6',
  surfaceSubtle:  '#EEEEEE',
  surfaceNeutral: paletteVars.neutral100,

  // Brand
  brandPrimary:       paletteVars.red600,
  brandPrimarySubtle: paletteVars.red100,
  brandAccent:        paletteVars.cyan700,
  brandAccentSubtle:  paletteVars.cyan100,
  brandAccentHover:   paletteVars.cyan800,

  // Border
  borderDefault: paletteVars.neutral200,
  borderStrong:  paletteVars.neutral400,
  borderSubtle:  paletteVars.neutral100,

  // Text
  textPrimary:   '#1A1A1A',
  textSecondary: paletteVars.neutral500,
  textDisabled:  paletteVars.neutral300,
  textInverse:   '#FFFFFF',
  textOnBrand:   '#FFFFFF',

  // Feedback
  feedbackSuccess:       paletteVars.green600,
  feedbackSuccessSubtle: paletteVars.green100,
  feedbackWarning:       paletteVars.amber600,
  feedbackWarningStrong: paletteVars.red600,
  feedbackWarningSubtle: paletteVars.amber100,
  feedbackDanger:        paletteVars.red600,
  feedbackDangerSubtle:  paletteVars.red100,
  feedbackInfo:          paletteVars.blue600,
  feedbackInfoSubtle:    paletteVars.blue100,
});

const darkTheme = {
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
  brandAccentHover: '#3A5053',

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
  feedbackInfo: paletteVars.blue500,
  feedbackInfoSubtle: paletteVars.blue900,
} satisfies Record<keyof typeof colorVars, string>;

createGlobalTheme(':root', colorVars, darkTheme);
createGlobalTheme('[data-theme="dark"]', colorVars, darkTheme);
