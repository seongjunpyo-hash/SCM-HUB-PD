/**
 * scm-platform-tag — React twin
 */

export default function PlatformTag({
  color,                  // 'blue' | 'yellow' | 'gray'
  children,
  className = '',
  ...rest
}) {
  return (
    <span
      className={['scm-platform-tag', className].filter(Boolean).join(' ')}
      data-color={color}
      {...rest}
    >
      {children}
    </span>
  );
}
