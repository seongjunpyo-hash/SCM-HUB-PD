/**
 * scm-filter-reset-btn — React twin
 */

const ResetIcon = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M4 4V8H8M16 16V12H12M4 8C4.5 6 7 3 10 3C13 3 16 5 16 9M16 12C15.5 14 13 17 10 17C7 17 4 15 4 11"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function FilterResetButton({
  hidden = false,
  onClick,
  className = '',
  label = '초기화',
  ...rest
}) {
  const cls = ['scm-filter-reset-btn', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} hidden={hidden} onClick={onClick} {...rest}>
      {ResetIcon}
      <span>{label}</span>
    </button>
  );
}
