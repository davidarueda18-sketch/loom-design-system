import { style, styleVariants, keyframes } from '@vanilla-extract/css';
import {
  colorVars,
  spacingVars,
  typographyVars,
  progressVars,
} from '../../../tokens/index.ts';

// ─── Root ─────────────────────────────────────────────────────────────────────

export const root = style({
  display:    'flex',
  flexDirection: 'column',
  gap:        spacingVars.xs,
  width:      '100%',
  boxSizing:  'border-box',
});

/** Sets `color` on the host so children pick it up via `currentColor`. */
export const colors = styleVariants({
  brandAccent:     { color: colorVars.brandAccent     },
  brandPrimary:    { color: colorVars.brandPrimary    },
  feedbackSuccess: { color: colorVars.feedbackSuccess },
  feedbackWarning: { color: colorVars.feedbackWarning },
  feedbackDanger:  { color: colorVars.feedbackDanger  },
  feedbackInfo:    { color: colorVars.feedbackInfo    },
});

// ─── Track host (12 dp tall band that hosts bg + active + stop) ──────────────

export const trackHost = style({
  position:  'relative',
  width:     '100%',
  height:    progressVars.linearHeight,
});

// ─── Track background (centered vertically, height = thickness) ──────────────

const trackBgBase = style({
  position:  'absolute',
  left:      0,
  right:     0,
  top:       '50%',
  transform: 'translateY(-50%)',
  background: progressVars.trackColor,
  borderRadius: progressVars.radius,
});

export const trackBg = styleVariants({
  sm: [trackBgBase, { height: progressVars.thicknessSm }],
  md: [trackBgBase, { height: progressVars.thicknessMd }],
});

// ─── Active indicator (determinate: width follows progressVar) ───────────────

const activeBase = style({
  position:  'absolute',
  left:      0,
  top:       '50%',
  transform: 'translateY(-50%)',
  background: 'currentColor',
  borderRadius: progressVars.radius,
  transition: `width ${progressVars.determinateTransition}`,
  width:     0,
  overflow:  'hidden',
});

export const active = styleVariants({
  sm: [activeBase, { height: progressVars.thicknessSm }],
  md: [activeBase, { height: progressVars.thicknessMd }],
});

// ─── Wave shape (CSS mask: SVG sinusoid, scrolls left infinitely) ────────────
// One period matches `progressVars.waveLength`; track and active share the same mask.

const WAVE_MASK_SM =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 4' preserveAspectRatio='none'><path d='M0,2 Q4,0.75 8,2 T16,2' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

const WAVE_MASK_MD =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' preserveAspectRatio='none'><path d='M0,4 Q4,1 8,4 T16,4' fill='none' stroke='black' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

const waveScroll = keyframes({
  from: { maskPosition: '0 0', WebkitMaskPosition: '0 0' },
  to:   {
    maskPosition:       `calc(${progressVars.waveLength} * -1) 0`,
    WebkitMaskPosition: `calc(${progressVars.waveLength} * -1) 0`,
  },
});

const waveBase = style({
  maskRepeat:          'repeat-x',
  WebkitMaskRepeat:    'repeat-x',
  maskSize:            `${progressVars.waveLength} 100%`,
  WebkitMaskSize:      `${progressVars.waveLength} 100%`,
  animation:           `${waveScroll} ${progressVars.waveDuration} linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const wave = styleVariants({
  sm: [waveBase, {
    maskImage:       WAVE_MASK_SM,
    WebkitMaskImage: WAVE_MASK_SM,
  }],
  md: [waveBase, {
    maskImage:       WAVE_MASK_MD,
    WebkitMaskImage: WAVE_MASK_MD,
  }],
});

// ─── Stop indicator (small dot anchored to the right edge) ───────────────────

const stopBase = style({
  position:  'absolute',
  right:     0,
  top:       '50%',
  transform: 'translateY(-50%)',
  background: 'currentColor',
  borderRadius: progressVars.radius,
});

export const stop = styleVariants({
  sm: [stopBase, { width: progressVars.thicknessSm, height: progressVars.thicknessSm }],
  md: [stopBase, { width: progressVars.thicknessSm, height: progressVars.thicknessSm }],
});

// ─── Indeterminate animation (one moving + scaling segment) ──────────────────

const slide = keyframes({
  '0%':   { transform: 'translate(-100%, -50%) scaleX(0.3)' },
  '50%':  { transform: 'translate( 30%,  -50%) scaleX(0.5)' },
  '100%': { transform: 'translate(200%, -50%) scaleX(0.3)' },
});

const indeterminateBase = style({
  width: '100%',
  transformOrigin: 'left center',
  animation: `${slide} ${progressVars.indeterminateDurationLinear} cubic-bezier(0.4, 0, 0.2, 1) infinite`,
  transition: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', width: '40%' },
  },
});

export const indeterminate = styleVariants({
  sm: [indeterminateBase],
  md: [indeterminateBase],
});

// ─── Label / value row ───────────────────────────────────────────────────────

export const labelRow = style({
  display:        'flex',
  justifyContent: 'space-between',
  gap:            spacingVars.sm,
  color:          colorVars.textSecondary,
  fontSize:       typographyVars.caption.fontSize,
  fontWeight:     typographyVars.caption.fontWeight,
  lineHeight:     typographyVars.caption.lineHeight,
  letterSpacing:  typographyVars.caption.letterSpacing,
});

export const labelText = style({});

export const labelValue = style({
  fontVariantNumeric: 'tabular-nums',
});
