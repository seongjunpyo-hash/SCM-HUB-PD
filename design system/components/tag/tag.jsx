/**
 * scm-tag — React twin
 */

export default function Tag({
  variant,        // 'blue' | 'green' | 'gray' | undefined
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-tag',
    variant && `scm-tag--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={cls} {...rest}>{children}</span>;
}

export function TagStack({ children, className = '', ...rest }) {
  return (
    <span className={['scm-tag-stack', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
