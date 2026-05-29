import './MetricCard.element.ts';
import type { ElementType } from 'react';
import type { MetricCardProps } from '../MetricCard.types.ts';

export function MetricCard({ title, metric, description, className, children, ...props }: MetricCardProps) {
  const MetricCardElement = 'loom-metric-card' as ElementType;
  return (
    <MetricCardElement
      title={title}
      metric={metric}
      description={description}
      className={className}
      {...(props as object)}
    >
      {children}
    </MetricCardElement>
  );
}
