import * as styles from '../Divider.css.ts';
import type { DividerProps } from '../Divider.types.ts';

export function Divider({
  orientation    = 'horizontal',
  label,
  labelPosition  = 'center',
  color          = 'borderDefault',
  thickness      = 'thin',
  lineStyle      = 'solid',
  className,
  style,
  ...props
}: DividerProps) {
  const isVertical = orientation === 'vertical';
  const hasLabel   = Boolean(label);

  const thicknessClass = isVertical ? styles.thicknessV[thickness] : styles.thicknessH[thickness];
  const lineStyleClass = isVertical ? styles.lineStyleV[lineStyle]  : styles.lineStyleH[lineStyle];

  const lineClasses = [styles.line, thicknessClass, lineStyleClass].join(' ');

  const startSize = (hasLabel && labelPosition === 'start') ? 'fixed' : 'grow';
  const endSize   = (hasLabel && labelPosition === 'end')   ? 'fixed' : 'grow';

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label || undefined}
      className={[
        styles.root,
        styles.orientations[orientation],
        styles.colors[color],
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      <span className={`${lineClasses} ${styles.lineSize[startSize]}`} aria-hidden="true" />
      {hasLabel && (
        <>
          <span className={[styles.label, isVertical && styles.labelVertical].filter(Boolean).join(' ')}>
            {label}
          </span>
          <span className={`${lineClasses} ${styles.lineSize[endSize]}`} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
