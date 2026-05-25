import './Stack.element.ts';
import type { ElementType } from 'react';
import type { StackProps } from '../Stack.types.ts';

export function Stack<T extends ElementType = 'div'>({
  as: _as,
  gap,
  align = 'stretch',
  justify = 'start',
  children,
  className,
  ...props
}: StackProps<T>) {
  void _as;
  const Tag = 'loom-stack' as ElementType;
  return (
    <Tag
      gap={gap}
      align={align}
      justify={justify}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
