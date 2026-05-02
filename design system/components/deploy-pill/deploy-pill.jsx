/**
 * scm-deploy-pill — React twin
 */

const ChevDown = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DEFAULT_LABEL = {
  deployed: '전개중',
  undeployed: '미전개',
  partial: '일부 전개',
};

export default function DeployPill({
  state = 'undeployed',
  label,
  onChevClick,
  ariaLabel = '스토어 전개 여부 변경',
  className = '',
}) {
  const cls = [
    'scm-deploy-pill',
    `scm-deploy-pill--${state}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <span className="scm-deploy-pill__pill">
        <span className="scm-deploy-pill__dot" />
        {label || DEFAULT_LABEL[state] || ''}
      </span>
      <button
        type="button"
        className="scm-deploy-pill__chev"
        aria-label={ariaLabel}
        onClick={(e) => { e.stopPropagation(); if (onChevClick) onChevClick(e); }}
      >
        {ChevDown}
      </button>
    </div>
  );
}
