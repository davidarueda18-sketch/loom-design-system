import { style, styleVariants, globalStyle } from '@vanilla-extract/css';
import { iconSizeVars } from '../../../tokens/iconSize/iconSize.tokens.css.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  flexShrink: 0,
  lineHeight: 0,
  color: 'inherit',
});

globalStyle(`${root} > svg`, {
  width: '100%',
  height: '100%',
  display: 'block',
  fill: 'currentColor',
  stroke: 'currentColor',
});

globalStyle(`${root} > i`, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontSize: 'inherit',
  lineHeight: 1,
  color: 'currentColor',
});

export const size = styleVariants(iconSizeVars, (val) => ({
  width: val,
  height: val,
  fontSize: val,
}));
