import './AvatarGroup.element.ts';
import type { ElementType } from 'react';
import type { AvatarGroupProps } from '../Avatar.types.ts';

export function AvatarGroup({ max, size = 'md', className, children, ...props }: AvatarGroupProps) {
  const El = 'loom-avatar-group' as ElementType;
  return (
    <El
      max={max}
      size={size}
      className={className}
      {...(props as object)}
    >
      {children}
    </El>
  );
}
