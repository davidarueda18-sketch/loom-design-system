import type { ElementType } from 'react';
import * as styles from '../Button.css.ts';
import type { ButtonProps } from '../Button.types.ts';

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps<T>) {
  const Tag = (as ?? 'button') as ElementType;
  return (
    <Tag
      className={[styles.root, styles.variant[variant], styles.size[size], className]
        .filter(Boolean)
        .join(' ')}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
