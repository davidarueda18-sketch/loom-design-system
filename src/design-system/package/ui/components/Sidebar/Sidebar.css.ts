import { style } from '@vanilla-extract/css';
import { fontFamilyVars, sidebarVars, spacingVars } from '../../../tokens/index.ts';

export const host = style({
  position: 'relative',
  display: 'block',
  boxSizing: 'border-box',
  width: sidebarVars.widthExpanded,
  minWidth: sidebarVars.widthExpanded,
  height: '100%',
  fontFamily: fontFamilyVars.sans,
  color: sidebarVars.textRest,
  transition: `width ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}, min-width ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const hostCollapsed = style({
  width: sidebarVars.widthCollapsed,
  minWidth: sidebarVars.widthCollapsed,
});

export const container = style({
  position: 'fixed',
  insetBlock: 0,
  insetInlineStart: 0,
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  width: sidebarVars.widthExpanded,
  height: '100%',
  minHeight: '100dvh',
  boxSizing: 'border-box',
  backgroundColor: sidebarVars.surface,
  borderRight: `2px solid ${sidebarVars.borderColor}`,
  paddingBlock: sidebarVars.paddingBlock,
  paddingInline: sidebarVars.paddingInline,
  gap: 0,
  overflow: 'hidden',
  transition: `width ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  selectors: {
    [`:host(.${hostCollapsed}) &`]: { width: sidebarVars.widthCollapsed },
  },
});

export const header = style({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: sidebarVars.rowGap,
  paddingInline: spacingVars.smMd,
  paddingBlock: spacingVars.smMd,
  minHeight: '40px',
  position: 'relative',
  selectors: {
    [`:host(.${hostCollapsed}) &`]: { justifyContent: 'center' },
    '&[hidden]': { display: 'none' },
  },
});

export const headerAction = style({
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: `opacity ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}, width ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  selectors: {
    [`:host(.${hostCollapsed}) &`]: {
      position: 'absolute',
      insetInlineStart: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      opacity: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    [`:host(.${hostCollapsed}:hover) &`]: {
      width: '32px',
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
});

export const logo = style({
  flex: '0 0 auto',
  display: 'block',
  alignSelf: 'stretch',
  width: 'auto',
  maxWidth: '160px',
  height: '40px',
  objectFit: 'contain',
  objectPosition: 'left center',
  transition: `height ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}, opacity ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  selectors: {
    [`:host(.${hostCollapsed}) &`]: {
      position: 'absolute',
      insetInlineStart: '50%',
      transform: 'translateX(-50%)',
      height: '32px',
      maxWidth: '32px',
    },
    [`:host(.${hostCollapsed}:hover) &`]: {
      opacity: 0,
    },
    '&[hidden]': { display: 'none' },
  },
});

export const divider = style({
  flex: 'none',
  width: '100%',
  height: '2px',
  backgroundColor: sidebarVars.borderColor,
  selectors: {
    '&[hidden]': { display: 'none' },
  },
});

export const nav = style({
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: sidebarVars.itemGap,
  marginBlockStart: sidebarVars.sectionGap,
  paddingInline: spacingVars.smMd,
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const footer = style({
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: sidebarVars.itemGap,
  marginBlockStart: sidebarVars.sectionGap,
  paddingInline: spacingVars.smMd,
  selectors: {
    '&[hidden]': { display: 'none' },
  },
});
