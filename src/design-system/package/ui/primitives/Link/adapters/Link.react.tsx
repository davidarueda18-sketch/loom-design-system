import './Link.element.ts';
import type { ElementType } from 'react';
import type { LinkProps } from '../Link.types.ts';

export function Link<T extends ElementType = 'a'>({
  as,
  color = 'default',
  underline = 'always',
  children,
  className,
  ...props
}: LinkProps<T>) {
  const Tag = (as ?? 'loom-link') as ElementType;
  return (
    <Tag
      color={color}
      underline={underline}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
