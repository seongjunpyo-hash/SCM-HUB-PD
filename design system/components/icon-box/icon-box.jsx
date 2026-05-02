/**
 * scm-icon-box — React twin
 */

export default function IconBox({
  color,        // 'blue' | 'green' | 'orange' | 'red' | undefined
  size,         // 'sm' | undefined
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-icon-box',
    color && `scm-icon-box--${color}`,
    size && `scm-icon-box--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={cls} {...rest}>{children}</span>;
}
