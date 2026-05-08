/**
 * Layer Desktop — Select / OptionList
 * --------------------------------------------------------------
 * Figma node: 411:15311 (Select 풀 매트릭스)
 *
 * 표준 사용 형태 (Label + Select + helperText 한 묶음):
 *   <Select
 *     label="좋아하는 브랜드"
 *     required
 *     placeholder="선택해주세요"
 *     helperText="최소 1개 이상 선택"
 *     options={[{ value:'musinsa', label:'무신사' }, ...]}
 *     value={v} onChange={setV}
 *   />
 *
 * Multi-select:
 *   <Select multiple value={[]} options={...} />
 *   - value는 array
 *   - 옵션 좌측에 체크박스
 *   - trigger에 count chip 또는 선택된 항목 요약
 *
 * Validation:
 *   - invalid={true} 또는 validation="error" → 빨간 border
 *   - validation="success" → 초록 border
 *   - validationMessage 와 helperText는 동시 표시 가능 (validationMessage가 위, helperText가 아래)
 *
 * popover 헤더 (옵션):
 *   - searchable={true} → 검색 input
 *   - onAddValue={(query) => ...} → "+ value 추가" 액션
 *   - 둘 다 함께 사용 가능 (검색 위, value 추가 아래)
 */
import React, { useState, useRef, useEffect, useId } from 'react';

const SIZE_CLASS = {
  xs: 'ld-select-xs',
  sm: 'ld-select-sm',
  md: '',
  lg: 'ld-select-lg',
};

const SIZE_HEIGHT = { xs: 28, sm: 32, md: 40, lg: 44 };

export function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = '선택',
  multiple = false,

  label,
  required = false,
  optional = false,
  helperText,

  invalid = false,
  validation,
  validationMessage,

  size = 'md',
  leftIcon,
  clearable = false,
  count,
  readOnly = false,
  disabled = false,
  searchable = false,
  onAddValue,
  addValueLabel = 'value 추가',

  fullWidth = true,
  className = '',
  ...rest
}) {
  const isControlled = value !== undefined;
  const initial = multiple ? (defaultValue ?? []) : defaultValue;
  const [internalValue, setInternalValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);
  const popoverId = useId();
  const labelId = useId();
  const helperId = useId();

  const currentValue = isControlled ? value : internalValue;

  // selected (single) or selectedItems (multi)
  const selected = !multiple
    ? options.find((o) => !o.divider && o.value === currentValue)
    : null;
  const selectedItems = multiple
    ? options.filter((o) => !o.divider && (currentValue || []).includes(o.value))
    : [];

  const handleSelect = (val) => {
    if (multiple) {
      const arr = currentValue || [];
      const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      // multi는 popover 유지
    } else {
      if (!isControlled) setInternalValue(val);
      onChange?.(val);
      setOpen(false);
      setQuery('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    const next = multiple ? [] : undefined;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleAddValue = () => {
    onAddValue?.(query);
    setQuery('');
  };

  // outside click 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const validationState = invalid ? 'error' : validation;
  const isError   = validationState === 'error';
  const isSuccess = validationState === 'success';

  const sizeCls = SIZE_CLASS[size] || '';
  const cls = ['ld-select', sizeCls, className].filter(Boolean).join(' ');

  // 검색 필터
  const filteredOptions = searchable && query
    ? options.filter((o) => o.divider || (o.label || '').toLowerCase().includes(query.toLowerCase()))
    : options;

  // trigger 표시 텍스트
  const hasValue = multiple ? selectedItems.length > 0 : !!selected;
  const triggerText = multiple
    ? (selectedItems.length === 0 ? placeholder
       : selectedItems.length === 1 ? selectedItems[0].label
       : `${selectedItems[0].label} +${selectedItems.length - 1}`)
    : (selected ? selected.label : placeholder);

  const showCount = (typeof count === 'number' && count > 0)
                    || (multiple && selectedItems.length > 1);
  const countValue = typeof count === 'number' ? count : selectedItems.length;

  return (
    <div
      ref={wrapperRef}
      className={`ld-field ${className}`}
      style={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block', minWidth: fullWidth ? undefined : 200, width: fullWidth ? '100%' : undefined }}
      {...rest}
    >
      {label ? (
        <label id={labelId} className="ld-field-label">
          {label}
          {required ? <span className="ld-field-required">*</span> : null}
          {optional ? <span className="ld-field-optional">(선택)</span> : null}
        </label>
      ) : null}

      <button
        type="button"
        className={cls}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={isError || undefined}
        aria-readonly={readOnly || undefined}
        aria-multiselectable={multiple || undefined}
        aria-controls={popoverId}
        aria-labelledby={label ? labelId : undefined}
        data-validation={isSuccess ? 'success' : undefined}
        disabled={disabled}
        onClick={() => !disabled && !readOnly && setOpen(!open)}
        style={{ height: SIZE_HEIGHT[size] }}
      >
        {leftIcon ? <span className="ld-select-icon" aria-hidden>{leftIcon}</span> : null}
        <span className="ld-select-value" data-placeholder={!hasValue || undefined}>
          {triggerText}
        </span>
        {showCount ? (
          <span className="ld-select-count" aria-label={`선택 ${countValue}개`}>{countValue}</span>
        ) : null}
        {clearable && hasValue && !disabled && !readOnly ? (
          <span
            role="button"
            tabIndex={-1}
            className="ld-select-clear"
            aria-label="선택 지우기"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
          >×</span>
        ) : null}
        <span className="ld-select-chevron" aria-hidden>▾</span>
      </button>

      {open ? (
        <div
          className="ld-select-popover"
          id={popoverId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          style={{ left: 0, right: 0, top: 'calc(100% + 4px)' }}
        >
          {searchable ? (
            <div className="ld-popover-search">
              <span className="ld-popover-search-icon" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                className="ld-popover-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색"
                autoFocus
              />
            </div>
          ) : null}
          {onAddValue ? (
            <button type="button" className="ld-popover-add" onClick={handleAddValue}>
              {addValueLabel}
            </button>
          ) : null}
          <OptionList
            options={filteredOptions}
            value={currentValue}
            onChange={handleSelect}
            multi={multiple}
            inline
          />
          {filteredOptions.length === 0 ? (
            <div style={{ padding: '12px 8px', fontSize: 13, color: 'var(--ld-fg-lower)', textAlign: 'center' }}>
              결과 없음
            </div>
          ) : null}
        </div>
      ) : null}

      {/* validation message + helper text 동시 표시 (validation 위, helper 아래) */}
      {validationMessage ? (
        <p className={`ld-helper ${isError ? 'ld-helper-critical' : isSuccess ? 'ld-helper-success' : ''}`}>{validationMessage}</p>
      ) : null}
      {helperText ? (
        <p id={helperId} className="ld-helper">{helperText}</p>
      ) : null}
    </div>
  );
}

// ============================================================
// OptionList — popover 외부에서도 단독 사용 가능
// ============================================================
export function OptionList({ options = [], value, onChange, multi = false, inline = false, className = '', ...rest }) {
  const wrapperStyle = inline
    ? {}
    : {
        background: 'var(--ld-opt-bg)',
        border: '1px solid var(--ld-opt-border)',
        borderRadius: 'var(--ld-radius-xs)',
        padding: 4,
        boxShadow: 'var(--ld-shadow-popover)',
      };

  const isSelected = (optValue) => {
    if (multi) return Array.isArray(value) && value.includes(optValue);
    return optValue === value;
  };

  return (
    <div className={className} style={wrapperStyle} {...rest}>
      {options.map((opt, idx) => {
        if (opt.divider) return <div key={`div-${idx}`} className="ld-option-divider" />;
        const selected = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={selected}
            disabled={opt.disabled}
            className="ld-option"
            data-multi={multi || undefined}
            onClick={() => !opt.disabled && onChange?.(opt.value)}
          >
            {multi ? (
              <span className="ld-option-checkbox" aria-hidden>
                {selected ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : null}
              </span>
            ) : null}
            {opt.icon ? <span aria-hidden>{opt.icon}</span> : null}
            <span style={{ flex: 1 }}>{opt.label}</span>
            {opt.suffix ? <span style={{ color: 'var(--ld-fg-lower)' }}>{opt.suffix}</span> : null}
            {!multi && selected ? <span aria-hidden style={{ color: 'var(--ld-fg)' }}>✓</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default Select;
