import { globalStyle, style, styleVariants, keyframes } from '@vanilla-extract/css';
import {
  colorVars,
  radiusVars,
  shadowVars,
  spacingVars,
  typographyVars,
  motionVars,
  zIndexVars,
} from '../../../tokens/index.ts';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const backdropIn = keyframes({
  from: { opacity: 0 },
  to:   { opacity: 1 },
});

const backdropOut = keyframes({
  from: { opacity: 1 },
  to:   { opacity: 0 },
});

const dialogIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.95) translateY(8px)' },
  to:   { opacity: 1, transform: 'scale(1)   translateY(0)' },
});

const dialogOut = keyframes({
  from: { opacity: 1, transform: 'scale(1)   translateY(0)' },
  to:   { opacity: 0, transform: 'scale(0.95) translateY(8px)' },
});

// ─── Backdrop (fixed overlay) ─────────────────────────────────────────────────

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: zIndexVars.modal,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacingVars.lg,
  boxSizing: 'border-box',
  animation: `${backdropIn} ${motionVars.durationSlow} ${motionVars.easingEaseOut} both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

globalStyle(`${backdrop}[hidden]`, {
  display: 'none',
});

export const backdropExiting = style({
  animation: `${backdropOut} ${motionVars.durationBase} ${motionVars.easingEaseIn} both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

// ─── Dialog container ─────────────────────────────────────────────────────────

export const dialog = style({
  display: 'flex',
  flexDirection: 'column',
  containerType: 'inline-size',
  width: '100%',
  maxHeight: 'calc(100vh - 48px)',
  overflow: 'hidden',
  boxSizing: 'border-box',
  backgroundColor: colorVars.surfaceRaised,
  border: `1px solid ${colorVars.borderDefault}`,
  borderRadius: radiusVars.lg,
  boxShadow: shadowVars.xl2,
  animation: `${dialogIn} ${motionVars.durationSlow} ${motionVars.easingEaseOut} both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const dialogExiting = style({
  animation: `${dialogOut} ${motionVars.durationBase} ${motionVars.easingEaseIn} both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

// ─── Size variants ────────────────────────────────────────────────────────────

export const sizeVariant = styleVariants({
  sm: { maxWidth: '400px' },
  md: { maxWidth: '560px' },
  lg: { maxWidth: '720px' },
  xl: { maxWidth: '880px' },
});

// ─── Header ───────────────────────────────────────────────────────────────────

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacingVars.sm,
  padding: `0.75rem ${spacingVars.lg}`,
  flexShrink: 0,
});

export const titleEl = style({
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: colorVars.textPrimary,
  fontSize: typographyVars.headingH5.fontSize,
  fontWeight: typographyVars.headingH5.fontWeight,
  lineHeight: typographyVars.headingH5.lineHeight,
  letterSpacing: typographyVars.headingH5.letterSpacing,
});

// ─── Close button ─────────────────────────────────────────────────────────────

export const closeBtn = style({
  flexShrink: 0,
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: colorVars.textSecondary,
  borderRadius: radiusVars.xs,
  padding: 0,
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

globalStyle(`${closeBtn} > svg`, {
  width: '20px',
  height: '20px',
});

// ─── Content area ─────────────────────────────────────────────────────────────

export const content = style({
  flex: 1,
  position: 'relative',
  overflowY: 'auto',
  backgroundColor: colorVars.surfaceSubtle,
  padding: spacingVars.lg,
  boxSizing: 'border-box',
  minHeight: 'clamp(7.5rem, 36cqw, 18rem)',
});

export const emptyPlaceholder = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: spacingVars.md,
  color: colorVars.textSecondary,
  fontSize: typographyVars.bodyBase.fontSize,
  lineHeight: typographyVars.bodyBase.lineHeight,
  fontStyle: 'italic',
  pointerEvents: 'none',
  boxSizing: 'border-box',
});

globalStyle(`${emptyPlaceholder}[hidden]`, {
  display: 'none',
});

// ─── Footer ───────────────────────────────────────────────────────────────────

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: spacingVars.sm,
  padding: `0.75rem ${spacingVars.lg}`,
  flexShrink: 0,
});

globalStyle(`${footer}[hidden]`, {
  display: 'none',
});

export const footerSlot = style({
  display: 'contents',
});
