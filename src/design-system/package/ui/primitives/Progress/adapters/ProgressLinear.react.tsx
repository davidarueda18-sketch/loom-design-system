import './ProgressLinear.element.ts';
import type { ElementType } from 'react';
import type { ProgressLinearProps } from '../Progress.types.ts';

export function ProgressLinear({
  value,
  max           = 100,
  indeterminate,
  thickness     = 'sm',
  color         = 'brandAccent',
  shape         = 'flat',
  label,
  showValue     = false,
  className,
  style,
  ...props
}: ProgressLinearProps) {
  const Tag = 'loom-progress-linear' as ElementType;

  return (
    <Tag
      value={value}
      max={max}
      indeterminate={indeterminate || undefined}
      thickness={thickness}
      color={color}
      shape={shape}
      label={label}
      show-value={showValue || undefined}
      className={className}
      style={style}
      {...(props as object)}
    />
  );
}
