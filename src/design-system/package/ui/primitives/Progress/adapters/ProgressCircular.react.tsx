import * as styles from '../ProgressCircular.css.ts';
import type { ProgressCircularProps } from '../Progress.types.ts';

/** Clamps `n` into `[min, max]`. */
function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// SVG geometry — viewBox is fixed; visual size scales via CSS width/height on the root.
const VIEWBOX = 44;
const CENTER  = VIEWBOX / 2;
const RADIUS  = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
  const isIndeterminate = indeterminate === true || value === undefined;
  const ratio   = isIndeterminate ? 0 : clamp(value! / max, 0, 1);
  const percent = Math.round(ratio * 100);

  const captionText =
    showValue && !isIndeterminate ? `${percent}%` : (label ?? '');

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : Math.round(ratio * max)}
      aria-busy={isIndeterminate || undefined}
      aria-label={label || undefined}
      className={[styles.root, styles.sizes[size], styles.colors[color], className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className={[styles.svg, isIndeterminate ? styles.svgIndeterminate : null].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          className={[styles.track, styles.thickness[thickness]].join(' ')}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          className={[
            styles.active,
            styles.thickness[thickness],
            isIndeterminate ? styles.activeIndeterminate : null,
          ].filter(Boolean).join(' ')}
          strokeDasharray={isIndeterminate ? undefined : CIRCUMFERENCE}
          strokeDashoffset={isIndeterminate ? undefined : CIRCUMFERENCE * (1 - ratio)}
          transform={isIndeterminate ? undefined : `rotate(-90 ${CENTER} ${CENTER})`}
        />
      </svg>
      {captionText && <span className={styles.label}>{captionText}</span>}
    </div>
  );
}
