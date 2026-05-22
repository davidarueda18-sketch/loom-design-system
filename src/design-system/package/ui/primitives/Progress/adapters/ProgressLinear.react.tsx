import * as styles from '../ProgressLinear.css.ts';
import type { ProgressLinearProps } from '../Progress.types.ts';

/** Clamps `n` into `[min, max]`. */
function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function ProgressLinear({
  value,
  max           = 100,
  indeterminate,
  thickness     = 'sm',
  color         = 'brandAccent',
  shape         = 'flat',
  label,
  showValue     = false,
  className,
  style,
  ...props
}: ProgressLinearProps) {
  const isIndeterminate = indeterminate === true || value === undefined;
  const ratio   = isIndeterminate ? 0 : clamp(value! / max, 0, 1);
  const percent = Math.round(ratio * 100);
  const waveClass = shape === 'wave' ? styles.wave[thickness] : null;

  const trackClass = [
    styles.trackBg[thickness],
    waveClass,
  ].filter(Boolean).join(' ');

  const activeClass = [
    styles.active[thickness],
    isIndeterminate ? styles.indeterminate[thickness] : null,
    waveClass,
  ].filter(Boolean).join(' ');

  const activeStyle = isIndeterminate ? undefined : { width: `${ratio * 100}%` };

  const showCaption = Boolean(label) || (showValue && !isIndeterminate);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : Math.round(ratio * max)}
      aria-busy={isIndeterminate || undefined}
      aria-label={label || undefined}
      className={[styles.root, styles.colors[color], className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      <div className={styles.trackHost}>
        <div className={trackClass} aria-hidden="true" />
        <div
          className={activeClass}
          style={activeStyle}
          aria-hidden="true"
        />
        <div className={styles.stop[thickness]} aria-hidden="true" />
      </div>
      {showCaption && (
        <div className={styles.labelRow}>
          {label && <span className={styles.labelText}>{label}</span>}
          {showValue && !isIndeterminate && (
            <span className={styles.labelValue}>{percent}%</span>
          )}
        </div>
      )}
    </div>
  );
}
