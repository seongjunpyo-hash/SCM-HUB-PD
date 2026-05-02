/**
 * scm-form-row — React twin
 */

export default function FormRow({ children, className = '', ...rest }) {
  return (
    <div className={['scm-form-row', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function FormLabel({
  width,                  // 60 | 120 | 140 | undefined
  required = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-form-label',
    width && `scm-form-label--w${width}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <label className={cls} {...rest}>
      {children}
      {required && <span className="scm-form-row-req" />}
    </label>
  );
}

export function FormControl({
  width,                  // 320 | 360 | 'full' | undefined
  children,
  className = '',
  ...rest
}) {
  const widthClass = width === 'full'
    ? 'scm-form-control--full'
    : width
      ? `scm-form-control--w${width}`
      : null;
  const cls = ['scm-form-control', widthClass, className].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}
