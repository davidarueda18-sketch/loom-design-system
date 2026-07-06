import './Avatar.element.ts';
import type { ElementType } from 'react';
import type { AvatarProps } from '../Avatar.types.ts';

export function Avatar({ name, email, photoUrl, size = 'md', className, ...props }: AvatarProps) {
  const El = 'loom-avatar' as ElementType;
  return (
    <El
      name={name}
      email={email}
      photo-url={photoUrl}
      size={size}
      className={className}
      {...(props as object)}
    />
  );
}
