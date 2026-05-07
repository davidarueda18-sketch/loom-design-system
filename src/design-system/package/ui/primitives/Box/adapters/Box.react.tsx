import type { CSSProperties, ElementType } from 'react';
import * as styles from '../Box.css.ts';
import type { BoxProps } from '../Box.types.ts';
import { spacingVars } from '../../../../tokens/index.ts';

export function Box<T extends ElementType = 'div'>({
  as,
  padding,
  paddingX,
  paddingY,
  children,
  className,
  style,
  ...props
}: BoxProps<T>) {
  const Tag = (as ?? 'div') as ElementType;

  const paddingStyle: CSSProperties = {
    ...(padding  && { padding:       spacingVars[padding] }),
    ...(paddingX && { paddingInline: spacingVars[paddingX] }),
    ...(paddingY && { paddingBlock:  spacingVars[paddingY] }),
  };

  return (
    <Tag
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ ...paddingStyle, ...style }}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
