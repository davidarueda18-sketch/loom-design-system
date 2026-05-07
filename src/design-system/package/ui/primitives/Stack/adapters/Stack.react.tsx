import type { ElementType } from 'react';
import * as styles from '../Stack.css.ts';
import type { StackProps } from '../Stack.types.ts';

export function Stack<T extends ElementType = 'div'>({
  as,
  gap,
  align = 'stretch',
  justify = 'start',
  children,
  className,
  ...props
}: StackProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={[
        styles.root,
        gap !== undefined ? styles.gap[gap] : undefined,
        styles.align[align],
        styles.justify[justify],
        className,
      ].filter(Boolean).join(' ')}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
