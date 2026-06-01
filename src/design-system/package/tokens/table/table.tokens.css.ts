import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';
import { colorVars } from '../color/color.tokens.css.ts';
import { spacingVars } from '../spacing/spacing.tokens.css.ts';
import { radiusVars } from '../radius/radius.tokens.css.ts';
import { motionVars } from '../motion/motion.tokens.css.ts';

export const tableVars = createThemeContract({
  surface:              null,
  headerBg:             null,
  rowBg:                null,
  rowBgHover:           null,
  rowBgSelected:        null,
  rowBgDisabled:        null,
  borderColor:          null,
  cellPaddingX:         null,
  cellPaddingY:         null,
  cellPaddingYCompact:  null,
  headerTextColor:      null,
  cellTextColor:        null,
  secondaryTextColor:   null,
  radius:               null,
  expansionBg:          null,
  selectionColumnWidth: null,
  expandColumnWidth:    null,
  stickyShadow:         null,
  expandDuration:       null,
  expandEasing:         null,
});

// Single :root theme: color values reference `colorVars`, which already swap
// between light/dark themes, so the table inherits theming for free.
createGlobalTheme(':root', tableVars, {
  surface:              colorVars.surfaceRaised,
  headerBg:             colorVars.surfaceSubtle,
  rowBg:                colorVars.surfaceRaised,
  rowBgHover:           colorVars.surfaceSubtle,
  rowBgSelected:        colorVars.brandAccentSubtle,
  rowBgDisabled:        colorVars.surfaceSubtle,
  borderColor:          colorVars.borderDefault,
  cellPaddingX:         spacingVars.smMd,
  cellPaddingY:         spacingVars.md,
  cellPaddingYCompact:  spacingVars.sm,
  headerTextColor:      colorVars.textPrimary,
  cellTextColor:        colorVars.textPrimary,
  secondaryTextColor:   colorVars.textSecondary,
  radius:               radiusVars.lg,
  expansionBg:          colorVars.surfaceBase,
  selectionColumnWidth: '48px',
  expandColumnWidth:    '48px',
  stickyShadow:         '2px 0 4px rgba(0, 0, 0, 0.12)',
  expandDuration:       motionVars.durationBase,
  expandEasing:         motionVars.easingEaseInOut,
});
