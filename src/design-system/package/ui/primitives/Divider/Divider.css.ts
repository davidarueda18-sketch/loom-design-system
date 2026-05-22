import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars, spacingVars, typographyVars } from '../../../tokens/index.ts';

// ─── Host / root ─────────────────────────────────────────────────────────────

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacingVars.sm,
  boxSizing: 'border-box',
});

export const orientations = styleVariants({
  horizontal: { flexDirection: 'row',    width:  '100%' },
  vertical:   { flexDirection: 'column', height: '100%' },
});

/** Sets `color` on the host so line segments inherit it via `currentColor`. */
export const colors = styleVariants({
  borderSubtle:  { color: colorVars.borderSubtle  },
  borderDefault: { color: colorVars.borderDefault },
  borderStrong:  { color: colorVars.borderStrong  },
});

// ─── Line segments ────────────────────────────────────────────────────────────

export const line = style({ display: 'block' });

export const lineSize = styleVariants({
  grow:  { flex: '1 0 0', minWidth: 0, minHeight: 0 },
  fixed: { flex: `0 0 ${spacingVars.lg}`, minWidth: 0, minHeight: 0 },
});

/** Cross-axis thickness for horizontal dividers (height). */
export const thicknessH = styleVariants({
  thin:   { height: '1px' },
  medium: { height: '2px' },
  thick:  { height: '4px' },
});

/** Cross-axis thickness for vertical dividers (width). */
export const thicknessV = styleVariants({
  thin:   { width: '1px' },
  medium: { width: '2px' },
  thick:  { width: '4px' },
});

/** Line draw style for horizontal dividers. */
export const lineStyleH = styleVariants({
  solid:  { background: 'currentColor' },
  dashed: {
    background: 'none',
    backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 4px, transparent 4px, transparent 8px)',
  },
});

/** Line draw style for vertical dividers. */
export const lineStyleV = styleVariants({
  solid:  { background: 'currentColor' },
  dashed: {
    background: 'none',
    backgroundImage: 'repeating-linear-gradient(to bottom, currentColor 0, currentColor 4px, transparent 4px, transparent 8px)',
  },
});

// ─── Label ────────────────────────────────────────────────────────────────────

export const label = style({
  color:         colorVars.textSecondary,
  fontSize:      typographyVars.caption.fontSize,
  fontWeight:    typographyVars.caption.fontWeight,
  lineHeight:    typographyVars.caption.lineHeight,
  letterSpacing: typographyVars.caption.letterSpacing,
  whiteSpace:    'nowrap',
  flexShrink:    0,
});

/** Rotates label text for vertical dividers (reads bottom → top). */
export const labelVertical = style({
  writingMode: 'vertical-rl',
  transform:   'rotate(180deg)',
});
