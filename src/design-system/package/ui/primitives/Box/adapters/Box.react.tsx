import './Box.element.ts';
import type { ElementType } from 'react';
import type { BoxProps } from '../Box.types.ts';

export function Box<T extends ElementType = 'div'>({
  as: _as,
  display,
  padding,
  paddingX,
  paddingY,
  children,
  className,
  ...props
}: BoxProps<T>) {
  void _as;
  const Tag = 'loom-box' as ElementType;

  return (
    <Tag
      display={display}
      padding={padding}
      padding-x={paddingX}
      padding-y={paddingY}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
