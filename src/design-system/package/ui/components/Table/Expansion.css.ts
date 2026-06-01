import { style } from '@vanilla-extract/css';
import { spacingVars, tableVars } from '../../../tokens/index.ts';

/** Spans all table columns and animates open/closed via the 0fr → 1fr grid trick. */
export const host = style({
  gridColumn: '1 / -1',
  display: 'grid',
  gridTemplateRows: '0fr',
  backgroundColor: tableVars.expansionBg,
  transition: `grid-template-rows ${tableVars.expandDuration} ${tableVars.expandEasing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const expanded = style({
  gridTemplateRows: '1fr',
});

export const inner = style({
  overflow: 'hidden',
  minHeight: 0,
});

export const panel = style({
  paddingInline: tableVars.cellPaddingX,
  paddingBlock: spacingVars.smMd,
  borderTop: `1px solid ${tableVars.borderColor}`,
});
