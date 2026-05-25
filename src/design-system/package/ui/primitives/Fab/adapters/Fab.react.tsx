import './Fab.element.ts';
import type { ElementType } from 'react';
import type { FabProps } from '../Fab.types.ts';

export function Fab<T extends ElementType = 'button'>({
  as: _as,
  size = 'md',
  content = 'icon',
  label,
  icon,
  disabled,
  className,
  ...props
}: FabProps<T>) {
  void _as;
  const Tag = 'loom-fab' as ElementType;
  return (
    <Tag
      size={size}
      content={content}
      label={label}
      disabled={disabled}
      className={className}
      {...(props as object)}
    >
      {content === 'icon' ? icon : null}
    </Tag>
  );
}
