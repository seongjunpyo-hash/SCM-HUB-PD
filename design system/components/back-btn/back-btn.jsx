/**
 * scm-back-btn — React twin
 */

const ArrowLeft = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BackButton({
  onClick,
  ariaLabel = '뒤로',
  className = '',
  ...rest
}) {
  const cls = ['scm-back-btn', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-label={ariaLabel} onClick={onClick} {...rest}>
      {ArrowLeft}
    </button>
  );
}
