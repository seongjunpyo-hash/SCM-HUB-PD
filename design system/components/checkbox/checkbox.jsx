/**
 * scm-checkbox — React twin
 *
 * div/span 기반 (HTML input 사용 안 함). aria-checked 로 상태 표현.
 */

export default function Checkbox({
  checked = false,            // boolean | 'mixed'
  disabled = false,
  onChange,
  ariaLabel = '선택',
  className = '',
  ...rest
}) {
  const cls = [
    'scm-checkbox',
    disabled && 'is-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaChecked = checked === 'mixed' ? 'mixed' : (checked ? 'true' : 'false');

  function handleClick(e) {
    if (disabled || !onChange) return;
    e.preventDefault();
    onChange(checked === true ? false : true);
  }

  function handleKeyDown(e) {
    if (disabled || !onChange) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(checked === true ? false : true);
    }
  }

  return (
    <span
      className={cls}
      role="checkbox"
      aria-checked={ariaChecked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}
