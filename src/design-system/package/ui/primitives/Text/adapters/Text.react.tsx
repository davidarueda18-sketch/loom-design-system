import './Text.element.ts';
import type { ElementType } from 'react';
import type { TextProps } from '../Text.types.ts';

export function Text<T extends ElementType = 'p'>({
  as: _as,
  variant,
  align,
  children,
  className,
  ...props
}: TextProps<T>) {
  void _as;
  const Tag = 'loom-text' as ElementType;

  return (
    <Tag
      variant={variant}
      align={align}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
