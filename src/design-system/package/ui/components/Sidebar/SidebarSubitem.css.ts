import { globalStyle, style } from '@vanilla-extract/css';
import { fontFamilyVars, typographyVars, sidebarVars, spacingVars } from '../../../tokens/index.ts';

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
  gap: spacingVars.xs,
  width: '100%',
  minHeight: '32px',
  boxSizing: 'border-box',
  paddingBlock: 0,
  color: sidebarVars.textRest,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderRadius: sidebarVars.rowRadius,
  transition: `background-color ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}, color ${sidebarVars.collapseDuration} ${sidebarVars.collapseEasing}`,
  selectors: {
    '&:hover': {
      color: sidebarVars.textSelected,
    },
  },
});

/** L-shaped connector guide rail on the left of the subitem. */
export const connector = style({
  flex: 'none',
  position: 'relative',
  alignSelf: 'stretch',
  width: '24px',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '11px',
      top: 0,
      bottom: 0,
      width: '1px',
      backgroundColor: sidebarVars.subitemConnectorColor,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '11px',
      right: 0,
      bottom: 0,
      height: '1px',
      backgroundColor: sidebarVars.subitemConnectorColor,
    },
  },
});

export const label = style({
  flex: '1 1 auto',
  alignSelf: 'flex-end',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: typographyVars.caption.fontSize,
  fontWeight: typographyVars.caption.fontWeight,
  lineHeight: '12px',
  letterSpacing: typographyVars.caption.letterSpacing,
});

export const selected = style({
  color: sidebarVars.textSelected,
});

globalStyle(`${selected} .${connector}::before, ${selected} .${connector}::after`, {
  backgroundColor: sidebarVars.indicatorColor,
});

export const disabled = style({
  opacity: 0.5,
  pointerEvents: 'none',
});
