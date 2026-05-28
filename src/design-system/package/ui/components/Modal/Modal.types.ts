import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl'] as const;
export type ModalSize = (typeof MODAL_SIZES)[number];

export interface ModalCloseEventDetail {
  reason: 'close' | 'backdrop' | 'escape';
}

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  open?: boolean;
  title?: string;
  size?: ModalSize;
  onClose?: (detail: ModalCloseEventDetail) => void;
  children?: ReactNode;
}
