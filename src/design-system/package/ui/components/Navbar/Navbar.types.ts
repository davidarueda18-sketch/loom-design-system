import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface NavbarOwnProps {
  /** Application name — bold title on the left of the bar. */
  application?: string;
  /** Current section / context — light subtitle shown after the divider. */
  section?: string;
  /** Actions rendered on the right (e.g. `loom-icon-button`). */
  children?: ReactNode;
}

export type NavbarProps = NavbarOwnProps &
  Omit<ComponentPropsWithoutRef<'nav'>, keyof NavbarOwnProps>;
