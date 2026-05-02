/**
 * FilterBar — 데이터 리스트 페이지 필터 영역
 *
 * Sub-components:
 *   <FilterBar>           — 컨테이너 (flex wrap, gap 8)
 *   <FilterChip>          — 전체 필터 chip ("전체 필터 N", funnel 아이콘)
 *   <FilterSelect>        — floating-label select (label + value + chev)
 *                           state: "active" | "filled" | "placeholder"
 *                           required: 파란 4×4 점 (별표 X)
 *                           disabledChev: 의존 필터 비활성 톤
 *   <FilterGroup>         — 인접 셀렉트를 한 덩어리로 묶음 (border 공유)
 *   <FilterInput>         — select 와 페어링되는 텍스트 입력
 *   <FilterSearchButton>  — 검색 버튼 (default disabled, 활성 시 검정 filled)
 *
 * Spec : design-system/docs/data-list-page.md §3
 */
import React from 'react';

export function FilterBar({ children, className = '', ...rest }) {
  return (
    <div className={['ld-filter-bar', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function FilterChip({ count, label = '전체 필터', icon, onClick, ...rest }) {
  return (
    <button type="button" className="ld-filter-chip" onClick={onClick} {...rest}>
      {icon || (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6.14286 10H13.8571M4 6L16 6M8.28571 14L11.7143 14" stroke="currentColor" fill="none"/>
        </svg>
      )}
      <span>{label}</span>
      {typeof count === 'number' && <span className="num">{count}</span>}
    </button>
  );
}

export function FilterSelect({
  label,
  value,
  required = false,
  state = 'placeholder',  // 'active' | 'filled' | 'placeholder'
  disabledChev = false,
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className="ld-filter-select"
      data-state={state}
      data-chev={disabledChev ? 'disabled' : undefined}
      onClick={onClick}
      {...rest}
    >
      {label && (
        <span className="label">
          {label}
          {required && <span className="req-dot" aria-label="필수" />}
        </span>
      )}
      <span className="value">{value || children}</span>
      <svg className="chev" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 8L10 14L16 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </button>
  );
}

export function FilterGroup({ children, className = '', ...rest }) {
  return (
    <div className={['ld-filter-group', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function FilterInput({ placeholder = '입력', value, onChange, showChev = true, ...rest }) {
  return (
    <div className="ld-filter-input">
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {showChev && (
        <svg className="chev" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 8L10 14L16 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )}
    </div>
  );
}

export function FilterSearchButton({ disabled = true, onClick, children = '검색', ...rest }) {
  return (
    <button
      type="button"
      className="ld-filter-search-btn"
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default FilterBar;
