import './Tag.element.ts';
import type { ElementType } from 'react';
import type { TagProps } from '../Tag.types.ts';

export function Tag({ value = 'positive', label, showIcon = true, className, ...props }: TagProps) {
  const TagElement = 'loom-tag' as ElementType;
  return (
    <TagElement
      value={value}
      label={label}
      show-icon={String(showIcon)}
      className={className}
      {...(props as object)}
    />
  );
}
