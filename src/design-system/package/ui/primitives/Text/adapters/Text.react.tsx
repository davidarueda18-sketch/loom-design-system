import type { ElementType } from 'react';
import * as styles from '../Text.css.ts';
import type { TextProps } from '../Text.types.ts';

export function Text<T extends ElementType = 'p'>({
  as,
  variant,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Tag = (as ?? 'p') as ElementType;

  return (
    <Tag
      className={[styles.variants[variant], className].filter(Boolean).join(' ')}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
