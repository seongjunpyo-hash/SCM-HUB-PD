/**
 * Layer Desktop — TextField / SearchField / TextArea
 * --------------------------------------------------------------
 * Figma nodes: 7957:422 (textField), 411:15311(select page also has tf), 8299:520 (searchField), 2250:10466 (textArea)
 *
 * size: sm(32) | md(40) | lg(44)
 * 상태: default / hover / active(focus) / disabled / invalid
 * 옵션: leftIcon, rightIcon, clearable, counter(maxLength), prefix/suffix 텍스트
 *
 * Usage:
 *   <TextField placeholder="검색어 입력" />
 *   <TextField leftIcon={<SearchIcon/>} clearable defaultValue="ABC" />
 *   <TextField invalid maxLength={20} value={v} onChange={e => setV(e.target.value)} />
 *
 *   <SearchField placeholder="SKU 검색" onSearch={(q) => fetch(q)} />
 *
 *   <TextArea rows={4} maxLength={500} />
 */
import React, { useState, useRef } from 'react';

const SIZE_CLASS = {
  sm: 'ld-tf-sm',
  md: '',
  lg: 'ld-tf-lg',
};

// ============================================================
// TextField
// ============================================================
export function TextField({
  size = 'md',
  type = 'text',
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  clearable = false,
  counter = false,
  maxLength,
  invalid = false,
  className = '',
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  ...rest
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const inputRef = useRef(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.({ target: { value: '' } });
    inputRef.current?.focus();
  };

  const wrapperCls = ['ld-tf', SIZE_CLASS[size] || '', className].filter(Boolean).join(' ');
  const showCounter = counter && typeof maxLength === 'number';

  return (
    <div
      className={wrapperCls}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
    >
      {leftIcon ? (
        <span aria-hidden style={{ display: 'inline-flex', color: 'var(--ld-fg-lower)', flexShrink: 0 }}>
          {leftIcon}
        </span>
      ) : null}
      {prefix ? (
        <span style={{ color: 'var(--ld-fg-lower)', flexShrink: 0, fontSize: 14 }}>{prefix}</span>
      ) : null}
      <input
        ref={inputRef}
        type={type}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        {...rest}
      />
      {showCounter ? (
        <span style={{ color: 'var(--ld-fg-lower)', fontSize: 12, flexShrink: 0 }}>
          {(currentValue?.length || 0)}/{maxLength}
        </span>
      ) : null}
      {clearable && currentValue && !disabled && !readOnly ? (
        <button
          type="button"
          aria-label="입력값 지우기"
          onClick={handleClear}
          style={{
            all: 'unset', cursor: 'pointer',
            width: 20, height: 20,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ld-fg-lower)',
            borderRadius: 'var(--ld-radius-full)',
            flexShrink: 0,
          }}
        >×</button>
      ) : null}
      {suffix ? (
        <span style={{ color: 'var(--ld-fg-lower)', flexShrink: 0, fontSize: 14 }}>{suffix}</span>
      ) : null}
      {rightIcon ? (
        <span aria-hidden style={{ display: 'inline-flex', color: 'var(--ld-fg-lower)', flexShrink: 0 }}>
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
}

// ============================================================
// SearchField — TextField 변형 (leftIcon=🔍, clearable=true, Enter→onSearch)
// ============================================================
export function SearchField({ onSearch, placeholder = '검색', ...rest }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.(e.target.value);
  };
  return (
    <TextField
      type="search"
      leftIcon="🔍"
      clearable
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}

// ============================================================
// TextArea
// ============================================================
export function TextArea({
  value,
  defaultValue,
  onChange,
  rows = 3,
  maxLength,
  counter = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  className = '',
  resize = 'vertical',
  ...rest
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const showCounter = counter && typeof maxLength === 'number';

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <textarea
        value={currentValue}
        onChange={handleChange}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontFamily: 'var(--ld-font-family-base)',
          fontSize: 14,
          lineHeight: 1.4,
          color: 'var(--ld-fg)',
          background: disabled ? 'var(--ld-tf-bg-disabled)' : 'var(--ld-tf-bg)',
          border: `1px solid ${invalid ? 'var(--ld-tf-border-critical)' : 'var(--ld-tf-border)'}`,
          borderRadius: 'var(--ld-tf-radius)',
          outline: 'none',
          resize,
        }}
        onFocus={(e) => !invalid && !disabled && (e.target.style.borderColor = 'var(--ld-tf-border-active)')}
        onBlur={(e)  => !invalid && !disabled && (e.target.style.borderColor = 'var(--ld-tf-border)')}
        {...rest}
      />
      {showCounter ? (
        <span style={{
          position: 'absolute', bottom: 8, right: 12,
          color: 'var(--ld-fg-lower)', fontSize: 12,
          background: 'var(--ld-bg)', padding: '0 4px',
        }}>
          {(currentValue?.length || 0)}/{maxLength}
        </span>
      ) : null}
    </div>
  );
}

export default TextField;
