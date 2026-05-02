/**
 * scm-input — React twin
 */

import { useState } from 'react';

export default function Input({
  size,                 // 'sm' | undefined
  className = '',
  ...rest
}) {
  const cls = [
    'scm-input',
    size === 'sm' && 'scm-input--sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <input className={cls} {...rest} />;
}

export function InputWithCounter({
  size,
  maxLength,
  defaultValue = '',
  value: controlledValue,
  onChange,
  className = '',
  wrapClassName = '',
  ...rest
}) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internal;

  function handleChange(e) {
    if (controlledValue === undefined) setInternal(e.target.value);
    if (onChange) onChange(e);
  }

  const wrapCls = [
    'scm-input-wrap',
    'scm-input-wrap--with-counter',
    wrapClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapCls}>
      <Input size={size} maxLength={maxLength} value={value} onChange={handleChange} className={className} {...rest} />
      <span className="scm-input-counter">
        {value.length}{maxLength ? ` / ${maxLength}` : ''}
      </span>
    </div>
  );
}
