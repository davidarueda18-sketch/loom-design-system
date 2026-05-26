import './IconButton.element.ts';
import type { IconButtonProps } from '../IconButton.types.ts';

export function IconButton({
  variant = 'filled',
  size = 'md',
  disabled,
  selected,
  'aria-label': ariaLabel,
  children,
  ...props
}: IconButtonProps) {
  return (
    <loom-icon-button
      variant={variant}
      size={size}
      disabled={disabled || undefined}
      selected={selected || undefined}
      aria-label={ariaLabel}
      {...(props as object)}
    >
      {children}
    </loom-icon-button>
  );
}
