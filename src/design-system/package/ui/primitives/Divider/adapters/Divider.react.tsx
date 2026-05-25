import './Divider.element.ts';
import type { ElementType } from 'react';
import type { DividerProps } from '../Divider.types.ts';

export function Divider({
  orientation    = 'horizontal',
  label,
  labelPosition  = 'center',
  color          = 'borderDefault',
  thickness      = 'thin',
  lineStyle      = 'solid',
  className,
  style,
  ...props
}: DividerProps) {
  const Tag = 'loom-divider' as ElementType;

  return (
    <Tag
      orientation={orientation}
      label={label}
      label-position={labelPosition}
      color={color}
      thickness={thickness}
      line-style={lineStyle}
      className={className}
      style={style}
      {...(props as object)}
    />
  );
}
