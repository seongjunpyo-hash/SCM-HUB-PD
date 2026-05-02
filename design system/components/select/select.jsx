/**
 * scm-select — React twin (트리거)
 *
 * 드롭다운 popup 은 호출처에서 별도 컴포넌트로 부착.
 */

const ChevronDown = (
  <svg className="scm-select__chev" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Select({
  value,                  // string | undefined
  placeholder = '선택하세요',
  size,                   // 'sm' | 'bu' | undefined
  disabled = false,
  expanded = false,
  dotVariant,             // 'accent' | 'success' | 'disabled' | undefined (앞 도트)
  className = '',
  onClick,
  ...rest
}) {
  const cls = [
    'scm-select',
    size && `scm-select--${size}`,
    disabled && 'is-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const state = value ? 'filled' : 'placeholder';
  const display = value || placeholder;

  return (
    <button
      type="button"
      className={cls}
      data-state={state}
      aria-expanded={expanded}
      aria-haspopup="listbox"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {dotVariant && <span className={`scm-select__dot scm-select__dot--${dotVariant}`} />}
      <span className="scm-select__value">{display}</span>
      {ChevronDown}
    </button>
  );
}
