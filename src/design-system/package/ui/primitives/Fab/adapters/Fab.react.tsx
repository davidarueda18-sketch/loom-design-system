import type { ElementType } from 'react';
import * as styles from '../Fab.css.ts';
import type { FabProps } from '../Fab.types.ts';

export function Fab<T extends ElementType = 'button'>({
  as,
  size = 'md',
  content = 'icon',
  label,
  icon,
  disabled,
  className,
  ...props
}: FabProps<T>) {
  const Tag = (as ?? 'button') as ElementType;
  return (
    <Tag
      aria-label={content === 'icon' ? label : undefined}
      disabled={disabled}
      className={[styles.root, styles.size[size], className]
        .filter(Boolean)
        .join(' ')}
      {...(props as object)}
    >
      {content === 'icon' ? (
        <span aria-hidden="true">{icon}</span>
      ) : (
        <span className={styles.textLabel[size]}>{label}</span>
      )}
    </Tag>
  );
}
