import { style, styleVariants, keyframes, createVar } from '@vanilla-extract/css';
import {
  colorVars,
  spacingVars,
  radiusVars,
  shadowVars,
  typographyVars,
  motionVars,
  zIndexVars,
} from '../../../tokens/index.ts';

// ─── Type accent variable (set on host, consumed by icon + progress bar) ─────

const typeAccentVar = createVar();

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeSlideIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px) scale(0.96)' },
  to:   { opacity: 1, transform: 'translateY(0)   scale(1)' },
});

const fadeSlideOut = keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to:   { opacity: 0, transform: 'scale(0.95)' },
});

// ─── Host / root ──────────────────────────────────────────────────────────────

export const root = style({
  display: 'block',
  width: '460px',
  maxWidth: 'calc(100vw - 32px)',
  pointerEvents: 'all',
  backgroundColor: colorVars.surfaceRaised,
  borderRadius: radiusVars.md,
  boxShadow: shadowVars.md,
  border: `1px solid ${colorVars.borderSubtle}`,
  boxSizing: 'border-box',
  overflow: 'hidden',
  animation: `${fadeSlideIn} ${motionVars.durationSlow} ${motionVars.easingEaseOut} both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

// ─── Lifecycle states ─────────────────────────────────────────────────────────

export const exiting = style({
  animation: `${fadeSlideOut} ${motionVars.durationBase} ${motionVars.easingEaseIn} both`,
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

// ─── Fixed position variants (applied to host when position attr is set) ──────

export const positioned = style({
  position: 'fixed',
  zIndex: zIndexVars.overlay,
});

export const positionVariant = styleVariants({
  'top-right':     { top: spacingVars.md, right: spacingVars.md },
  'top-left':      { top: spacingVars.md, left:  spacingVars.md },
  'top-center':    { top: spacingVars.md, left: '50%', translate: '-50% 0' },
  'bottom-right':  { bottom: spacingVars.md, right: spacingVars.md },
  'bottom-left':   { bottom: spacingVars.md, left:  spacingVars.md },
  'bottom-center': { bottom: spacingVars.md, left: '50%', translate: '-50% 0' },
});

// ─── Inner container ──────────────────────────────────────────────────────────

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  padding: spacingVars.md,
  gap: spacingVars.sm,
});

// ─── Header row (icon + content + dismiss) ────────────────────────────────────

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: spacingVars.sm,
});

// Applied when description is absent — vertically centers icon + title.
export const headerCompact = style({
  alignItems: 'center',
});

// ─── Icon wrap ────────────────────────────────────────────────────────────────

export const iconWrap = style({
  flexShrink: 0,
  width:  '32px',
  height: '32px',
  borderRadius: radiusVars.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2px',
  color: colorVars.textInverse,
});

// Set typeAccentVar on the host element — cascades into shadow DOM children.
export const rootTypeVariant = styleVariants({
  success: { vars: { [typeAccentVar]: colorVars.feedbackSuccess } },
  info:    { vars: { [typeAccentVar]: colorVars.feedbackInfo    } },
  warning: { vars: { [typeAccentVar]: colorVars.feedbackWarning } },
  error:   { vars: { [typeAccentVar]: colorVars.feedbackDanger  } },
});

// Single static class — color comes from the variable above.
export const iconWrapColored = style({
  backgroundColor: typeAccentVar,
});

// ─── Content area (title + description) ──────────────────────────────────────

export const content = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacingVars.xxs,
});

export const title = style({
  margin: 0,
  padding: 0,
  fontSize: typographyVars.labelLg.fontSize,
  fontWeight: typographyVars.labelLg.fontWeight,
  lineHeight: typographyVars.labelLg.lineHeight,
  letterSpacing: typographyVars.labelLg.letterSpacing,
  color: colorVars.textPrimary,
});

export const description = style({
  margin: 0,
  padding: 0,
  fontSize: typographyVars.bodySm.fontSize,
  fontWeight: typographyVars.bodySm.fontWeight,
  lineHeight: typographyVars.bodySm.lineHeight,
  letterSpacing: typographyVars.bodySm.letterSpacing,
  color: colorVars.textSecondary,
});

// ─── Dismiss button ───────────────────────────────────────────────────────────

export const dismissBtn = style({
  flexShrink: 0,
  width:  '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: colorVars.textSecondary,
  borderRadius: radiusVars.xs,
  padding: 0,
  marginTop: '2px',
  transition: `color ${motionVars.durationFast} ${motionVars.easingEaseOut}, background-color ${motionVars.durationFast} ${motionVars.easingEaseOut}`,
  ':hover': {
    color: colorVars.textPrimary,
    backgroundColor: colorVars.surfaceSubtle,
  },
  ':focus-visible': {
    outline: `2px solid ${colorVars.brandAccent}`,
    outlineOffset: '2px',
  },
  ':active': {
    backgroundColor: colorVars.surfaceNeutral,
  },
});

// ─── Action link (snackbar variant) ─────────────────────────────────────────

export const actionLink = style({
  alignSelf: 'flex-end',
  marginLeft: `calc(${spacingVars.sm} + 32px)`,
  paddingTop: spacingVars.xxs,
});

// ─── Progress bar (auto-dismiss timer) ───────────────────────────────────────

const shrinkWidth = keyframes({
  from: { transform: 'scaleX(1)' },
  to:   { transform: 'scaleX(0)' },
});

export const progressTrack = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '4px',
  backgroundColor: colorVars.borderSubtle,
  overflow: 'hidden',
});

export const progressBar = style({
  height: '100%',
  transformOrigin: 'left center',
  backgroundColor: typeAccentVar,
  // duration is set via inline style on the element
});

export const progressBarAnimating = style({
  animation: `${shrinkWidth} linear both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      display: 'none',
    },
  },
});
