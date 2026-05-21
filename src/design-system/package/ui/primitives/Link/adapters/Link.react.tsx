import type { ElementType } from 'react';
import * as styles from '../Link.css.ts';
import type { LinkProps } from '../Link.types.ts';

export function Link<T extends ElementType = 'a'>({
  as,
  color = 'default',
  underline = 'always',
  children,
  className,
  ...props
}: LinkProps<T>) {
  const Tag = (as ?? 'a') as ElementType;
  return (
    <Tag
      className={[styles.root, styles.color[color], styles.underline[underline], className]
        .filter(Boolean)
        .join(' ')}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
