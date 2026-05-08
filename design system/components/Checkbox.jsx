/**
 * Layer Desktop — Checkbox / Radio / Switch
 * --------------------------------------------------------------
 * Figma nodes:
 *   - 318:16098 / 174:2202 (CheckboxGroup matrix)
 *   - 174:2 (RadioGroup matrix)
 *   - 180:2203 / 762:3997 (Switch / SwitchWithLabel matrix)
 *
 * Single:
 *   <Checkbox checked={c} onChange={e => setC(e.target.checked)} label="동의합니다" />
 *
 * Group:
 *   <CheckboxGroup
 *     label="추가 선택"
 *     direction="vertical"
 *     value={values}
 *     onChange={setValues}
 *     options={[
 *       { value: 'a', label: '에그가슴(+1,500원)' },
 *       { value: 'b', label: '베이컨(+900원)' },
 *       { value: 'c', label: '베이컨(+900원)', disabled: true },
 *     ]}
 *   />
 */
import React from 'react';

// ============================================================
// Checkbox
// ============================================================
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  helper,
  invalid = false,
  className = '',
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const isChecked = isControlled ? checked : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'flex-start', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--ld-fg-disabled)' : 'var(--ld-fg)',
        fontSize: 14, lineHeight: 1.4,
      }}
    >
      <span
        className="ld-control"
        data-checked={isChecked || undefined}
        data-disabled={disabled || undefined}
        aria-hidden
        style={{
          marginTop: 2,
          borderColor: invalid ? 'var(--ld-fg-critical)' : undefined,
        }}
      >
        {isChecked ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : null}
      </span>
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        {...rest}
      />
      {label || helper ? (
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
          {label ? <span>{label}</span> : null}
          {helper ? <span style={{ fontSize: 13, color: 'var(--ld-fg-low)' }}>{helper}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

// ============================================================
// CheckboxGroup
// ============================================================
export function CheckboxGroup({
  options = [],
  value = [],
  onChange,
  label,
  helper,
  direction = 'vertical',  // vertical | horizontal
  size = 'md',
  required = false,
  optional = false,
  disabled = false,
  className = '',
}) {
  const handleToggle = (val) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];
    onChange?.(next);
  };
  return (
    <fieldset className={`ld-field ${className}`} style={{ border: 0, padding: 0, margin: 0 }} disabled={disabled}>
      {label ? (
        <legend className="ld-field-label" style={{ padding: 0 }}>
          {label}
          {required ? <span className="ld-field-required">*</span> : null}
          {optional ? <span className="ld-field-optional">(선택)</span> : null}
        </legend>
      ) : null}
      <div style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: direction === 'horizontal' ? 16 : 8,
        flexWrap: 'wrap',
      }}>
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={value.includes(opt.value)}
            disabled={opt.disabled || disabled}
            label={opt.label}
            helper={opt.helper}
            onChange={() => handleToggle(opt.value)}
          />
        ))}
      </div>
      {helper ? <p className="ld-helper">{helper}</p> : null}
    </fieldset>
  );
}

// ============================================================
// Radio
// ============================================================
export function Radio({ checked, name, value, onChange, disabled = false, label, helper, className = '', ...rest }) {
  return (
    <label
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'flex-start', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--ld-fg-disabled)' : 'var(--ld-fg)',
        fontSize: 14, lineHeight: 1.4,
      }}
    >
      <span
        className="ld-control"
        data-radio="true"
        data-checked={checked || undefined}
        data-disabled={disabled || undefined}
        aria-hidden
        style={{ marginTop: 2 }}
      >
        {checked ? (
          <span style={{ width: 8, height: 8, background: 'var(--ld-ctrl-indicator-bg-checked)', borderRadius: '50%' }} />
        ) : null}
      </span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        {...rest}
      />
      {label || helper ? (
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
          {label ? <span>{label}</span> : null}
          {helper ? <span style={{ fontSize: 13, color: 'var(--ld-fg-low)' }}>{helper}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

// ============================================================
// RadioGroup
// ============================================================
export function RadioGroup({
  options = [],
  value,
  onChange,
  name,
  label,
  helper,
  direction = 'vertical',
  required = false,
  optional = false,
  disabled = false,
  className = '',
}) {
  const groupName = React.useId();
  return (
    <fieldset className={`ld-field ${className}`} style={{ border: 0, padding: 0, margin: 0 }} disabled={disabled}>
      {label ? (
        <legend className="ld-field-label" style={{ padding: 0 }}>
          {label}
          {required ? <span className="ld-field-required">*</span> : null}
          {optional ? <span className="ld-field-optional">(선택)</span> : null}
        </legend>
      ) : null}
      <div style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: direction === 'horizontal' ? 16 : 8,
        flexWrap: 'wrap',
      }}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name || groupName}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled || disabled}
            label={opt.label}
            helper={opt.helper}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>
      {helper ? <p className="ld-helper">{helper}</p> : null}
    </fieldset>
  );
}

// ============================================================
// Switch
// ============================================================
export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  helper,
  className = '',
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const isOn = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'flex-start', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14, lineHeight: 1.4,
      }}
    >
      <button
        type="button"
        role="switch"
        className="ld-switch"
        aria-checked={isOn}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={toggle}
        {...rest}
      />
      {label || helper ? (
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
          {label ? <span style={{ color: disabled ? 'var(--ld-fg-disabled)' : 'var(--ld-fg)' }}>{label}</span> : null}
          {helper ? <span style={{ fontSize: 13, color: 'var(--ld-fg-low)' }}>{helper}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

export default Checkbox;
