// v2.26.0 — Dual-table sticky thead / frozen columns / cell selection / sku-stack 패턴 문서화.
//           SKU 관리·무탠 데모에서 쓰는 sticky stack 은 Table 자체가 아니라 외부 마크업
//           (.mp-thead-sticky + .mp-table-scroll) 으로 구성. 본 컴포넌트는 단일 테이블 케이스용.
//           복합 패턴은 StickyTable / FrozenColumns / CellSelection 유틸 참고.
/**
 * Layer Desktop — Table (tableBasic)
 * --------------------------------------------------------------
 * Layout: Toolbar (top) → Table (가로 스크롤) → Toolbar (bottom 옵션)
 *         또는 데이터 없으면 Empty state
 *
 * Toolbar slots:
 *   left:  total ("전체 N") + filter chips 등 임의 ReactNode
 *   right: download 버튼 + 페이지 인포 + page size select
 *
 * --- API ---
 *   columns       : Array<{
 *                     key: string,
 *                     header: string,
 *                     align?: 'left'|'right'|'center',
 *                     width?: string|number,
 *                     render?: (row, index) => ReactNode  // 커스텀 셀
 *                   }>
 *   data          : Array<row>
 *   total         : number  (전체 개수, toolbar 좌측 표시)
 *   page          : number  (1-based, 현재 페이지)
 *   totalPages    : number
 *   pageSize      : number
 *   pageSizeOptions: [10, 50, 100, ...]
 *   onPageChange  : (page) => void
 *   onPageSizeChange: (size) => void
 *   onDownload    : () => void
 *   toolbarLeft   : ReactNode (filter chips 등 추가)
 *   bottomToolbar : boolean (default true)
 *   zebra         : boolean (default false) — 짝수 행 회색
 *   selectable    : boolean (default false) — 좌측 체크박스 컬럼 표시
 *   selectedRows  : Set<key> | Array<key>   — 선택된 행 키
 *   onSelectionChange: (selectedSet) => void
 *   numbered      : boolean (default false) — "No" 행번호 컬럼 (1-based, page 고려)
 *   bordered      : boolean (default false) — 외곽 1px border + radius wrap
 *   emptyTitle    : string
 *   emptyDescription: string
 *   emptyIcon     : ReactNode
 *   rowKey        : (row, idx) => string (default: row.id ?? idx)
 *
 * --- Cell helpers ---
 *   <Table.NumericCell value={999} color="blue" bold />
 *   <Table.DateCell value="2025-11-20T12:06" />
 *   <Table.StatusTextCell pairs={[['Label', 900, 'success'], ['Label', 100, 'critical']]} />
 *   <Table.TrailingCell labels={['Label']} description="설명" />
 */
import React from 'react';

const DEFAULT_EMPTY_ICON = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {/* file body */}
    <path d="M14 8 H38 L52 22 V56 H14 Z"
          fill="var(--ld-bg-low)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* folded corner */}
    <path d="M38 8 V22 H52" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    {/* info badge */}
    <circle cx="46" cy="44" r="9" fill="currentColor" opacity="0.85"/>
    <rect x="45" y="38.5" width="2" height="6" rx="1" fill="var(--ld-bg)"/>
    <circle cx="46" cy="48" r="1.1" fill="var(--ld-bg)"/>
  </svg>
);

function toSet(s) {
  if (s instanceof Set) return s;
  if (Array.isArray(s)) return new Set(s);
  return new Set();
}

export function Table({
  columns = [],
  data = [],
  total,
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 50, 100, 200],
  onPageChange,
  onPageSizeChange,
  onDownload,
  toolbarLeft,
  bottomToolbar = true,
  zebra = false,
  selectable = false,
  selectedRows,
  onSelectionChange,
  numbered = false,
  bordered = false,
  rowKey,
  emptyTitle = '데이터가 없습니다',
  emptyDescription = '',
  emptyIcon,
  className = '',
  ...rest
}) {
  const isEmpty = data.length === 0;
  const getKey = rowKey || ((row, idx) => row?.id ?? idx);

  // selection state
  const selected = toSet(selectedRows);
  const allKeys = data.map((row, idx) => getKey(row, idx));
  const allSelected = selectable && allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = selectable && !allSelected && allKeys.some((k) => selected.has(k));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (allSelected) {
      allKeys.forEach((k) => next.delete(k));
    } else {
      allKeys.forEach((k) => next.add(k));
    }
    onSelectionChange(next);
  };

  const toggleRow = (k) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelectionChange(next);
  };

  const renderToolbar = (key) => (
    <div className="ld-table-toolbar" key={key}>
      <div className="ld-table-toolbar-left">
        {typeof total === 'number' ? (
          <span className="ld-table-total">전체 <strong>{total.toLocaleString()}</strong></span>
        ) : null}
        {toolbarLeft}
      </div>
      <div className="ld-table-toolbar-right">
        {onDownload ? (
          <button type="button" className="ld-table-download" onClick={onDownload}>
            <span aria-hidden>↓</span> 전체 엑셀 다운로드
          </button>
        ) : null}
        {onDownload && (typeof page === 'number') ? <span className="ld-table-toolbar-divider" aria-hidden /> : null}
        {(typeof page === 'number' && typeof totalPages === 'number') ? (
          <span className="ld-table-page-info">
            <strong>{page}</strong> / {totalPages} 페이지
            <button
              type="button"
              className="ld-table-page-btn"
              aria-label="이전 페이지"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >‹</button>
            <button
              type="button"
              className="ld-table-page-btn"
              aria-label="다음 페이지"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >›</button>
          </span>
        ) : null}
        {(pageSize && onPageSizeChange) ? (
          <select
            className="ld-select"
            style={{ height: 32, padding: '0 8px', fontSize: 13, minWidth: 96, width: 'auto' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => <option key={n} value={n}>{n}개씩</option>)}
          </select>
        ) : null}
      </div>
    </div>
  );

  const renderHeaderCheckbox = () => (
    <th className="ld-table-cb-col">
      <span
        className="ld-table-cb"
        role="checkbox"
        tabIndex={0}
        aria-checked={someSelected ? 'mixed' : allSelected}
        aria-label="전체 선택"
        data-checked={allSelected ? 'true' : 'false'}
        data-indeterminate={someSelected ? 'true' : 'false'}
        onClick={toggleAll}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleAll(); } }}
      />
    </th>
  );

  const renderRowCheckbox = (k) => (
    <td className="ld-table-cb-col">
      <span
        className="ld-table-cb"
        role="checkbox"
        tabIndex={0}
        aria-checked={selected.has(k)}
        aria-label="행 선택"
        data-checked={selected.has(k) ? 'true' : 'false'}
        onClick={(e) => { e.stopPropagation(); toggleRow(k); }}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleRow(k); } }}
      />
    </td>
  );

  // 1-based 행번호 (페이지네이션 시 절대 번호)
  const startNo = (typeof page === 'number' && typeof pageSize === 'number')
    ? (page - 1) * pageSize + 1
    : 1;

  const wrapCls = ['ld-table-wrap', bordered ? 'ld-table-wrap-bordered' : '', className]
    .filter(Boolean).join(' ');

  return (
    <div className={wrapCls} {...rest}>
      {renderToolbar('top')}
      <div className="ld-table-scroll">
        <table className={`ld-table ${zebra ? 'ld-table-zebra' : ''}`}>
          <thead>
            <tr>
              {selectable ? renderHeaderCheckbox() : null}
              {numbered ? <th className="ld-table-num-col">No</th> : null}
              {columns.map((col) => (
                <th
                  key={col.key}
                  data-align={col.align || undefined}
                  style={col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          {!isEmpty ? (
            <tbody>
              {data.map((row, idx) => {
                const k = getKey(row, idx);
                const isSelected = selected.has(k);
                return (
                  <tr key={k} data-selected={isSelected ? 'true' : undefined}>
                    {selectable ? renderRowCheckbox(k) : null}
                    {numbered ? <td className="ld-table-num-col">{startNo + idx}</td> : null}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        data-align={col.align || undefined}
                        className={col.cellClassName}
                        style={col.align === 'right' ? { textAlign: 'right' } : col.align === 'center' ? { textAlign: 'center' } : undefined}
                      >
                        {col.render ? col.render(row, idx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ) : null}
        </table>
      </div>
      {isEmpty ? (
        <div className="ld-table-empty">
          <div className="ld-table-empty-icon">
            {emptyIcon ?? DEFAULT_EMPTY_ICON}
          </div>
          <h3 className="ld-table-empty-title">{emptyTitle}</h3>
          {emptyDescription ? <p className="ld-table-empty-desc">{emptyDescription}</p> : null}
        </div>
      ) : null}
      {bottomToolbar && !isEmpty ? renderToolbar('bottom') : null}
    </div>
  );
}

// ============================================================
// Cell helpers — column.render 안에서 편하게 사용
// ============================================================

Table.NumericCell = function NumericCell({ value, color, bold = false, formatter }) {
  const cls = [
    'ld-table-cell-numeric',
    color ? `ld-table-cell-numeric-${color}` : '',
    bold ? 'ld-table-cell-bold' : '',
  ].filter(Boolean).join(' ');
  const formatted = formatter ? formatter(value) : (typeof value === 'number' ? value.toLocaleString() : value);
  return <span className={cls}>{formatted}</span>;
};

Table.DateCell = function DateCell({ value, format = 'YYYY.MM.DD HH:mm:ss' }) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  let out = format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
  return <span className="ld-table-cell-date">{out}</span>;
};

/**
 * StatusText — "Label 900 · Label 100" 같은 형태
 *   pairs: [[label, value, severity]]
 *     severity: 'success' | 'critical' | 'default'
 */
Table.StatusTextCell = function StatusTextCell({ pairs = [] }) {
  return (
    <span className="ld-table-cell-status-text">
      {pairs.map(([label, value, severity], i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span style={{ color: 'var(--ld-fg-lower)' }}>·</span> : null}
          <span>{label}</span>
          <span className={severity === 'success' ? 'lbl-success' : severity === 'critical' ? 'lbl-critical' : ''}>
            {value}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
};

/**
 * TrailingText — "Label / Label / Label  Description"
 *   labels: array of strings
 *   description: string (옵션, 라벨 뒤에 회색으로 표시)
 */
Table.TrailingCell = function TrailingCell({ labels = [], description }) {
  return (
    <span className="ld-table-cell-trailing">
      {labels.map((l, i) => (
        <span className="label" key={i}>{l}</span>
      ))}
      {description ? <span className="desc">{description}</span> : null}
    </span>
  );
};

export default Table;
