import './Badge.element.ts';
import type { ElementType } from 'react';
import type { BadgeProps } from '../Badge.types.ts';

export function Badge({ state = 'default', variant = 'default', label, showLabel = true, className, ...props }: BadgeProps) {
  const BadgeElement = 'loom-badge' as ElementType;
  return (
    <BadgeElement
      state={state}
      variant={variant}
      label={label}
      show-label={String(showLabel)}
      className={className}
      {...(props as object)}
    />
  );
}
