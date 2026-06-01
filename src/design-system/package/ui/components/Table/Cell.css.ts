import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import {
  colorVars,
  fontFamilyVars,
  fontWeightVars,
  spacingVars,
  typographyVars,
  tableVars,
} from '../../../tokens/index.ts';

/** Applied to the host (`loom-table-cell` / `loom-table-header-cell`) — it is a grid item. */
export const host = style({
  display: 'flex',
  alignItems: 'stretch',
  minWidth: 0,
  boxSizing: 'border-box',
  gridColumn: 'var(--loom-cell-col-span, auto)',
});

export const cell = style({
  display: 'flex',
  flex: '1 1 auto',
  alignItems: 'center',
  gap: spacingVars.sm,
  minWidth: 0,
  width: '100%',
  paddingInline: tableVars.cellPaddingX,
  paddingBlock: tableVars.cellPaddingY,
  color: tableVars.cellTextColor,
  fontFamily: fontFamilyVars.sans,
  fontSize: typographyVars.bodyBase.fontSize,
  fontWeight: typographyVars.bodyBase.fontWeight,
  lineHeight: typographyVars.bodyBase.lineHeight,
  letterSpacing: typographyVars.bodyBase.letterSpacing,
  boxSizing: 'border-box',
  '@container': {
    'loom-table (max-width: 640px)': {
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
  },
});

/** Compact density — toggled by the cell when its ancestor table is `density="compact"`. */
export const compact = style({
  paddingBlock: tableVars.cellPaddingYCompact,
});

export const header = style({
  color: tableVars.headerTextColor,
  fontWeight: fontWeightVars.bold,
  backgroundColor: tableVars.headerBg,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: '1 1 auto',
});

export const align = styleVariants({
  start: { justifyContent: 'flex-start', textAlign: 'start' },
  center: { justifyContent: 'center', textAlign: 'center' },
  end: { justifyContent: 'flex-end', textAlign: 'end' },
});

export const numeric = style({
  justifyContent: 'flex-end',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'end',
});

export const leading = style({
  display: 'inline-flex',
  alignItems: 'center',
  flex: '0 0 auto',
  selectors: { '&[hidden]': { display: 'none' } },
});

export const trailing = style({
  display: 'inline-flex',
  alignItems: 'center',
  flex: '0 0 auto',
  marginInlineStart: 'auto',
  selectors: { '&[hidden]': { display: 'none' } },
});

/** Per-column header label of a cell — only rendered in stacked / card layout. */
export const mobileLabel = style({
  display: 'none',
  width: '100%',
  marginBottom: spacingVars.xxs,
  color: tableVars.secondaryTextColor,
  fontFamily: fontFamilyVars.sans,
  fontSize: typographyVars.labelSm.fontSize,
  fontWeight: typographyVars.labelSm.fontWeight,
  lineHeight: typographyVars.labelSm.lineHeight,
  '@container': {
    'loom-table (max-width: 640px)': { display: 'block' },
  },
});

export const sortButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
  width: '20px',
  height: '20px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  selectors: { '&[hidden]': { display: 'none' } },
});

/**
 * Stacked / card layout — applied to the cell wrapper (and mobileLabel) by the
 * element when the ancestor table resolves to a stacked layout. Wraps content
 * onto its own line and reveals the per-cell mobile label.
 */
export const stackedCell = style({
  flexWrap: 'wrap',
  alignItems: 'flex-start',
});

export const mobileLabelVisible = style({
  display: 'block',
});

/* Truncation applies to the slotted text content. */
export const truncate = style({});
globalStyle(`${truncate} ${content}`, {
  overflow: 'hidden',
});
globalStyle(`${truncate} ${content}::slotted(*)`, {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

globalStyle(`${content}::slotted(*)`, {
  margin: 0,
  minWidth: 0,
});

globalStyle(`${cell}::slotted(loom-link)`, {
  color: colorVars.brandAccent,
});
