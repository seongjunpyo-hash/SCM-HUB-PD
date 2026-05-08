/**
 * FrozenColumns — 가로 고정 컬럼 (horizontal sticky) 유틸 (v2.26.0)
 * --------------------------------------------------------------
 * 첫 N 컬럼을 `position:sticky; left:<누적 px>` 로 고정.
 * - rowspan/colspan 이 섞인 thead 도 첫 N 'visual' 컬럼만 잠그도록
 *   각 row 의 cellIndex 기반으로 클래스를 부여 (rowspan 셀은 다음 행에서 제외).
 * - JS 가 본문 첫 행의 너비를 측정 → `--frozen-l1..N` CSS 변수에 누적 left 셋팅.
 * - frozen ↔ scrolling 경계: col-frozen-N 우측 1px boundary line, 다음 셀 border-left:0.
 *
 * Spec: layer-desktop.css §"v2.26.0 — Frozen columns".
 *
 * Usage:
 *   import { applyFrozenColumns } from './design-system/components/FrozenColumns.jsx';
 *   applyFrozenColumns(tableEl, 6);   // 첫 6개 컬럼 frozen
 *
 *   // group-row 가 있는 SKU 관리 같은 경우 — colspan 이 큰 그룹 셀이 frozen 영역을
 *   // 가로지르면 직접 col-frozen-3 col-frozen-group 클래스를 마크업에 넣어 split.
 */
import React, { useEffect, useRef } from 'react';

/* ---------- Vanilla setup ---------- */
export function applyFrozenColumns(tableEl, frozenCount = 6) {
  if (!tableEl || frozenCount <= 0) return;

  // 1) 클래스 자동 부여 (간단한 평면 thead/tbody 케이스)
  //    SKU 관리처럼 group-row + colspan/rowspan 이 복잡한 thead 는
  //    HTML 마크업 단계에서 직접 col-frozen-N 클래스를 명시 (override).
  const tagFrozenInRow = (row) => {
    let visualCol = 0;
    Array.from(row.children).forEach(cell => {
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
      // 이미 명시된 col-frozen-N 이 있으면 존중
      const hasExplicit = /(^|\s)col-frozen-\d+/.test(cell.className);
      if (!hasExplicit) {
        for (let i = 0; i < colspan; i++) {
          const idx = visualCol + i + 1;
          if (idx <= frozenCount) cell.classList.add(`col-frozen-${idx}`);
        }
      }
      visualCol += colspan;
    });
  };
  tableEl.querySelectorAll('thead tr, tbody tr').forEach(tagFrozenInRow);

  // 2) 본문 첫 행 기준 누적 left 측정 → CSS 변수
  const firstBodyRow = tableEl.querySelector('tbody tr');
  if (!firstBodyRow || firstBodyRow.children.length < 1) return;
  const colWidths = Array.from(firstBodyRow.children).map(td =>
    Math.round(td.getBoundingClientRect().width)
  );

  const root = document.documentElement;
  let cum = 0;
  for (let i = 0; i < frozenCount; i++) {
    root.style.setProperty(`--frozen-l${i + 1}`, cum + 'px');
    cum += (colWidths[i] || 0);
  }

  return { colWidths };
}

/* ---------- Optional React wrapper ---------- */
export function FrozenColumns({ tableRef, frozenCount = 6, children }) {
  // tableRef 가 주어지면 init 시 적용. 없으면 children 안의 첫 .mp-table 자동 탐색.
  const fallbackRef = useRef(null);
  useEffect(() => {
    const el = tableRef?.current || fallbackRef.current?.querySelector('.mp-table');
    if (el) applyFrozenColumns(el, frozenCount);
  }, [tableRef, frozenCount]);
  return <div ref={fallbackRef}>{children}</div>;
}

export default FrozenColumns;
