import type { ElementType } from 'react';
import * as styles from '../Inline.css.ts';
import type { InlineProps } from '../Inline.types.ts';

export function Inline<T extends ElementType = 'div'>({
  as,
  gap,
  align = 'center',
  justify = 'start',
  wrap = false,
  children,
  className,
  ...props
}: InlineProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={[
        styles.root,
        wrap ? styles.wrap : undefined,
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
