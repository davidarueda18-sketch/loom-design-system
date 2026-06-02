import type { ComponentPropsWithoutRef } from 'react';

/** Semantic toast variants. Maps to the `type` attribute on `<loom-toast>`. */
export const TOAST_TYPES = ['success', 'info', 'warning', 'error'] as const;
/** Semantic intent that controls icon, accent color, and live-region urgency. */
export type ToastType = (typeof TOAST_TYPES)[number];

/** Fixed viewport positions available when a toast is self-positioned. */
export const TOAST_POSITIONS = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
] as const;
/** Optional fixed placement for the toast host. Omit when a parent layout positions toasts. */
export type ToastPosition = (typeof TOAST_POSITIONS)[number];

/** Detail payload emitted by `loom-toast-dismiss`. */
export interface ToastDismissEventDetail {
  /**
   * Source that requested dismissal.
   * - `user`: dismiss button or public `dismiss()` API.
   * - `timeout`: auto-dismiss duration elapsed.
   * - `action`: action link was activated and then dismissed the toast.
   */
  reason: 'user' | 'timeout' | 'action';
}

/** Detail payload emitted by `loom-toast-action`. */
export interface ToastActionEventDetail {
  /** Visible action label that was activated. */
  label: string;
}

/** React adapter props for the canonical `<loom-toast>` custom element. */
export interface ToastProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Semantic variant. Defaults to `info`. */
  type?: ToastType;
  /** Required primary message rendered in `part="title"`. */
  title: string;
  /** Optional supporting message rendered in `part="description"`. */
  description?: string;
  /** Shows the dismiss button unless set to `false`. Defaults to `true`. */
  dismissible?: boolean;
  /** Optional action label rendered as the snackbar action. */
  'action-label'?: string;
  /** Auto-dismiss delay in milliseconds. Use `0` to disable auto-dismiss. */
  duration?: number;
  /** Optional fixed viewport placement. */
  position?: ToastPosition;
}
