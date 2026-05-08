/**
 * scm-status-chip — React twin
 */
export default function StatusChip({ variant, children, className = '', ...rest }) {
  const cls = ['scm-status-chip', variant && `scm-status-chip--${variant}`, className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
