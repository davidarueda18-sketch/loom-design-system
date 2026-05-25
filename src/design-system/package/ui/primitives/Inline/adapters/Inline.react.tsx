import './Inline.element.ts';
import type { ElementType } from 'react';
import type { InlineProps } from '../Inline.types.ts';

export function Inline<T extends ElementType = 'div'>({
  as: _as,
  gap,
  align = 'center',
  justify = 'start',
  wrap = false,
  children,
  className,
  ...props
}: InlineProps<T>) {
  void _as;
  const Tag = 'loom-inline' as ElementType;
  return (
    <Tag
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap || undefined}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
