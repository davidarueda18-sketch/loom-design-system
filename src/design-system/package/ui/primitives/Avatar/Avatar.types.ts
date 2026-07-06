import type { ComponentPropsWithoutRef } from 'react';

export const AVATAR_SIZES = ['sm', 'md', 'lg'] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];

export interface AvatarOwnProps {
  name?: string;
  email?: string;
  photoUrl?: string;
  size?: AvatarSize;
}
export type AvatarProps = AvatarOwnProps &
  Omit<ComponentPropsWithoutRef<'span'>, keyof AvatarOwnProps>;

export interface AvatarGroupOwnProps {
  max?: number;
  size?: AvatarSize;
}
export type AvatarGroupProps = AvatarGroupOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof AvatarGroupOwnProps>;
