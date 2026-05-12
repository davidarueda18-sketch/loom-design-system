import { create } from 'storybook/theming';

export const darkDocsTheme = create({
  base: 'dark',

  brandTitle: 'Loom Design System',

  appBg:         '#181818',
  appContentBg:  '#181818',
  appPreviewBg:  '#181818',
  appBorderColor: '#343434',
  appBorderRadius: 4,

  textColor:        '#FFFFFF',
  textInverseColor: '#181818',
  textMutedColor:   '#848484',

  barTextColor:     '#848484',
  barSelectedColor: '#42D8EC',
  barHoverColor:    '#20BDD6',
  barBg:            '#252525',

  inputBg:           '#252525',
  inputBorder:       '#343434',
  inputTextColor:    '#FFFFFF',
  inputBorderRadius: 4,

  colorPrimary:   '#FF462D',
  colorSecondary: '#42D8EC',
});

export const lightDocsTheme = create({
  base: 'light',

  brandTitle: 'Loom Design System',

  appBg:          '#F6F6F6',
  appContentBg:   '#F6F6F6',
  appPreviewBg:   '#F6F6F6',
  appBorderColor: '#C8C8C8',
  appBorderRadius: 4,

  textColor:        '#1A1A1A',
  textInverseColor: '#FFFFFF',
  textMutedColor:   '#666666',

  barTextColor:     '#666666',
  barSelectedColor: '#117287',
  barHoverColor:    '#1897AD',
  barBg:            '#EEEEEE',

  inputBg:           '#FFFFFF',
  inputBorder:       '#C8C8C8',
  inputTextColor:    '#1A1A1A',
  inputBorderRadius: 4,

  colorPrimary:   '#E83015',
  colorSecondary: '#117287',
});
