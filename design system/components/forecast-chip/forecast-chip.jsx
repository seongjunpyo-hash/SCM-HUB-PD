/**
 * scm-forecast-chip — React twin
 */

export default function ForecastChip({ variant, children, className = '', ...rest }) {
  const cls = [
    'scm-forecast-chip',
    variant && `scm-forecast-chip--${variant}`,
    className,
  ].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
