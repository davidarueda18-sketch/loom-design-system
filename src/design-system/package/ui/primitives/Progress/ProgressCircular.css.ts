import { style, styleVariants, keyframes } from '@vanilla-extract/css';
import {
  colorVars,
  typographyVars,
  progressVars,
} from '../../../tokens/index.ts';

// ─── Root ─────────────────────────────────────────────────────────────────────

export const root = style({
  position:        'relative',
  display:         'inline-flex',
  alignItems:      'center',
  justifyContent:  'center',
  flexShrink:      0,
});

/** Sets `color` on the host so the active arc inherits via `currentColor`. */
export const colors = styleVariants({
  brandAccent:     { color: colorVars.brandAccent     },
  brandPrimary:    { color: colorVars.brandPrimary    },
  feedbackSuccess: { color: colorVars.feedbackSuccess },
  feedbackWarning: { color: colorVars.feedbackWarning },
  feedbackDanger:  { color: colorVars.feedbackDanger  },
  feedbackInfo:    { color: colorVars.feedbackInfo    },
});

export const sizes = styleVariants({
  sm: { width: progressVars.circularSizeSm, height: progressVars.circularSizeSm },
  md: { width: progressVars.circularSizeMd, height: progressVars.circularSizeMd },
  lg: { width: progressVars.circularSizeLg, height: progressVars.circularSizeLg },
});

// ─── SVG ──────────────────────────────────────────────────────────────────────

export const svg = style({
  display:   'block',
  width:     '100%',
  height:    '100%',
  overflow:  'visible',
});

// ─── Track circle (full ring, behind active) ─────────────────────────────────

export const track = style({
  stroke:    progressVars.trackColor,
  fill:      'none',
});

// ─── Active arc (determinate: dash-controlled; rotated -90° at SVG level) ────

export const active = style({
  stroke:        'currentColor',
  fill:          'none',
  strokeLinecap: 'round',
  transition:    `stroke-dashoffset ${progressVars.determinateTransition}`,
});

// ─── Thickness (4 dp / 8 dp) — applied to both track and active strokes ──────

export const thickness = styleVariants({
  sm: { strokeWidth: progressVars.thicknessSm },
  md: { strokeWidth: progressVars.thicknessMd },
});

// ─── Indeterminate animation ─────────────────────────────────────────────────
// Two layered keyframes: continuous SVG rotation + dasharray oscillation.

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

const dash = keyframes({
  '0%':   { strokeDasharray: '1px, 200px',   strokeDashoffset: '0' },
  '50%':  { strokeDasharray: '100px, 200px', strokeDashoffset: '-15px' },
  '100%': { strokeDasharray: '100px, 200px', strokeDashoffset: '-125px' },
});

export const svgIndeterminate = style({
  animation: `${spin} ${progressVars.indeterminateDurationCircular} linear infinite`,
  transformOrigin: 'center',
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const activeIndeterminate = style({
  strokeDasharray:  '1px, 200px',
  strokeDashoffset: '0',
  animation:        `${dash} ${progressVars.indeterminateDurationCircular} ease-in-out infinite`,
  transition:       'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      strokeDasharray: '60px, 200px',
    },
  },
});

// ─── Label (centered absolutely) ─────────────────────────────────────────────

export const label = style({
  position:    'absolute',
  inset:       0,
  display:     'flex',
  alignItems:  'center',
  justifyContent: 'center',
  color:       colorVars.textSecondary,
  fontSize:    typographyVars.caption.fontSize,
  fontWeight:  typographyVars.caption.fontWeight,
  lineHeight:  typographyVars.caption.lineHeight,
  letterSpacing: typographyVars.caption.letterSpacing,
  fontVariantNumeric: 'tabular-nums',
  pointerEvents: 'none',
});
