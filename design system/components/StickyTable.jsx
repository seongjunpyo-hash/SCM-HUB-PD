/**
 * StickyTable — Dual-table sticky thead 시스템 (v2.26.0)
 * --------------------------------------------------------------
 * CSS sticky on `<thead>`/`<tr>` 가 rowspan/colspan + 가로 스크롤과 함께
 * 쓰일 때 Chrome 등에서 렌더 버그가 있어, **thead 만 별도 테이블로 분리** 해
 * sticky 컨테이너에 두는 우회 패턴.
 *
 * 구조:
 *   <div class="mp-thead-sticky">
 *     <div class="mp-thead-scroll"></div>     ← JS 가 thead-only 테이블을 여기로 이동
 *   </div>
 *   <div class="mp-table-scroll">
 *     <table class="mp-table"> ... </table>   ← thead 가 빠지고 tbody 만 남음
 *   </div>
 *
 * setupStickyTable(tableEl) 가 init 시:
 *   1) 본문 첫 행 기준으로 컬럼 너비 측정 (정수 px round)
 *   2) thead-only 테이블에 동일한 colgroup + table-layout:fixed 부여
 *   3) origThead 를 통째로 이동 (clone 아님 — id/이벤트 보존)
 *   4) 본문 가로 스크롤 → thead-scroll 가로 스크롤 동기화
 *
 * Spec: layer-desktop.css §"v2.26.0 Data list page sticky/frozen/dual-table"
 *
 * Usage (vanilla):
 *   import { setupStickyTable } from './design-system/components/StickyTable.jsx';
 *   setupStickyTable(document.querySelector('.mp-table-scroll > .mp-table'));
 *
 * Usage (React wrapper):
 *   <StickyTable>
 *     <table className="mp-table">...</table>
 *   </StickyTable>
 */
import React, { useEffect, useRef } from 'react';

/* ---------- Vanilla setup (재사용 가능) ---------- */
export function setupStickyTable(tableEl, options = {}) {
  if (!tableEl) return;
  const {
    headSelector = '.mp-thead-sticky .mp-thead-scroll',
    bodyScrollSelector = '.mp-table-scroll',
  } = options;

  const stickyScroll = document.querySelector(headSelector);
  const bodyScroll = tableEl.closest(bodyScrollSelector) || document.querySelector(bodyScrollSelector);
  if (!stickyScroll || !bodyScroll) return;

  const origThead = tableEl.querySelector('thead');
  if (!origThead) return;
  // 이미 init 했으면 skip
  if (stickyScroll.querySelector('thead')) return;

  // 본문 첫 행 기준으로 모든 컬럼 너비 측정
  const firstBodyRow = tableEl.querySelector('tbody tr');
  if (!firstBodyRow || firstBodyRow.children.length < 2) return;
  const colWidths = Array.from(firstBodyRow.children).map(td =>
    Math.round(td.getBoundingClientRect().width)
  );
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  // sticky thead 용 별도 테이블
  const cloneTable = document.createElement('table');
  cloneTable.className = tableEl.className;
  cloneTable.style.tableLayout = 'fixed';
  cloneTable.style.width = totalWidth + 'px';
  cloneTable.style.minWidth = totalWidth + 'px';

  const cloneColgroup = document.createElement('colgroup');
  colWidths.forEach(w => {
    const col = document.createElement('col');
    col.style.width = w + 'px';
    cloneColgroup.appendChild(col);
  });
  cloneTable.appendChild(cloneColgroup);

  // thead 를 통째로 이동 (clone 아님)
  cloneTable.appendChild(origThead);
  stickyScroll.appendChild(cloneTable);

  // 본문 테이블에도 동일 colgroup + table-layout:fixed 적용
  const origColgroup = cloneColgroup.cloneNode(true);
  tableEl.insertBefore(origColgroup, tableEl.firstChild);
  tableEl.style.tableLayout = 'fixed';
  tableEl.style.width = totalWidth + 'px';
  tableEl.style.minWidth = totalWidth + 'px';

  // 가로 스크롤 동기화
  const onScroll = () => { stickyScroll.scrollLeft = bodyScroll.scrollLeft; };
  bodyScroll.addEventListener('scroll', onScroll, { passive: true });

  return {
    colWidths,
    totalWidth,
    teardown() {
      bodyScroll.removeEventListener('scroll', onScroll);
    },
  };
}

/* ---------- Optional React wrapper ---------- */
export function StickyTable({ children, className = '', ...rest }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    const tableEl = wrapRef.current?.querySelector('.mp-table-scroll > .mp-table');
    if (tableEl) setupStickyTable(tableEl);
  }, []);
  return (
    <div ref={wrapRef} className={['mp-table-host', className].filter(Boolean).join(' ')} {...rest}>
      <div className="mp-thead-sticky"><div className="mp-thead-scroll" /></div>
      {children}
    </div>
  );
}

export default StickyTable;
