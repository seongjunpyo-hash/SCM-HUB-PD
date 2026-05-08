/**
 * scm-toggle — React twin
 *
 * controlled: checked + onChange 사용. 항상 div 기반 (input 사용 안 함).
 */

export default function Toggle({
  checked = false,
  disabled = false,
  size,                 // 'sm' | undefined
  onChange,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-toggle',
    size === 'sm' && 'scm-toggle--sm',
    checked && 'is-on',
    disabled && 'is-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function handleClick() {
    if (disabled || !onChange) return;
    onChange(!checked);
  }

  return (
    <span
      className={cls}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      {...rest}
    >
      <span className="scm-toggle-track" />
      <span className="scm-toggle-knob" />
    </span>
  );
}

export function ToggleCell({ checked, onChange, label, labelOff, disabled, ...rest }) {
  const showLabel = checked ? (label || '전개') : (labelOff || '미전개');
  return (
    <span className="scm-toggle-cell">
      <Toggle checked={checked} onChange={onChange} disabled={disabled} {...rest} />
      <span className={['scm-toggle-label', !checked && 'is-off'].filter(Boolean).join(' ')}>
        {showLabel}
      </span>
    </span>
  );
}
