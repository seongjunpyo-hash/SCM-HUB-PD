/**
 * DataTable — SCM Hub 데이터 리스트 페이지 표준 테이블
 *
 * 두 가지 thead 변형:
 *   variant="default"  : 단일행 thead (무탠 전개상품 관리)
 *   variant="grouped"  : 2단 thead (그룹헤더 + 본헤더, SKU 관리)
 *
 * Sub-components:
 *   <DataTableHost>     — 외곽 (border-top 2px solid #000)
 *   <DataTableScroll>   — 가로 스크롤 컨테이너
 *   <DataTableEmpty>    — 빈 상태 (border-top/bottom + 노란 삼각형)
 *
 * Spec / docs:
 *   - design-system/docs/data-list-page.md
 *   - design-system/docs/table-columns.md
 *   - design-system/layer-desktop.css §"Data Table"
 */
import React from 'react';

/* ----- 외곽 + 스크롤 컨테이너 ----- */
export function DataTableHost({ children, className = '', ...rest }) {
  return (
    <div className={['ld-data-table-host', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function DataTableScroll({ children, className = '', ...rest }) {
  return (
    <div className={['ld-data-table-scroll', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

/* ----- 메인 테이블 ----- */
export function DataTable({ children, variant = 'default', className = '', ...rest }) {
  const cls = [
    'ld-data-table',
    variant === 'grouped' && 'ld-data-table--grouped',
    className,
  ].filter(Boolean).join(' ');
  return <table className={cls} {...rest}>{children}</table>;
}

/* ----- 그룹 헤더 row (variant="grouped" 전용) ----- */
export function DataTableGroupRow({ children, ...rest }) {
  return <tr className="ld-data-table-group-row" {...rest}>{children}</tr>;
}

/* ----- 셀 modifiers ----- */
export const DataTableCell = ({ as: As = 'td', numeric = false, link = false, className = '', children, ...rest }) => {
  const cls = [
    numeric && 'ld-data-table-cell-numeric',
    link && 'ld-data-table-link',
    className,
  ].filter(Boolean).join(' ');
  return <As className={cls || undefined} {...rest}>{children}</As>;
};

/* ----- 체크박스 (테이블 셀 안에서 사용) ----- */
export function DataTableCheckbox({ checked = false, disabled = false, onChange, label, ...rest }) {
  return (
    <span
      className="ld-data-table-cb"
      role="checkbox"
      tabIndex={disabled ? -1 : 0}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={label}
      onClick={() => !disabled && onChange && onChange(!checked)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange && onChange(!checked);
        }
      }}
      {...rest}
    />
  );
}

/* ----- 빈 상태 ----- */
export function DataTableEmpty({
  icon,
  title = '검색 조건을 설정해 주세요.',
  desc  = '조회하실 조건을 입력하고 검색을 시작해 주세요.',
  colSpan,
  className = '',
}) {
  const content = (
    <div className={['ld-data-table-empty', className].filter(Boolean).join(' ')}>
      <div className="ld-data-table-empty-icon">
        {icon || (
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              d="M32 42V37M32 35V21M5 53H59C60 53 60.5 52 60 51L33 7C32.5 6 31.5 6 31 7L4 51C3.5 52 4 53 5 53Z"
              stroke="currentColor" strokeWidth="5" strokeLinejoin="round" fill="none"
            />
          </svg>
        )}
      </div>
      <div className="ld-data-table-empty-text">
        <div className="ld-data-table-empty-title">{title}</div>
        <div className="ld-data-table-empty-desc">{desc}</div>
      </div>
    </div>
  );

  // 테이블 안의 빈 row 로 사용 시
  if (typeof colSpan === 'number') {
    return (
      <tr>
        <td colSpan={colSpan} style={{ borderRight: 0, padding: 0 }}>{content}</td>
      </tr>
    );
  }
  return content;
}

export default DataTable;
