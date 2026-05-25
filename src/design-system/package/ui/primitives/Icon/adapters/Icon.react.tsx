import './Icon.element.ts';
import type { ElementType } from 'react';
import type { IconProps } from '../Icon.types.ts';

export function Icon<T extends ElementType = 'span'>({
  as: _as,
  size = 'md',
  color,
  label,
  children,
  className,
  ...props
}: IconProps<T>) {
  void _as;
  const Tag = 'loom-icon' as ElementType;

  return (
    <Tag
      size={size}
      color={color}
      label={label}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
