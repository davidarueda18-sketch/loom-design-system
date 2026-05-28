import type { ComponentPropsWithoutRef } from 'react';

export interface TabGroupChangeEventDetail {
  value: string;
}

export interface TabGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Value of the currently active tab */
  active?: string;
  /** Fired when the user selects a different tab */
  onChange?: (detail: TabGroupChangeEventDetail) => void;
}

export interface LoomTabGroupElement extends HTMLElement {
  active: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'loom-tab-group': LoomTabGroupElement;
  }
}
