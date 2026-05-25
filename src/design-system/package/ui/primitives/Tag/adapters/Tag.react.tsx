import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/16/solid';
import * as styles from '../Tag.css.ts';
import type { TagProps, TagValue } from '../Tag.types.ts';

const ICON_MAP: Record<TagValue, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  positive: ArrowTrendingUpIcon,
  negative: ArrowTrendingDownIcon,
  neutral: MinusIcon,
};

export function Tag({ value = 'positive', label, showIcon = true, className, ...props }: TagProps) {
  const IconComponent = ICON_MAP[value];
  return (
    <span
      className={[styles.root, styles.value[value], className].filter(Boolean).join(' ')}
      {...props}
    >
      {showIcon && (
        <span className={styles.iconWrapper} aria-hidden="true">
          <IconComponent width={16} height={16} />
        </span>
      )}
      {label != null && <span>{label}</span>}
    </span>
  );
}
