import { globalStyle, style } from '@vanilla-extract/css';
import { fontFamilyVars, iconSizeVars, typographyVars, sidebarVars } from '../../../tokens/index.ts';

export const host = style({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: fontFamilyVars.sans,
  outline: 'none',
  borderRadius: sidebarVars.rowRadius,
  selectors: {
    '&[hidden]': { display: 'none' },
    '&:focus-visible': {
      outline: `2px solid ${sidebarVars.focusRing}`,
      outlineOffset: '2px',
    },
  },
});

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: sidebarVars.indicatorGap,
  position: 'relative',
  width: '100%',
  boxSizing: 'border-box',
});

export const indicator = style({
  flex: 'none',
  width: sidebarVars.indicatorWidth,
  height: sidebarVars.indicatorHeight,
  borderRadius: sidebarVars.indicatorRadius,
  backgroundColor: sidebarVars.indicatorColor,
  visibility: 'hidden',
});

export const indicatorVisible = style({
  visibility: 'visible',
});

export const box = style({
  flex: '1 1 auto',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: sidebarVars.rowGap,
  paddingBlock: sidebarVars.rowPaddingY,
  paddingInline: sidebarVars.rowPaddingX,
  borderRadius: sidebarVars.rowRadius,
  color: sidebarVars.textRest,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  boxSizing: 'border-box',
  transition: `background-color ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}, color ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}`,
  selectors: {
    '&:hover': { backgroundColor: sidebarVars.rowBgHover },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const boxSelected = style({
  backgroundColor: sidebarVars.rowBgSelected,
  color: sidebarVars.textSelected,
  selectors: {
    '&:hover': { backgroundColor: sidebarVars.rowBgSelected },
  },
});

export const boxCollapsed = style({
  justifyContent: 'center',
});

export const iconWrap = style({
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: iconSizeVars.mini,
  height: iconSizeVars.mini,
  color: 'currentColor',
  overflow: 'hidden',
  selectors: {
    '&[hidden]': { display: 'none' },
  },
});

export const iconSlot = style({});

globalStyle(`${iconSlot}::slotted(*)`, {
  width: iconSizeVars.mini,
  height: iconSizeVars.mini,
  fontSize: iconSizeVars.mini,
});

export const label = style({
  flex: '1 1 auto',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: typographyVars.bodyBase.fontSize,
  fontWeight: typographyVars.bodyBase.fontWeight,
  lineHeight: typographyVars.bodyBase.lineHeight,
  letterSpacing: typographyVars.bodyBase.letterSpacing,
  selectors: {
    '&[hidden]': { display: 'none' },
  },
});

export const disabled = style({
  opacity: 0.5,
  pointerEvents: 'none',
});
