import type { ElementType } from 'react';
import * as styles from '../Icon.css.ts';
import type { IconProps } from '../Icon.types.ts';
import { colorVars } from '../../../../tokens/index.ts';

export function Icon<T extends ElementType = 'span'>({
  as,
  size = 'md',
  color,
  label,
  children,
  className,
  style,
  ...props
}: IconProps<T>) {
  const Tag = (as ?? 'span') as ElementType;
  const a11y = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true };

  const mergedStyle = color
    ? { color: colorVars[color], ...style }
    : style;

  return (
    <Tag
      {...a11y}
      className={[styles.root, styles.size[size], className]
        .filter(Boolean)
        .join(' ')}
      style={mergedStyle}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
