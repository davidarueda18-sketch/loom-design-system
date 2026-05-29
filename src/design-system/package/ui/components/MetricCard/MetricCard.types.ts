import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface MetricCardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: string;
  metric?: string;
  description?: string;
  children?: ReactNode;
}
