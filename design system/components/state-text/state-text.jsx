/**
 * scm-state-text — React twin
 */

export default function StateText({
  variant,                   // 'accent' | 'critical' | undefined
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-state-text',
    variant && `scm-state-text--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={cls} {...rest}>{children}</span>;
}
