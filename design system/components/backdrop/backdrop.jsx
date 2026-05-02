/**
 * scm-backdrop — React twin
 *
 * 동일 className / DOM 구조 / 상태 클래스 (is-open). vanilla 와 1:1 매핑.
 */

export default function Backdrop({
  open = false,
  transparent = false,
  zIndex,
  onClick,
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'scm-backdrop',
    transparent && 'scm-backdrop--transparent',
    open && 'is-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const finalStyle = zIndex != null
    ? { ...style, '--scm-backdrop-z': zIndex }
    : style;

  return <div className={cls} style={finalStyle} onClick={onClick} {...rest} />;
}
