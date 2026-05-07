import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const paletteVars = createThemeContract({
  // Cyan scale
  cyan100: null,
  cyan200: null,
  cyan300: null,
  cyan400: null,
  cyan500: null,
  cyan600: null,
  cyan700: null,
  cyan800: null,
  cyan900: null,

  // Red scale
  red100: null,
  red200: null,
  red300: null,
  red400: null,
  red500: null,
  red600: null,
  red700: null,
  red800: null,
  red900: null,

  // Neutral scale
  neutral100: null,
  neutral200: null,
  neutral300: null,
  neutral400: null,
  neutral500: null,
  neutral600: null,
  neutral700: null,
  neutral800: null,
  neutral900: null,

  // Green scale
  green100: null,
  green200: null,
  green300: null,
  green400: null,
  green500: null,
  green600: null,
  green700: null,
  green800: null,
  green900: null,

  // Amber scale
  amber100: null,
  amber200: null,
  amber300: null,
  amber400: null,
  amber500: null,
  amber600: null,
  amber700: null,
  amber800: null,
  amber900: null,
});

createGlobalTheme(':root', paletteVars, {
  // Cyan
  cyan100: '#E0F9FC',
  cyan200: '#B8EEF5',
  cyan300: '#80E2EE',
  cyan400: '#42D8EC',
  cyan500: '#20BDD6',
  cyan600: '#1897AD',
  cyan700: '#117287',
  cyan800: '#0A4E5E',
  cyan900: '#052A33',

  // Red
  red100: '#FFE9E5',
  red200: '#FFBFB3',
  red300: '#FF9280',
  red400: '#FF6650',
  red500: '#FF462D',
  red600: '#E83015',
  red700: '#C42208',
  red800: '#901905',
  red900: '#3D0A02',

  // Neutral
  neutral100: '#E8E8E8',
  neutral200: '#C8C8C8',
  neutral300: '#A8A8A8',
  neutral400: '#848484',
  neutral500: '#666666',
  neutral600: '#525252',
  neutral700: '#3A3A3A',
  neutral800: '#252525',
  neutral900: '#181818',

  // Green
  green100: '#E5F8E2',
  green200: '#BBE8B4',
  green300: '#7DD374',
  green400: '#4DC043',
  green500: '#2BB309',
  green600: '#1E8C06',
  green700: '#145F04',
  green800: '#0C3E02',
  green900: '#062001',

  // Amber
  amber100: '#FFF3E0',
  amber200: '#FFE0A0',
  amber300: '#FFCC6A',
  amber400: '#FFB237',
  amber500: '#FF9800',
  amber600: '#CC7A00',
  amber700: '#995B00',
  amber800: '#663D00',
  amber900: '#332000',
});
