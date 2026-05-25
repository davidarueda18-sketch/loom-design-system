import './Button.element.ts';
import type { ElementType } from 'react';
import type { ButtonProps } from '../Button.types.ts';

export function Button<T extends ElementType = 'button'>({
  as: _as,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps<T>) {
  void _as;
  const Tag = 'loom-button' as ElementType;
  return (
    <Tag
      variant={variant}
      size={size}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
