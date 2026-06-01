import { style } from '@vanilla-extract/css';
import {
  radiusVars,
  spacingVars,
  tableVars,
} from '../../../tokens/index.ts';

/** The row host is a grid item of the table; it re-exposes the table tracks via subgrid. */
export const host = style({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  alignItems: 'stretch',
  position: 'relative',
  backgroundColor: tableVars.rowBg,
  borderTop: `1px solid ${tableVars.borderColor}`,
  color: tableVars.cellTextColor,
});

export const selected = style({
  backgroundColor: tableVars.rowBgSelected,
});

export const interactive = style({
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: tableVars.rowBgHover },
    '&:focus-visible': { outline: '2px solid currentColor', outlineOffset: '-2px' },
  },
});

export const disabled = style({
  opacity: 0.5,
  pointerEvents: 'none',
});

/** Selection / expand-toggle control wrappers occupying their own grid track. */
export const control = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
  paddingInline: spacingVars.sm,
  selectors: { '&[hidden]': { display: 'none' } },
});

export const toggleButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  borderRadius: radiusVars.sm,
  fontSize: '16px',
  lineHeight: 1,
  transition: `transform ${tableVars.expandDuration} ${tableVars.expandEasing}`,
  selectors: {
    '&:focus-visible': { outline: '2px solid currentColor', outlineOffset: '2px' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const toggleExpanded = style({
  transform: 'rotate(180deg)',
});

const cardStyle = {
  display: 'block',
  gridColumn: 'auto',
  border: `1px solid ${tableVars.borderColor}`,
  borderRadius: radiusVars.md,
  padding: spacingVars.sm,
  marginBottom: spacingVars.sm,
  backgroundColor: tableVars.rowBg,
} as const;

/** Forced stacked card (table `layout="stacked"`). */
export const forcedStack = style(cardStyle);

/** Auto stacked card (table `layout="auto"`, below the container breakpoint). */
export const autoStack = style({
  '@container': {
    'loom-table (max-width: 640px)': cardStyle,
  },
});
