/**
 * scm-filter-chip — React twin
 */

const FilterIcon = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

export default function FilterChip({
  count,
  onClick,
  label = '전체 필터',
  className = '',
}) {
  return (
    <button
      type="button"
      className={['scm-filter-chip', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {FilterIcon}
      <span>{label}</span>
      {count > 0 && <span className="scm-filter-chip__count">{count}</span>}
    </button>
  );
}
