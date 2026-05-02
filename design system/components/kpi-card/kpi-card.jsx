/**
 * scm-kpi-card — React twin
 */

export default function KpiCard({
  label,
  value,
  iconNode,                 // ReactNode (scm-icon-box ...)
  delta,                    // number (positive = up, negative = down)
  deltaText,                // string ('vs 지난 주')
  className = '',
}) {
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : null;
  return (
    <div className={['scm-kpi-card', className].filter(Boolean).join(' ')}>
      <div className="scm-kpi-card__head">
        <span className="scm-kpi-card__label">{label}</span>
        {iconNode}
      </div>
      <div className="scm-kpi-card__body">
        <div className="scm-kpi-card__value">{value}</div>
        {(direction || deltaText) && (
          <div className="scm-kpi-card__meta">
            {direction && (
              <span className={`scm-kpi-card__delta scm-kpi-card__delta--${direction}`}>
                {direction === 'up' ? '▲' : '▼'} {Math.abs(delta)}%
              </span>
            )}
            {deltaText && <span className="scm-kpi-card__meta-text">{deltaText}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
