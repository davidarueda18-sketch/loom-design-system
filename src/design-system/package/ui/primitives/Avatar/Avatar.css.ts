import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars, radiusVars, fontSizeVars, fontWeightVars } from '../../../tokens/index.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radiusVars.full,
  overflow: 'hidden',
  flexShrink: 0,
  userSelect: 'none',
  fontWeight: fontWeightVars.medium,
  color: '#ffffff',
  position: 'relative',
  // Ring separates overlapping avatars in AvatarGroup clusters
  boxShadow: `0 0 0 2px ${colorVars.surfaceRaised}`,
});

export const size = styleVariants({
  sm: { width: '24px', height: '24px', fontSize: fontSizeVars.xs },
  md: { width: '32px', height: '32px', fontSize: fontSizeVars.sm },
  lg: { width: '40px', height: '40px', fontSize: fontSizeVars.base },
});

export const img = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});
