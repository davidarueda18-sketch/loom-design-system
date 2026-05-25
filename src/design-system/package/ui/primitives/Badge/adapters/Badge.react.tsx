import './Badge.element.ts';
import type { ElementType } from 'react';
import type { BadgeProps } from '../Badge.types.ts';

export function Badge({ state = 'default', label, className, ...props }: BadgeProps) {
  const BadgeElement = 'loom-badge' as ElementType;
  return (
    <BadgeElement
      state={state}
      label={label}
      className={className}
      {...(props as object)}
    />
  );
}
