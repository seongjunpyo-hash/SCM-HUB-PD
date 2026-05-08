/**
 * scm-pending-stats — React twin
 */

export default function PendingStats({ children, className = '', ...rest }) {
  return (
    <div className={['scm-pending-stats', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function PendingStat({ variant, label, count, children, className = '' }) {
  const cls = ['scm-pending-stats__stat', variant && `scm-pending-stats__stat--${variant}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      {children}
      <span>{label}</span>
      <span className="scm-pending-stats__stat-num">{count}</span>
    </span>
  );
}
