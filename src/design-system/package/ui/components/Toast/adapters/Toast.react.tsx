import './Toast.element.ts';
import type { ElementType } from 'react';
import type { ToastProps } from '../Toast.types.ts';

export function Toast({
  type = 'info',
  title,
  description,
  dismissible = true,
  'action-label': actionLabel,
  duration = 0,
  position,
  className,
  ...props
}: ToastProps) {
  const ToastElement = 'loom-toast' as ElementType;
  return (
    <ToastElement
      type={type}
      title={title}
      description={description}
      dismissible={dismissible}
      action-label={actionLabel}
      duration={duration}
      position={position}
      className={className}
      {...(props as object)}
    />
  );
}
