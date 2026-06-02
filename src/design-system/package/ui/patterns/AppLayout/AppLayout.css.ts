import { style, globalStyle } from '@vanilla-extract/css';
import {
  colorVars,
  spacingVars,
  motionVars,
  zIndexVars,
  iconSizeVars,
  radiusVars,
  fontFamilyVars,
} from '../../../tokens/index.ts';

// Host — full-screen app shell: a flex row of [sidebar dock] + [main column].
// The slotted sidebar's own host reserves its width (320/96px) and animates it,
// so the content column reflows on collapse/expand with no JS.
export const host = style({
  display: 'flex',
  width: '100%',
  height: '100dvh',
  boxSizing: 'border-box',
  fontFamily: fontFamilyVars.sans,
  overflow: 'hidden',
});

// Sidebar dock.
// Desktop: an in-flow spacer that shrinks to the slotted sidebar host width.
// Mobile (`[data-mobile]`): an off-canvas fixed drawer. Because it carries a
// `transform`, the dock becomes the containing block for the slotted sidebar's
// own `position: fixed` bar, so translating the dock slides the whole sidebar.
export const sidebarDock = style({
  flex: 'none',
  display: 'flex',
  transition: `transform ${motionVars.durationBase} ${motionVars.easingEaseInOut}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  selectors: {
    ':host([data-mobile]) &': {
      position: 'fixed',
      insetBlock: 0,
      insetInlineStart: 0,
      zIndex: zIndexVars.modal,
      transform: 'translateX(-100%)',
    },
    ':host([data-mobile][data-drawer-open]) &': {
      transform: 'translateX(0)',
    },
  },
});

// Scrim — backdrop shown behind the mobile drawer; clicking it closes the drawer.
export const scrim = style({
  display: 'none',
  position: 'fixed',
  inset: 0,
  zIndex: zIndexVars.overlay,
  border: 'none',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  selectors: {
    ':host([data-mobile][data-drawer-open]) &': { display: 'block' },
  },
});

// Main — content column: pinned topbar + scrollable content.
export const main = style({
  flex: '1 1 auto',
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

// Topbar — hosts the built-in hamburger and the navbar slot. Carries the navbar
// surface + bottom border so the bar reads continuously left of the slotted navbar.
export const topbar = style({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: colorVars.surfaceSubtle,
  borderBottom: `2px solid ${colorVars.borderDefault}`,
});

// Built-in hamburger (ghost icon button). Visibility is driven from the adapter
// via the `hidden` property based on the `menu-button` mode + mobile state.
export const menuToggle = style({
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  marginInline: spacingVars.sm,
  padding: 0,
  border: 'none',
  borderRadius: radiusVars.md,
  backgroundColor: 'transparent',
  color: colorVars.textPrimary,
  cursor: 'pointer',
  transition: `background-color ${motionVars.durationFast} ${motionVars.easingEaseOut}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  selectors: {
    '&:hover': { backgroundColor: colorVars.brandAccentHover },
    '&:focus-visible': {
      outline: `2px solid ${colorVars.brandAccent}`,
      outlineOffset: '2px',
    },
    '&[hidden]': { display: 'none' },
  },
});

globalStyle(`${menuToggle} svg`, {
  width: iconSizeVars.md,
  height: iconSizeVars.md,
  display: 'block',
});

// Content — the only scrollable region; the topbar stays pinned above it.
export const content = style({
  flex: '1 1 auto',
  minHeight: 0,
  overflow: 'auto',
});
