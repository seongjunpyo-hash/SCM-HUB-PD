/**
 * scm-bulk-upload-modal — React twin (controlled)
 *
 * 외부 데이터(history rows)는 props 로. 내부 sub 컴포넌트는 export 도 함께.
 */

import { useState } from 'react';

const CloseIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WarnIcon = (
  <svg className="scm-bu-warning__icon" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 3 L18 17 L2 17 Z M10 9 V12 M10 14 V14.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

const ChevDown = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BulkUploadModal({
  open = false,
  onClose,
  title = '일괄 업로드',
  warningTitle,
  warningItems = [],
  typeSection,                  // ReactNode (전체 type-section 슬롯)
  historyRows = [],             // [{ no, status, type, file, result?, time, user }]
  footer,
  className = '',
}) {
  if (!open) return null;
  return (
    <>
      <div className="scm-bu-backdrop is-open" onClick={onClose} />
      <div className={['scm-bu-modal', 'is-open', className].filter(Boolean).join(' ')} role="dialog" aria-labelledby="bu-title">
        <header className="scm-bu-header">
          <h2 id="bu-title">{title}</h2>
          <button className="scm-bu-close" type="button" aria-label="닫기" onClick={onClose}>
            {CloseIcon}
          </button>
        </header>
        <div className="scm-bu-body">
          {warningTitle && <BulkUploadWarning title={warningTitle} items={warningItems} />}
          {typeSection}
          {historyRows.length > 0 && <BulkUploadHistoryTable rows={historyRows} />}
        </div>
        {footer && <footer className="scm-bu-footer">{footer}</footer>}
      </div>
    </>
  );
}

export function BulkUploadWarning({ title, items = [], defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <div className={['scm-bu-warning', collapsed && 'is-collapsed'].filter(Boolean).join(' ')}>
      <div className="scm-bu-warning__head">
        {WarnIcon}
        <div className="scm-bu-warning__head-body">
          <div className="scm-bu-warning__title">{title}</div>
          <ul className="scm-bu-warning__list">
            {items.map((it, i) => (
              <li key={i} className={it.critical ? 'is-critical' : undefined}>{it.text || it}</li>
            ))}
          </ul>
        </div>
        <button className="scm-bu-warning__toggle" type="button" aria-label="접기" onClick={() => setCollapsed(!collapsed)}>
          {ChevDown}
        </button>
      </div>
    </div>
  );
}

export function BulkUploadHistoryTable({ rows = [] }) {
  return (
    <section className="scm-bu-history-section">
      <h3 className="scm-bu-history-title">업로드 요청 이력</h3>
      <table className="scm-bu-history-table">
        <colgroup>
          <col style={{ width: 52 }} />
          <col style={{ width: 97 }} />
          <col style={{ width: 167 }} />
          <col style={{ width: 240 }} />
          <col style={{ width: 362 }} />
          <col style={{ width: 152 }} />
          <col style={{ width: 154 }} />
        </colgroup>
        <thead>
          <tr>
            <th>No</th>
            <th>상태</th>
            <th>유형</th>
            <th>파일</th>
            <th>결과</th>
            <th>요청시간</th>
            <th>요청자</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.no}</td>
              <td><span className="scm-bu-status-pill" data-state={r.statusState}>{r.statusLabel}</span></td>
              <td>{r.type}</td>
              <td>{r.file}</td>
              <td className="scm-bu-result-cell">{r.result || '—'}</td>
              <td>{r.time}</td>
              <td>{r.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
