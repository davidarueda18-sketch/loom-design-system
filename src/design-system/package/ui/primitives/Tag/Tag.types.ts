import type { ComponentPropsWithoutRef } from 'react';

export const TAG_VALUES = ['positive', 'negative', 'neutral'] as const;
export type TagValue = (typeof TAG_VALUES)[number];

export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  value?: TagValue;
  label?: string;
  showIcon?: boolean;
}
