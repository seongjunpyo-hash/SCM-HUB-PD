/**
 * scm-radio — React twin
 */

export function Radio({
  size,                 // 'sm' | undefined
  disabled = false,
  className = '',
  children,
  ...rest               // input props (name, value, checked, onChange, ...)
}) {
  const cls = [
    'scm-radio',
    size === 'sm' && 'scm-radio--sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={cls} aria-disabled={disabled || undefined}>
      <input type="radio" disabled={disabled} {...rest} />
      <span className="scm-radio-dot" />
      <span>{children}</span>
    </label>
  );
}

export function RadioGroup({
  size,                 // 'sm' | undefined
  layout,               // '2col' | undefined
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'scm-radio-group',
    size === 'sm' && 'scm-radio-group--sm',
    layout === '2col' && 'scm-radio-group--2col',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} role="radiogroup" {...rest}>
      {children}
    </div>
  );
}

export default Radio;
