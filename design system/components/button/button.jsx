/**
 * scm-button — React twin
 */

export default function Button({
  variant,                  // 'primary' | 'ghost' | undefined (default outlined)
  size,                     // 'sm' | 'lg' | undefined (default md)
  block = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'scm-button',
    variant && `scm-button--${variant}`,
    size && `scm-button--${size}`,
    block && 'scm-button--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
