import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';
import { colorVars } from '../color/color.tokens.css.ts';

export const progressVars = createThemeContract({
  trackColor:                    null,
  thicknessSm:                   null,
  thicknessMd:                   null,
  radius:                        null,
  linearHeight:                  null,
  circularSizeSm:                null,
  circularSizeMd:                null,
  circularSizeLg:                null,
  indeterminateDurationLinear:   null,
  indeterminateDurationCircular: null,
  determinateTransition:         null,
  waveAmplitude:                 null,
  waveLength:                    null,
  waveDuration:                  null,
});

createGlobalTheme(':root', progressVars, {
  trackColor:                    colorVars.surfaceSubtle,
  thicknessSm:                   '4px',
  thicknessMd:                   '8px',
  radius:                        '999px',
  linearHeight:                  '12px',
  circularSizeSm:                '24px',
  circularSizeMd:                '40px',
  circularSizeLg:                '56px',
  indeterminateDurationLinear:   '2000ms',
  indeterminateDurationCircular: '1400ms',
  determinateTransition:         '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  waveAmplitude:                 '3px',
  waveLength:                    '16px',
  waveDuration:                  '1200ms',
});
