import { globalStyle, style } from '@vanilla-extract/css';
import {
  fontFamilyVars,
  spacingVars,
  typographyVars,
  tableVars,
} from '../../../tokens/index.ts';

export const root = style({
  display: 'block',
  width: '100%',
});

export const scrollContainer = style({
  position: 'relative',
  width: '100%',
  overflowX: 'auto',
  borderRadius: tableVars.radius,
  border: `1px solid ${tableVars.borderColor}`,
  backgroundColor: tableVars.surface,
  boxSizing: 'border-box',
});

/**
 * Establishes the `loom-table` query container — added ONLY when layout is
 * `auto`, so the responsive stacked rules (in Row/Cell) never fire in `scroll`
 * or `stacked` modes (those are JS-class driven instead).
 */
export const autoContainer = style({
  containerType: 'inline-size',
  containerName: 'loom-table',
});

export const grid = style({
  fontFamily: fontFamilyVars.sans,
  color: tableVars.cellTextColor,
  boxSizing: 'border-box',
  gridTemplateColumns: 'var(--loom-table-template, repeat(1, minmax(0, 1fr)))',
});

export const layoutScroll = style({
  display: 'grid',
  width: 'max-content',
  minWidth: '100%',
});

export const layoutAuto = style({
  display: 'grid',
  width: 'max-content',
  minWidth: '100%',
  '@container': {
    'loom-table (max-width: 640px)': {
      display: 'block',
      width: '100%',
      padding: spacingVars.sm,
    },
  },
});

export const layoutStacked = style({
  display: 'block',
  width: '100%',
  padding: spacingVars.sm,
});

export const empty = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacingVars.xl,
  color: tableVars.secondaryTextColor,
  fontFamily: fontFamilyVars.sans,
  fontSize: typographyVars.bodyBase.fontSize,
  selectors: { '&[hidden]': { display: 'none' } },
});

export const loadingOverlay = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: tableVars.surface,
  opacity: 0.6,
  selectors: { '&[hidden]': { display: 'none' } },
});

globalStyle(`${grid}::slotted(*)`, {
  minWidth: 0,
});
