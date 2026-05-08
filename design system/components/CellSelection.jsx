/**
 * CellSelection — Excel-like 셀 드래그 선택 + TSV 클립보드 (v2.26.0)
 * --------------------------------------------------------------
 * mousedown → drag → mouseup 으로 셀 범위를 선택, Cmd/Ctrl+C 로 TSV 형식
 * 클립보드 복사 (Excel/Google Sheets 호환).
 *
 * 동작:
 *   - mousedown on td (체크박스/링크/버튼 제외)  → 앵커
 *   - mouseover during drag                  → focus 갱신, 범위 페인트
 *   - mouseup (document)                     → drag 종료
 *   - 표 바깥 mousedown                       → 선택 해제
 *   - copy (document)                         → 선택된 td 모음을 TSV 빌드,
 *                                              tab/newline/quote 가 들어간 셀은
 *                                              RFC 4180 quote-escape ("...""...")
 *
 * 시각:
 *   td.cell-selected → bg rgba(36,94,255,.08)
 *   td.cell-active   → outline 2px #245EFF (anchor 위치)
 *
 * Spec: layer-desktop.css §"Excel-like cell selection".
 *
 * Usage:
 *   import { setupCellSelection } from './design-system/components/CellSelection.jsx';
 *   setupCellSelection(document.querySelector('.mp-table-scroll .mp-table'));
 */
import React, { useEffect } from 'react';

/* ---------- Vanilla setup ---------- */
export function setupCellSelection(tableEl) {
  if (!tableEl) return () => {};
  tableEl.classList.add('is-cell-selectable');

  let isDragging = false;
  let anchor = null;  // {r, c}
  let focus = null;

  const getTbody = () => tableEl.querySelector('tbody');
  const isSelectable = (td) =>
    td && td.tagName === 'TD'
      && !td.classList.contains('cb-col')
      && !td.classList.contains('cb-col2')
      && !td.classList.contains('col-spacer');

  const getCoord = (td) => {
    if (!isSelectable(td)) return null;
    const tr = td.parentElement;
    const tbody = tr.parentElement;
    return { r: Array.from(tbody.children).indexOf(tr), c: td.cellIndex };
  };

  const clearSelection = () => {
    tableEl.querySelectorAll('td.cell-selected, td.cell-active')
      .forEach(td => td.classList.remove('cell-selected', 'cell-active'));
  };

  const applySelection = () => {
    if (!anchor || !focus) return;
    clearSelection();
    const tbody = getTbody();
    const r1 = Math.min(anchor.r, focus.r), r2 = Math.max(anchor.r, focus.r);
    const c1 = Math.min(anchor.c, focus.c), c2 = Math.max(anchor.c, focus.c);
    for (let r = r1; r <= r2; r++) {
      const tr = tbody.children[r]; if (!tr) continue;
      for (let c = c1; c <= c2; c++) {
        const td = tr.children[c];
        if (isSelectable(td)) td.classList.add('cell-selected');
      }
    }
    const focusTd = tbody.children[focus.r] && tbody.children[focus.r].children[focus.c];
    if (focusTd && isSelectable(focusTd)) focusTd.classList.add('cell-active');
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    const td = e.target.closest('td');
    if (!isSelectable(td)) return;
    // 인터랙티브 요소는 통과 (선택만 해제)
    if (e.target.closest('a, button, input, label, .mp-cb')) {
      clearSelection(); anchor = focus = null;
      return;
    }
    e.preventDefault();
    anchor = getCoord(td); focus = anchor;
    isDragging = true;
    applySelection();
  };

  const onMouseOver = (e) => {
    if (!isDragging) return;
    const td = e.target.closest('td');
    if (!isSelectable(td)) return;
    const c = getCoord(td);
    if (c && (!focus || c.r !== focus.r || c.c !== focus.c)) {
      focus = c; applySelection();
    }
  };

  const onMouseUp = () => { isDragging = false; };

  const onDocMouseDown = (e) => {
    if (!e.target.closest('.mp-table')) {
      clearSelection(); anchor = focus = null;
    }
  };

  const onCopy = (e) => {
    const selected = Array.from(tableEl.querySelectorAll('td.cell-selected'));
    if (!selected.length) return;
    const byRow = {};
    selected.forEach(td => {
      const tr = td.parentElement;
      const tbody = tr.parentElement;
      const r = Array.from(tbody.children).indexOf(tr);
      const c = td.cellIndex;
      if (!byRow[r]) byRow[r] = {};
      byRow[r][c] = (td.innerText || td.textContent || '').replace(/ /g, ' ').trim();
    });
    const rs = Object.keys(byRow).map(Number).sort((a, b) => a - b);
    const lines = rs.map(r => {
      const cs = Object.keys(byRow[r]).map(Number).sort((a, b) => a - b);
      return cs.map(c => {
        let v = byRow[r][c];
        if (/[\t\n"]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
        return v;
      }).join('\t');
    });
    const text = lines.join('\n');
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  };

  tableEl.addEventListener('mousedown', onMouseDown);
  tableEl.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousedown', onDocMouseDown);
  document.addEventListener('copy', onCopy);

  return function teardown() {
    tableEl.removeEventListener('mousedown', onMouseDown);
    tableEl.removeEventListener('mouseover', onMouseOver);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousedown', onDocMouseDown);
    document.removeEventListener('copy', onCopy);
    tableEl.classList.remove('is-cell-selectable');
    clearSelection();
  };
}

/* ---------- Optional React hook wrapper ---------- */
export function CellSelection({ tableRef, children }) {
  useEffect(() => {
    const el = tableRef?.current;
    if (!el) return;
    const teardown = setupCellSelection(el);
    return teardown;
  }, [tableRef]);
  return <>{children}</>;
}

export default CellSelection;
