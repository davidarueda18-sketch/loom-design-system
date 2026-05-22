import type { ComponentPropsWithoutRef } from 'react';
import type { ColorTokenKey } from '../../../tokens/index.ts';

export const DIVIDER_ORIENTATIONS   = ['horizontal', 'vertical']              as const satisfies readonly string[];
export const DIVIDER_LABEL_POSITIONS = ['start', 'center', 'end']             as const satisfies readonly string[];
export const DIVIDER_COLORS         = ['borderSubtle', 'borderDefault', 'borderStrong'] as const satisfies readonly ColorTokenKey[];
export const DIVIDER_THICKNESSES    = ['thin', 'medium', 'thick']             as const satisfies readonly string[];
export const DIVIDER_LINE_STYLES    = ['solid', 'dashed']                     as const satisfies readonly string[];

export type DividerOrientation    = typeof DIVIDER_ORIENTATIONS[number];
export type DividerLabelPosition  = typeof DIVIDER_LABEL_POSITIONS[number];
export type DividerColor          = typeof DIVIDER_COLORS[number];
export type DividerThickness      = typeof DIVIDER_THICKNESSES[number];
export type DividerLineStyle      = typeof DIVIDER_LINE_STYLES[number];

export interface DividerOwnProps {
  /** Visual orientation of the divider. Defaults to `horizontal`. */
  orientation?: DividerOrientation;
  /** Optional label text rendered inside the divider line. */
  label?: string;
  /** Position of the label along the divider axis. Defaults to `center`. Ignored when `label` is absent. */
  labelPosition?: DividerLabelPosition;
  /** Semantic border-color token. Defaults to `borderDefault`. */
  color?: DividerColor;
  /** Line thickness. Defaults to `thin` (1 px). */
  thickness?: DividerThickness;
  /** Line draw style. Defaults to `solid`. */
  lineStyle?: DividerLineStyle;
}

export type DividerProps = DividerOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof DividerOwnProps>;
