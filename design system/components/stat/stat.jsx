/**
 * scm-stat — React twin
 */

export default function Stat({
  variant,                  // 'all' | 'deployed' | 'undeployed' | 'selected'
  label,
  count,
  onClick,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-stat',
    variant && `scm-stat--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} onClick={onClick} {...rest}>
      <span className="scm-stat__label">{label}</span>
      <span className="scm-stat__num">{count}</span>
    </span>
  );
}

export function StatDivider({ className = '', ...rest }) {
  return <span className={['scm-stat-divider', className].filter(Boolean).join(' ')} {...rest} />;
}
