import { style, styleVariants, keyframes } from '@vanilla-extract/css';
import { colorVars, spacingVars, radiusVars, fontSizeVars, fontWeightVars, progressVars } from '../../../tokens/index.ts';
import { badgeVars } from '../../../tokens/badge/badge.tokens.css.ts';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacingVars.xs,
  paddingBlock: spacingVars.sm,
  paddingInline: spacingVars.md,
  borderRadius: radiusVars.full,
  border: '1px solid',
  boxSizing: 'border-box',
  flexShrink: 0,
  userSelect: 'none',
  fontSize: fontSizeVars.sm,
  fontWeight: fontWeightVars.normal,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

// ─── Variant = default (outlined) ─────────────────────────────────────────────

export const state = styleVariants({
  default: {
    borderColor: colorVars.textDisabled,
    color: colorVars.textDisabled,
  },
  progress: {
    borderColor: colorVars.brandAccent,
    color: colorVars.brandAccent,
  },
  success: {
    borderColor: colorVars.feedbackSuccess,
    color: colorVars.feedbackSuccess,
  },
  warning: {
    borderColor: colorVars.feedbackWarning,
    color: colorVars.feedbackWarning,
  },
  danger: {
    borderColor: colorVars.feedbackDanger,
    color: colorVars.feedbackDanger,
  },
  info: {
    borderColor: colorVars.feedbackInfo,
    color: colorVars.feedbackInfo,
  },
});

// Inherits color from parent via currentColor — no per-state overrides needed.
export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: radiusVars.full,
  flexShrink: 0,
  backgroundColor: 'currentColor',
});

// ─── Variant = filled (background + border + icon) ───────────────────────────

export const filled = styleVariants({
  default:  { background: badgeVars.default.background,  borderColor: badgeVars.default.border,  color: badgeVars.default.foreground },
  progress: { background: badgeVars.progress.background, borderColor: badgeVars.progress.border, color: badgeVars.progress.foreground },
  success:  { background: badgeVars.success.background,  borderColor: badgeVars.success.border,  color: badgeVars.success.foreground },
  warning:  { background: badgeVars.warning.background,  borderColor: badgeVars.warning.border,  color: badgeVars.warning.foreground },
  danger:   { background: badgeVars.danger.background,   borderColor: badgeVars.danger.border,   color: badgeVars.danger.foreground },
  info:     { background: badgeVars.info.background,     borderColor: badgeVars.info.border,     color: badgeVars.info.foreground },
});

export const iconWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '16px',
  height: '16px',
});

// Visually hidden but still announced by assistive tech — used when showLabel=false
// so icon-only badges keep an accessible name without duplicating it via aria-label.
export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

// ─── Progress spinner (filled + state=progress) ──────────────────────────────
// Mirrors ProgressCircular's indeterminate animation, scaled down to icon size.

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

const dash = keyframes({
  '0%':   { strokeDasharray: '1px, 100px',  strokeDashoffset: '0' },
  '50%':  { strokeDasharray: '44px, 100px', strokeDashoffset: '-8px' },
  '100%': { strokeDasharray: '44px, 100px', strokeDashoffset: '-55px' },
});

export const spinnerSvg = style({
  display: 'block',
  animation: `${spin} ${progressVars.indeterminateDurationCircular} linear infinite`,
  transformOrigin: 'center',
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const spinnerTrack = style({
  stroke: 'currentColor',
  strokeOpacity: 0.25,
  fill: 'none',
});

export const spinnerArc = style({
  stroke: 'currentColor',
  fill: 'none',
  strokeLinecap: 'round',
  strokeDasharray: '1px, 100px',
  strokeDashoffset: '0',
  animation: `${dash} ${progressVars.indeterminateDurationCircular} ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', strokeDasharray: '30px, 100px' },
  },
});
