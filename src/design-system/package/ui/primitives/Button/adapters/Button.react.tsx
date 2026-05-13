import type { ElementType } from 'react';
import * as styles from '../Button.css.ts';
import type { ButtonProps, ButtonSize } from '../Button.types.ts';
import { Text } from '../../Text/index.ts';
import type { TextVariant } from '../../Text/index.ts';

const labelVariant: Record<ButtonSize, TextVariant> = {
  sm: 'label-sm',
  md: 'label-md',
  lg: 'label-lg',
};

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
      <Text as="span" variant={labelVariant[size]}>
        {children}
      </Text>
    </Tag>
  );
}
