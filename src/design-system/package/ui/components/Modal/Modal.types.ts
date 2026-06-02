import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Supported modal width presets. Maps to the `size` attribute on `<loom-modal>`. */
export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl'] as const;
/** Width preset for the modal dialog surface. */
export type ModalSize = (typeof MODAL_SIZES)[number];

/** Detail payload emitted by the `loom-modal-close` custom event. */
export interface ModalCloseEventDetail {
  /**
   * User interaction that requested closure.
   * - `close`: the header close button was activated.
   * - `backdrop`: the user clicked outside the dialog panel.
   * - `escape`: the user pressed the Escape key while the modal was open.
   */
  reason: 'close' | 'backdrop' | 'escape';
}

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Controls visibility. In the Web Component API this maps to the boolean `open` attribute. */
  open?: boolean;
  /** Header title rendered inside `part="title"`. Omit for a titleless dialog. */
  title?: string;
  /** Dialog width preset. Defaults to `md`. */
  size?: ModalSize;
  /** Called when `<loom-modal>` emits `loom-modal-close`. */
  onClose?: (detail: ModalCloseEventDetail) => void;
  /** Body content projected into the default slot. Footer actions should use `slot="footer"`. */
  children?: ReactNode;
}
