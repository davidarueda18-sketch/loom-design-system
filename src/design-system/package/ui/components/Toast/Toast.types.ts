import type { ComponentPropsWithoutRef } from 'react';

export const TOAST_TYPES = ['success', 'info', 'warning', 'error'] as const;
export type ToastType = (typeof TOAST_TYPES)[number];

export const TOAST_POSITIONS = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
] as const;
export type ToastPosition = (typeof TOAST_POSITIONS)[number];

export interface ToastDismissEventDetail {
  reason: 'user' | 'timeout' | 'action';
}

export interface ToastActionEventDetail {
  label: string;
}

export interface ToastProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  type?: ToastType;
  title: string;
  description?: string;
  dismissible?: boolean;
  'action-label'?: string;
  duration?: number;
  position?: ToastPosition;
}
