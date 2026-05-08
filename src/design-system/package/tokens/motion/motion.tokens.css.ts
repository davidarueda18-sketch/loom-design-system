import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

export const motionVars = createThemeContract({
  durationInstant: null,
  durationFast:    null,
  durationBase:    null,
  durationSlow:    null,
  durationSlower:  null,
  easingLinear:    null,
  easingEaseIn:    null,
  easingEaseOut:   null,
  easingEaseInOut: null,
});

createGlobalTheme(':root', motionVars, {
  durationInstant: '0ms',
  durationFast:    '100ms',
  durationBase:    '200ms',
  durationSlow:    '300ms',
  durationSlower:  '500ms',
  easingLinear:    'linear',
  easingEaseIn:    'cubic-bezier(0.4, 0, 1, 1)',
  easingEaseOut:   'cubic-bezier(0, 0, 0.2, 1)',
  easingEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
});
