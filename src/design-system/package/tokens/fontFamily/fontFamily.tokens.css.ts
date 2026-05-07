import { createThemeContract, createGlobalTheme, globalFontFace } from '@vanilla-extract/css';

import hairlineWoff2 from '../../../../assets/fonts/TWKEverett-Hairline-web.woff2';
import hairlineItalicWoff2 from '../../../../assets/fonts/TWKEverett-HairlineItalic-web.woff2';
import thinWoff2 from '../../../../assets/fonts/TWKEverett-Thin-web.woff2';
import thinItalicWoff2 from '../../../../assets/fonts/TWKEverett-ThinItalic-web.woff2';
import ultralightWoff2 from '../../../../assets/fonts/TWKEverett-Ultralight-web.woff2';
import lightWoff2 from '../../../../assets/fonts/TWKEverett-Light-web.woff2';
import lightItalicWoff2 from '../../../../assets/fonts/TWKEverett-LightItalic-web.woff2';
import regularWoff2 from '../../../../assets/fonts/TWKEverett-Regular-web.woff2';
import regularItalicWoff2 from '../../../../assets/fonts/TWKEverett-RegularItalic-web.woff2';
import mediumWoff2 from '../../../../assets/fonts/TWKEverett-Medium-web.woff2';
import mediumItalicWoff2 from '../../../../assets/fonts/TWKEverett-MediumItalic-web.woff2';
import boldWoff2 from '../../../../assets/fonts/TWKEverett-Bold-web.woff2';
import boldItalicWoff2 from '../../../../assets/fonts/TWKEverett-BoldItalic-web.woff2';
import extraboldWoff2 from '../../../../assets/fonts/TWKEverett-Extrabold-web.woff2';
import blackWoff2 from '../../../../assets/fonts/TWKEverett-Black-web.woff2';
import superWoff2 from '../../../../assets/fonts/TWKEverett-Super-web.woff2';
import superItalicWoff2 from '../../../../assets/fonts/TWKEverett-SuperItalic-web.woff2';

// Hairline → 100 | Thin → 200 | Ultralight → 300 | Light → 350
// Regular → 400  | Medium → 500 | Bold → 700 | Extrabold → 800
// Black → 900    | Super → 950
// CSS Font Level 4 allows any integer 1–1000, so 350 and 950 are valid.

globalFontFace('TWK Everett', {
  src: `url(${hairlineWoff2}) format('woff2')`,
  fontWeight: '100',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${hairlineItalicWoff2}) format('woff2')`,
  fontWeight: '100',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${thinWoff2}) format('woff2')`,
  fontWeight: '200',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${thinItalicWoff2}) format('woff2')`,
  fontWeight: '200',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${ultralightWoff2}) format('woff2')`,
  fontWeight: '300',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

// Light sits between Ultralight (300) and Regular (400); 350 is valid per CSS Fonts Level 4.
globalFontFace('TWK Everett', {
  src: `url(${lightWoff2}) format('woff2')`,
  fontWeight: '350',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${lightItalicWoff2}) format('woff2')`,
  fontWeight: '350',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${regularWoff2}) format('woff2')`,
  fontWeight: '400',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${regularItalicWoff2}) format('woff2')`,
  fontWeight: '400',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${mediumWoff2}) format('woff2')`,
  fontWeight: '500',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${mediumItalicWoff2}) format('woff2')`,
  fontWeight: '500',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${boldWoff2}) format('woff2')`,
  fontWeight: '700',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${boldItalicWoff2}) format('woff2')`,
  fontWeight: '700',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${extraboldWoff2}) format('woff2')`,
  fontWeight: '800',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${blackWoff2}) format('woff2')`,
  fontWeight: '900',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

// Super sits above Black (900); 950 is valid per CSS Fonts Level 4.
globalFontFace('TWK Everett', {
  src: `url(${superWoff2}) format('woff2')`,
  fontWeight: '950',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('TWK Everett', {
  src: `url(${superItalicWoff2}) format('woff2')`,
  fontWeight: '950',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

export const fontFamilyVars = createThemeContract({
  sans: null,
  mono: null,
});

createGlobalTheme(':root', fontFamilyVars, {
  sans: "'TWK Everett', system-ui, sans-serif",
  mono: 'ui-monospace, Consolas, monospace',
});
