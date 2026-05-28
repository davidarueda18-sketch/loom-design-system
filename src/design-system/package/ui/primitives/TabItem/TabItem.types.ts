import type { ComponentPropsWithoutRef } from 'react';

export const TAB_ITEM_STATES = ['default', 'hover', 'selected', 'disabled'] as const;
export type TabItemState = (typeof TAB_ITEM_STATES)[number];

export interface TabItemSelectEventDetail {
  value: string;
}

export interface TabItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect'> {
  /** Unique identifier for this tab, used by TabGroup to track the active tab */
  value: string;
  /** Display text for the tab */
  label: string;
  /** Whether the tab is currently active / selected */
  active?: boolean;
  /** Whether the tab is non-interactive */
  disabled?: boolean;
  /** Whether to show the icon slot */
  showIcon?: boolean;
  /** Fired when the user selects this tab */
  onSelect?: (detail: TabItemSelectEventDetail) => void;
}

export interface LoomTabItemElement extends HTMLElement {
  value: string;
  label: string;
  active: boolean;
  disabled: boolean;
  showIcon: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'loom-tab-item': LoomTabItemElement;
  }
}
