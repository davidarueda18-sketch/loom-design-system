import './Card.element.ts';
import type { ElementType } from 'react';
import type { CardProps } from '../Card.types.ts';

export function Card({ variant, title, description, className, children, ...props }: CardProps) {
  const CardElement = 'loom-card' as ElementType;
  return (
    <CardElement
      variant={variant}
      title={title}
      description={description}
      className={className}
      {...(props as object)}
    >
      {children}
    </CardElement>
  );
}
