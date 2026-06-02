import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';
import { colorVars } from '../color/color.tokens.css.ts';
import { spacingVars } from '../spacing/spacing.tokens.css.ts';
import { radiusVars } from '../radius/radius.tokens.css.ts';
import { motionVars } from '../motion/motion.tokens.css.ts';

export const sidebarVars = createThemeContract({
  // Container
  widthExpanded:        null,
  widthCollapsed:       null,
  surface:              null,
  borderColor:          null,
  paddingBlock:         null,
  paddingInline:        null,
  sectionGap:           null,
  itemGap:              null,

  // Item / group row
  rowPaddingX:          null,
  rowPaddingY:          null,
  rowRadius:            null,
  rowGap:               null,
  rowBgHover:           null,
  rowBgSelected:        null,

  // Indicator (left active bar)
  indicatorWidth:       null,
  indicatorHeight:      null,
  indicatorColor:       null,
  indicatorRadius:      null,
  indicatorGap:         null,

  // Foreground
  textRest:             null,
  textSelected:         null,
  textDisabled:         null,
  iconColorRest:        null,
  iconColorSelected:    null,
  focusRing:            null,

  // Subitem
  subitemConnectorColor: null,
  subitemIndent:         null,

  // Motion
  collapseDuration:     null,
  collapseEasing:       null,
});

// Single :root theme: color values reference `colorVars`, which already swap
// between light/dark themes, so the sidebar inherits theming for free.
createGlobalTheme(':root', sidebarVars, {
  widthExpanded:        '320px',
  widthCollapsed:       '96px',
  surface:              colorVars.surfaceSubtle,
  borderColor:          colorVars.borderDefault,
  paddingBlock:         spacingVars.md,
  paddingInline:        spacingVars.sm,
  sectionGap:           spacingVars.xl,
  itemGap:              spacingVars.smMd,

  rowPaddingX:          spacingVars.smMd,
  rowPaddingY:          spacingVars.sm,
  rowRadius:            radiusVars.md,
  rowGap:               spacingVars.sm,
  rowBgHover:           colorVars.brandAccentHover,
  rowBgSelected:        colorVars.brandAccentPressed,

  indicatorWidth:       '2px',
  indicatorHeight:      '34px',
  indicatorColor:       colorVars.brandAccent,
  indicatorRadius:      radiusVars.xxs,
  indicatorGap:         spacingVars.sm,

  textRest:             colorVars.textPrimary,
  textSelected:         colorVars.brandAccent,
  textDisabled:         colorVars.textDisabled,
  iconColorRest:        colorVars.textPrimary,
  iconColorSelected:    colorVars.brandAccent,
  focusRing:            colorVars.brandAccent,

  subitemConnectorColor: colorVars.borderStrong,
  subitemIndent:         '20px',

  collapseDuration:     motionVars.durationBase,
  collapseEasing:       motionVars.easingEaseInOut,
});
