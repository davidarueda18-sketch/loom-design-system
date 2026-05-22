import type { ComponentPropsWithoutRef } from 'react';
import type { ColorTokenKey } from '../../../tokens/index.ts';

export const PROGRESS_THICKNESSES     = ['sm', 'md']                       as const satisfies readonly string[];
export const PROGRESS_SHAPES          = ['flat', 'wave']                   as const satisfies readonly string[];
export const PROGRESS_CIRCULAR_SIZES  = ['sm', 'md', 'lg']                 as const satisfies readonly string[];
export const PROGRESS_COLORS          = [
  'brandAccent',
  'brandPrimary',
  'feedbackSuccess',
  'feedbackWarning',
  'feedbackDanger',
  'feedbackInfo',
] as const satisfies readonly ColorTokenKey[];

export type ProgressThickness    = typeof PROGRESS_THICKNESSES[number];
export type ProgressShape        = typeof PROGRESS_SHAPES[number];
export type ProgressCircularSize = typeof PROGRESS_CIRCULAR_SIZES[number];
export type ProgressColor        = typeof PROGRESS_COLORS[number];

// ─── ProgressLinear ──────────────────────────────────────────────────────────

export interface ProgressLinearOwnProps {
  /** Current progress value in `[0..max]`. Omit (or pass `undefined`) for indeterminate. */
  value?: number;
  /** Maximum value. Defaults to `100`. */
  max?: number;
  /** Forces indeterminate mode regardless of `value`. */
  indeterminate?: boolean;
  /** Track thickness: `sm` (4 dp) or `md` (8 dp). Defaults to `sm`. */
  thickness?: ProgressThickness;
  /** Active-indicator color token. Defaults to `brandAccent`. */
  color?: ProgressColor;
  /** Active-track shape: solid bar (`flat`) or animated sinusoid (`wave`). Defaults to `flat`. */
  shape?: ProgressShape;
  /** Optional caption rendered below the bar. */
  label?: string;
  /** When `true`, appends the percentage (e.g. `42%`) next to `label`. Determinate only. */
  showValue?: boolean;
}

export type ProgressLinearProps =
  ProgressLinearOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof ProgressLinearOwnProps>;

// ─── ProgressCircular ────────────────────────────────────────────────────────

export interface ProgressCircularOwnProps {
  /** Current progress value in `[0..max]`. Omit (or pass `undefined`) for indeterminate. */
  value?: number;
  /** Maximum value. Defaults to `100`. */
  max?: number;
  /** Forces indeterminate mode regardless of `value`. */
  indeterminate?: boolean;
  /** Ring thickness: `sm` (4 dp) or `md` (8 dp). Defaults to `sm`. */
  thickness?: ProgressThickness;
  /** Outer diameter: `sm` (24 px), `md` (40 px) or `lg` (56 px). Defaults to `md`. */
  size?: ProgressCircularSize;
  /** Active-arc color token. Defaults to `brandAccent`. */
  color?: ProgressColor;
  /** Optional caption rendered inside the ring. */
  label?: string;
  /** When `true`, the centered text shows `${percent}%` (overrides `label`). Determinate only. */
  showValue?: boolean;
}

export type ProgressCircularProps =
  ProgressCircularOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof ProgressCircularOwnProps>;
