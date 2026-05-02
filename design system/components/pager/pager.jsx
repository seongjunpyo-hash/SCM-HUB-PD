/**
 * scm-pager — React twin
 */

const ChevLeft = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const ChevRight = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function Pager({
  current = 1,
  total = 1,
  onChange,
  className = '',
}) {
  function go(n) {
    if (n < 1 || n > total) return;
    if (onChange) onChange(n);
  }
  return (
    <span className={['scm-pager', className].filter(Boolean).join(' ')}>
      <strong className="scm-pager__current">{current}</strong>
      <span className="scm-pager__total">/ <span>{total}</span> 페이지</span>
      <button
        type="button"
        className="scm-pager-btn"
        aria-label="이전 페이지"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
      >
        {ChevLeft}
      </button>
      <button
        type="button"
        className="scm-pager-btn"
        aria-label="다음 페이지"
        disabled={current >= total}
        onClick={() => go(current + 1)}
      >
        {ChevRight}
      </button>
    </span>
  );
}
