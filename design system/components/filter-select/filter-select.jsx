/**
 * scm-filter-select — React twin
 */

const ChevDown = (
  <svg className="scm-filter-select__chev" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FilterSelect({
  label,
  value,
  required = false,
  expanded = false,
  state,                    // 'placeholder' | 'filled' | 'active' (자동 추론)
  onClick,
  filterKey,                // data-mp-filter 같은 식별자 → data-filter-key
  className = '',
}) {
  const computedState = state || (value ? 'filled' : 'placeholder');
  const display = value || label || '선택';

  return (
    <button
      type="button"
      className={['scm-filter-select', className].filter(Boolean).join(' ')}
      data-state={computedState}
      aria-expanded={expanded}
      aria-haspopup="listbox"
      data-filter-key={filterKey}
      onClick={onClick}
    >
      <span className="scm-filter-select__label">
        {label}
        {required && <span className="scm-filter-select__req-dot" />}
      </span>
      <span className="scm-filter-select__value">{display}</span>
      {ChevDown}
    </button>
  );
}

export function FilterGroup({ children, className = '', ...rest }) {
  return (
    <span className={['scm-filter-group', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
