/**
 * scm-kind-chip — React twin
 */
export default function KindChip({ variant, children, className = '', ...rest }) {
  const cls = ['scm-kind-chip', variant && `scm-kind-chip--${variant}`, className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
