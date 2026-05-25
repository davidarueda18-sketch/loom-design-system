import './ProgressCircular.element.ts';
import type { ElementType } from 'react';
import type { ProgressCircularProps } from '../Progress.types.ts';

export function ProgressCircular({
  value,
  max           = 100,
  indeterminate,
  thickness     = 'sm',
  size          = 'md',
  color         = 'brandAccent',
  label,
  showValue     = false,
  className,
  style,
  ...props
}: ProgressCircularProps) {
  const Tag = 'loom-progress-circular' as ElementType;

  return (
    <Tag
      value={value}
      max={max}
      indeterminate={indeterminate || undefined}
      thickness={thickness}
      size={size}
      color={color}
      label={label}
      show-value={showValue || undefined}
      className={className}
      style={style}
      {...(props as object)}
    />
  );
}
