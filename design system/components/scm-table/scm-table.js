/**
 * SCM Table — 자가포함 테이블 인터랙션 모듈
 * ============================================================
 * 의존성: 없음 (vanilla JS, ES2017+)
 * 페어: scm-table.css (CSS 변수 / 클래스 spec 정의)
 *
 * 제공 기능:
 *   - setupStickyThead(root)        — 듀얼 테이블 sticky thead 분리 + colgroup 동기화
 *   - setupTableInteractions(root)  — 헤더 더블클릭 컬럼 선택, resize 핸들, reorder
 *   - setupCellSelection(root)      — Excel-like 셀 선택, Cmd+C TSV 복사
 *   - SCMTable.init(opts)           — 위 3개 일괄 초기화
 *
 * 사용:
 *   import { SCMTable } from '.../scm-table.js';
 *   SCMTable.init({ root: document });
 *
 * Spec:
 *   col-large : measured >= 320 (강제) — 상품명·SKU명
 *   col-medium: cell-clamp-2 있으면 강제 260 (2줄 wrap), 아니면 88~260 클램프 (1줄)
 *   resize 최소: 100px
 * ============================================================ */

const COL_LARGE_MIN = 320;
const COL_MEDIUM_MAX = 260;
const COL_MEDIUM_MIN = 88;
const RESIZE_MIN = 100;
const GROUP_ROW_HEIGHT = 44;

/* ----------------------------------------------------------------
 * leaf header 빌더 — 1단/2단 thead 모두에서 body td idx 와 1:1 매핑
 * - 1단: colspan 만큼 같은 th 를 leaf 에 반복 push
 * - 2단: row1 의 rowspan=2 → leaf 그대로, colspan>1 group 셀 → row2 의
 *         해당 자식들을 leaf 에 push
 * ---------------------------------------------------------------- */
function buildLeafHeaders(thead) {
  const trAll = Array.from(thead.querySelectorAll('tr'));
  if (trAll.length === 0) return [];

  if (trAll.length === 1) {
    const leaves = [];
    Array.from(trAll[0].children).forEach(th => {
      const cs = parseInt(th.getAttribute('colspan')) || 1;
      for (let i = 0; i < cs; i++) leaves.push(th);
    });
    return leaves;
  }

  // 2단 thead
  const row1 = Array.from(trAll[0].children);
  const row2 = Array.from(trAll[1].children);
  const leaves = [];
  let r2 = 0;
  row1.forEach(th => {
    const rs = parseInt(th.getAttribute('rowspan')) || 1;
    const cs = parseInt(th.getAttribute('colspan')) || 1;
    if (rs >= 2) {
      leaves.push(th);
    } else {
      for (let i = 0; i < cs; i++) {
        if (r2 < row2.length) leaves.push(row2[r2++]);
      }
    }
  });
  return leaves;
}


/* ============================================================
 * LeafModel — thead 구조의 1단/2단 차이를 캡슐화
 * ============================================================
 * leaves 배열 (body td 와 1:1 매핑되는 leaf th 시퀀스) 을 중심으로
 * row1 / leafTr 의 차이를 모두 흡수.
 *
 * 1단 thead:
 *   row1 === leafTr === trAll[0]
 *   leafTr child idx 는 colspan 누적으로 leaf idx 와 매핑
 *
 * 2단 thead:
 *   row1 === trAll[0] (group row), leafTr === trAll[1]
 *   row1 의 rs>=2 cell (cb/col-no/spacer) 은 자체가 leaf
 *   row1 의 rs=1 cs>=1 cell 은 산하 row2 child 들이 leaf
 *
 * 모든 메서드는 "현재 DOM 상태" 를 다시 읽어 reorder 후에도 정확.
 * ============================================================ */
class LeafModel {
  constructor(thead) {
    this.thead = thead;
    this._refresh();
  }

  // 현재 DOM 상태로 trAll / row1 / leafTr / leaves 를 다시 계산
  _refresh() {
    const trAll = Array.from(this.thead.querySelectorAll('tr'));
    this.trAll = trAll;
    this.isTwoRow = trAll.length > 1;
    this.row1 = trAll[0] || null;
    this.leafTr = trAll[trAll.length - 1] || null;
    this.leaves = buildLeafHeaders(this.thead);
  }

  // th element → 현재 절대 leaf idx
  // isRightEdge=true 면 마지막 매칭 (colspan>=2 일 때 우측 가장자리)
  thLeafIdx(th, isRightEdge = false) {
    this._refresh();
    const leaves = this.leaves;
    if (isRightEdge) {
      for (let i = leaves.length - 1; i >= 0; i--) {
        if (leaves[i] === th) return i;
      }
    } else {
      for (let i = 0; i < leaves.length; i++) {
        if (leaves[i] === th) return i;
      }
    }
    return -1;
  }

  // leaf idx → leafTr 의 child idx
  // 1단: colspan 누적. 2단: row1 의 rs=1 cell 만 row2 cell 을 consume.
  // leafIdx 가 row1 rs>=2 leaf 면 -1 (leafTr 에 매칭 child 없음)
  leafIdxToLeafChildIdx(leafIdx) {
    this._refresh();
    if (!this.isTwoRow) {
      let count = 0;
      for (let i = 0; i < this.leafTr.children.length; i++) {
        const th = this.leafTr.children[i];
        const cs = parseInt(th.getAttribute('colspan')) || 1;
        if (leafIdx >= count && leafIdx < count + cs) return i;
        count += cs;
      }
      return -1;
    }
    // 2단
    let absLeaf = 0;
    let r2Idx = 0;
    for (let i = 0; i < this.row1.children.length; i++) {
      const cell = this.row1.children[i];
      const rs = parseInt(cell.getAttribute('rowspan')) || 1;
      const cs = parseInt(cell.getAttribute('colspan')) || 1;
      if (rs >= 2) {
        if (leafIdx === absLeaf) return -1; // row1 rs=2 leaf → leafTr 에 매칭 셀 없음
        absLeaf += cs;
      } else {
        if (leafIdx >= absLeaf && leafIdx < absLeaf + cs) {
          return r2Idx + (leafIdx - absLeaf);
        }
        absLeaf += cs;
        r2Idx += cs;
      }
    }
    return -1;
  }

  // leaf idx → 그 leaf 를 cover 하는 row1 cell
  // 1단: row1 === leafTr → leaf idx 의 leafTr child 와 동일
  // 2단: row1 walk 로 leafIdx 가 속하는 cell 반환
  leafIdxToRow1Cell(leafIdx) {
    this._refresh();
    if (!this.row1) return null;
    if (!this.isTwoRow) {
      let count = 0;
      for (let i = 0; i < this.row1.children.length; i++) {
        const th = this.row1.children[i];
        const cs = parseInt(th.getAttribute('colspan')) || 1;
        if (leafIdx >= count && leafIdx < count + cs) return th;
        count += cs;
      }
      return null;
    }
    let absLeaf = 0;
    for (let i = 0; i < this.row1.children.length; i++) {
      const cell = this.row1.children[i];
      const cs = parseInt(cell.getAttribute('colspan')) || 1;
      if (leafIdx >= absLeaf && leafIdx < absLeaf + cs) return cell;
      absLeaf += cs;
    }
    return null;
  }

  // row1 cell → 그 cell 이 cover 하는 leaf 범위 {start, count}
  // (1단/2단 모두: colspan 누적)
  row1CellLeafRange(row1Cell) {
    this._refresh();
    if (!this.row1 || !row1Cell) return null;
    let start = 0;
    for (let i = 0; i < this.row1.children.length; i++) {
      const c = this.row1.children[i];
      if (c === row1Cell) {
        return { start, count: parseInt(c.getAttribute('colspan')) || 1 };
      }
      start += parseInt(c.getAttribute('colspan')) || 1;
    }
    return null;
  }

  // 2단 전용: row1 cell → row2 (leafTr) 에서의 시작 child idx
  // rs>=2 cell 은 row2 cell 을 consume 안 함 → -1
  row1CellRow2Start(row1Cell) {
    this._refresh();
    if (!this.isTwoRow || !this.row1) return -1;
    let r2 = 0;
    for (let i = 0; i < this.row1.children.length; i++) {
      const c = this.row1.children[i];
      if (c === row1Cell) {
        const rs = parseInt(c.getAttribute('rowspan')) || 1;
        if (rs >= 2) return -1;
        return r2;
      }
      const rs = parseInt(c.getAttribute('rowspan')) || 1;
      if (rs >= 2) continue;
      r2 += parseInt(c.getAttribute('colspan')) || 1;
    }
    return -1;
  }

  // th 가 row1 cell 인가? (1단에서는 leafTr === row1 이므로 항상 true)
  isRow1Cell(th) {
    this._refresh();
    return th && this.row1 && th.parentElement === this.row1;
  }

  // th 가 leafTr cell 인가? (1단에서는 row1 === leafTr 이므로 항상 true)
  isLeafTrCell(th) {
    this._refresh();
    return th && this.leafTr && th.parentElement === this.leafTr;
  }

  // forEachLeafCell: leafTr 의 cell 들을 leafIdx 와 함께 walk
  // 2단의 경우 row1 rs>=2 leaf 는 leafTr 에 cell 이 없으므로 skip (leafIdx 만 증가)
  forEachLeafCell(cb) {
    this._refresh();
    if (!this.isTwoRow) {
      let leafCount = 0;
      for (let i = 0; i < this.leafTr.children.length; i++) {
        const th = this.leafTr.children[i];
        const cs = parseInt(th.getAttribute('colspan')) || 1;
        cb(th, leafCount, cs); // (cell, startLeafIdx, span)
        leafCount += cs;
      }
      return;
    }
    // 2단
    let absLeaf = 0;
    let r2Idx = 0;
    for (let i = 0; i < this.row1.children.length; i++) {
      const cell = this.row1.children[i];
      const rs = parseInt(cell.getAttribute('rowspan')) || 1;
      const cs = parseInt(cell.getAttribute('colspan')) || 1;
      if (rs >= 2) {
        absLeaf += cs;
      } else {
        for (let k = 0; k < cs; k++) {
          const r2Cell = this.leafTr.children[r2Idx + k];
          if (r2Cell) cb(r2Cell, absLeaf + k, 1);
        }
        r2Idx += cs;
        absLeaf += cs;
      }
    }
  }

  // forEachRow1Cell: row1 의 cell 들을 시작 leafIdx + count 와 함께 walk
  forEachRow1Cell(cb) {
    this._refresh();
    if (!this.row1) return;
    let leafCount = 0;
    for (let i = 0; i < this.row1.children.length; i++) {
      const th = this.row1.children[i];
      const cs = parseInt(th.getAttribute('colspan')) || 1;
      cb(th, leafCount, cs); // (cell, startLeafIdx, count)
      leafCount += cs;
    }
  }
}


/* ============================================================
 * 1. setupStickyThead
 * ============================================================
 * thead 를 별도 sticky 테이블로 분리 + colgroup 으로 본문과 너비 동기화.
 * (브라우저의 position:sticky on table-row 렌더 버그 회피)
 *
 * 측정 결과에 클래스 기반 보정 적용:
 *   - col-large            → max(measured, 320) — 상품명·SKU명
 *   - col-medium + cell-clamp-2 (body) → 강제 260 (2줄 wrap)
 *   - col-medium 일반      → clamp(88, measured, 260) (1줄)
 *
 * frozen-l1..N CSS 변수도 같이 set (가로 sticky 누적 offset)
 * ============================================================ */
function setupStickyThead(root = document, opts = {}) {
  const { frozenCount = 0, scrollSelector = '.mp-table-scroll', stickySelector = '.mp-thead-sticky .mp-thead-scroll' } = opts;
  const origTable = root.querySelector(`${scrollSelector} > .mp-table`);
  const stickyScroll = root.querySelector(stickySelector);
  const bodyScroll = root.querySelector(scrollSelector);
  if (!origTable || !stickyScroll || !bodyScroll) return null;

  const origThead = origTable.querySelector('thead');
  if (!origThead) return null;
  if (stickyScroll.querySelector('thead')) return null; // 이미 init

  // 가시성 체크 — 모달처럼 hidden 상태에선 측정값이 0 이라 sticky 구성이 깨짐.
  // 일단 null 리턴, DOM 변경 X. 모달 열릴 때 rebuild 호출하면 정상 측정 후 sticky 구성 가능.
  const containerCheck = bodyScroll.getBoundingClientRect();
  if (containerCheck.width === 0 || containerCheck.height === 0) return null;

  const firstBodyRow = origTable.querySelector('tbody tr');
  // 데이터 행 (cells >= 2 개) 이 있으면 셀 폭을 측정해서 사용.
  // empty state (colspan 단일 cell) 인 경우 colgroup 의 명시 width 를 fallback 사용.
  const hasDataRow = firstBodyRow && firstBodyRow.children.length >= 2;
  const origColgroupExisting = origTable.querySelector('colgroup');
  if (!hasDataRow && !origColgroupExisting) return null;

  // 1) 측정 — 자연 폭. col-spacer 는 자체 width:100% 로 잠긴 상태라 측정값이 부정확하므로 0 으로 처리.
  //    body 폭 + header 폭 둘 다 측정해서 큰 쪽 사용 — 헤더 (텍스트 + sort/filter 아이콘 reserved
  //    영역) 가 body 보다 넓으면 header 기준으로 컬럼 auto-fit. 반대로 body 가 더 넓으면 body 기준.
  let colWidths;
  if (hasDataRow) {
    const bodyCells = Array.from(firstBodyRow.children);
    colWidths = bodyCells.map(td =>
      td.classList && td.classList.contains('col-spacer') ? 0 : Math.round(td.getBoundingClientRect().width)
    );
  } else {
    // 빈 테이블 — colgroup 의 width 사용
    colWidths = Array.from(origColgroupExisting.children).map((col) => {
      const w = parseInt(col.style.width, 10) || parseInt(col.getAttribute('width'), 10) || 0;
      return w;
    });
  }
  // header 폭 보정 — leaf th 의 실측 width 가 body 폭보다 크면 header 기준으로 확장.
  //   col-spacer 는 비교 X.
  const _leafForMeasure = buildLeafHeaders(origThead);
  _leafForMeasure.forEach((th, i) => {
    if (i >= colWidths.length) return;
    if (th.classList && th.classList.contains('col-spacer')) return;
    const headerW = Math.round(th.getBoundingClientRect().width);
    if (headerW > colWidths[i]) colWidths[i] = headerW;
  });


  // 2) 클래스 기반 보정
  const leafs = buildLeafHeaders(origThead);
  leafs.forEach((th, i) => {
    if (i >= colWidths.length) return;
    if (th.classList.contains('col-spacer')) return;       // spacer 보정 X — 아래에서 컨테이너 잔여폭으로 결정
    if (th.classList.contains('col-large')) {
      colWidths[i] = COL_LARGE_MIN; // 강제 320 — 컨텐츠 더 길어도 cell-clamp 으로 잘림
    } else if (th.classList.contains('col-medium')) {
      const td = hasDataRow ? firstBodyRow.children[i] : null;
      if (td && td.querySelector(':scope > .cell-clamp-2')) {
        colWidths[i] = COL_MEDIUM_MAX; // 2줄 wrap 셀은 강제 max
      } else {
        colWidths[i] = Math.max(COL_MEDIUM_MIN, Math.min(colWidths[i], COL_MEDIUM_MAX));
      }
    }
  });

  // col-spacer 처리 — 데이터 컬럼 합계가 컨테이너보다 작으면 차이만큼 spacer 가 채움. 크면 spacer 는 0 (우측 빈 공간 X)
  const containerW = Math.round(bodyScroll.getBoundingClientRect().width);
  const dataWidthSum = colWidths.reduce((a, b) => a + b, 0);
  const spacerIdx = leafs.findIndex(th => th && th.classList && th.classList.contains('col-spacer'));
  if (spacerIdx >= 0) {
    const remaining = containerW - dataWidthSum;
    colWidths[spacerIdx] = remaining > 0 ? remaining : 0;
  }

  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  // 3) frozen 누적 left offset
  let cum = 0;
  for (let i = 0; i < frozenCount; i++) {
    document.documentElement.style.setProperty(`--frozen-l${i + 1}`, cum + 'px');
    cum += (colWidths[i] || 0);
  }
  // --frozen-l-end: frozen 영역 우측 끝 = 비-frozen group cell 의 sticky left 기준점
  document.documentElement.style.setProperty('--frozen-l-end', cum + 'px');

  // 4) sticky thead 별도 테이블 빌드
  const cloneTable = document.createElement('table');
  cloneTable.className = origTable.className;
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

  // thead 를 이동 (clone 아닌 move — 이벤트/ID 보존)
  cloneTable.appendChild(origThead);
  stickyScroll.appendChild(cloneTable);

  // 본문 테이블에도 동일 colgroup + table-layout:fixed
  const origColgroup = cloneColgroup.cloneNode(true);
  origTable.insertBefore(origColgroup, origTable.firstChild);
  origTable.style.tableLayout = 'fixed';
  origTable.style.width = totalWidth + 'px';
  origTable.style.minWidth = totalWidth + 'px';

  // 본문 가로 스크롤 → sticky thead 동기화
  bodyScroll.addEventListener('scroll', () => {
    stickyScroll.scrollLeft = bodyScroll.scrollLeft;
  }, { passive: true });

  return { origTable, cloneTable, origColgroup, cloneColgroup };
}


/* ============================================================
 * 2. setupTableInteractions
 * ============================================================
 * - 헤더 더블클릭 → 컬럼 전체 선택 (setupCellSelection 의 _selectColumn 호출)
 * - 우측 가장자리 핸들 → 컬럼 폭 조절 (총 폭도 함께 update)
 * - 본 헤더 드래그 → 컬럼 reorder (frozen 제외 X — 교차 이동 허용)
 *
 * LeafModel 추상화로 1단/2단 분기 최소화. setupTableInteractions 본문에서
 * isTwoRow 분기는 (1) row1 cell 드래그 등록 (2) drop 시 row1 group swap
 * 분기 — 단 2곳으로 축소.
 * ============================================================ */
function setupTableInteractions(root = document, opts = {}) {
  // frozenCount is `let` so external code (e.g. VOC edit pane) can mutate
  // the boundary at runtime via _scmReorder.setFrozenCount().
  let { frozenCount = 0 } = opts;
  const { scrollSelector = '.mp-table-scroll', stickySelector = '.mp-thead-sticky .mp-thead-scroll' } = opts;
  const origTable = root.querySelector(`${scrollSelector} > .mp-table`);
  if (!origTable) return;
  const stickyScroll = root.querySelector(stickySelector);
  const _cloneTable = stickyScroll && stickyScroll.querySelector('table');
  const _cloneThead = _cloneTable && _cloneTable.querySelector('thead');
  // Sticky mode: clone 이 thead 를 가지고 있음 → clone 을 인터랙션 대상으로
  // No-sticky mode: clone 없음 / 빈 → original thead 를 인터랙션 대상으로
  const usingClone = !!_cloneThead;
  const cloneTable = usingClone ? _cloneTable : origTable;
  const cloneThead = usingClone ? _cloneThead : origTable.querySelector('thead');
  const cloneColgroup = cloneTable.querySelector('colgroup');
  // origColgroup / shadowOrigTable — sticky mode 에서만 따로 sync 대상으로 존재. no-sticky 면 null.
  const origColgroup = usingClone ? origTable.querySelector('colgroup') : null;
  const shadowOrigTable = usingClone ? origTable : null;   // sticky mode 에서 clone 옆 원본 (sync 대상)
  if (!cloneColgroup || !cloneThead) return;
  if (usingClone && !origColgroup) return;   // sticky mode 인데 orig colgroup 없음 — 비정상

  const model = new LeafModel(cloneThead);
  const headers = model.leaves.slice();   // 초기 leaf 배열 (이벤트 등록용 — 순서 변경 후에도 이 ref 들은 유효)

  // ----- 더블클릭 컬럼 선택 (idx 동적 계산) -----
  headers.forEach((th) => {
    if (th.classList.contains('col-spacer') || th.classList.contains('cb-header') || th.classList.contains('cb-col')) return;
    th.addEventListener('dblclick', (e) => {
      if (e.target.classList && e.target.classList.contains('th-resize-handle')) return;
      const tableEl = root.querySelector(`${scrollSelector} .mp-table`);
      if (!tableEl || typeof tableEl._selectColumn !== 'function') return;
      e.preventDefault();
      if (window.getSelection) { try { window.getSelection().removeAllRanges(); } catch (_) {} }
      const currentIdx = model.thLeafIdx(th, false);
      if (currentIdx < 0) return;
      tableEl._selectColumn(currentIdx);
    });
  });

  // ----- resize 핸들 (colIdx 동적 계산) -----
  function attachResizeHandle(th, isRow2) {
    const handle = document.createElement('span');
    handle.className = 'th-resize-handle' + (isRow2 ? ' is-row2' : '');
    handle.setAttribute('aria-label', '컬럼 너비 조절');
    th.appendChild(handle);
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const colIdx = model.thLeafIdx(th, true);
      if (colIdx < 0) return;
      const cloneCol = cloneColgroup.children[colIdx];
      const origCol = origColgroup ? origColgroup.children[colIdx] : null;
      if (!cloneCol) return;
      const startW = parseInt(cloneCol.style.width) || cloneCol.offsetWidth || 100;
      const startTotal = parseInt(cloneTable.style.width) || cloneTable.offsetWidth;
      document.body.style.cursor = 'col-resize';
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const newW = Math.max(RESIZE_MIN, startW + dx);
        const newTotal = startTotal + (newW - startW);
        cloneCol.style.width = newW + 'px';
        if (origCol) origCol.style.width = newW + 'px';
        cloneTable.style.width = newTotal + 'px';
        cloneTable.style.minWidth = newTotal + 'px';
        if (shadowOrigTable) {
          shadowOrigTable.style.width = newTotal + 'px';
          shadowOrigTable.style.minWidth = newTotal + 'px';
        }
      };
      const onUp = () => {
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  headers.forEach((th) => {
    if (th.classList.contains('col-spacer')) return;
    // 2단 thead 의 row2 leaf (= row1 이 아닌 leafTr 의 cell) 만 is-row2 — 1단에선 false
    const inRow2 = model.isTwoRow && th.parentElement === model.leafTr;
    attachResizeHandle(th, inRow2);
  });

  // ----- reorder (default 활성, opts.disableReorder=true 면 비활성화) -----
  if (opts.disableReorder) return;

  // reorderable: 체크박스/spacer 만 차단. 1단 leaf / 2단 row2 leaf 모두 OK
  // (2단 row1 group cell 은 별도 패스 — leafModel.leaves 에는 row1 rs>=2 cell 만 포함됨)
  const isReorderable = (th) => {
    if (!th) return false;
    if (th.classList.contains('col-spacer')) return false;
    if (th.classList.contains('cb-header')) return false;
    if (th.classList.contains('cb-col')) return false;
    if (th.classList.contains('cb-col2')) return false;
    // 2단 leaf 패스: leafTr child 만 (row1 rs>=2 cell 은 위 cb/spacer 검사로 이미 차단된다고 가정).
    // 안전 차원에서 leafTr 가 아니고 row1 도 아닌 element 차단:
    if (model.isTwoRow && th.parentElement !== model.leafTr) return false;
    return true;
  };

  // ----- moveColumn: leaf idx 기반 컬럼 이동 (colgroup + leafTr child + tbody tds) -----
  function moveColumn(from, to) {
    const moveByLeafIdx = (parent) => {
      const node = parent.children[from];
      const target = parent.children[to];
      if (!node || !target) return;
      if (from < to) parent.insertBefore(node, target.nextSibling);
      else parent.insertBefore(node, target);
    };
    moveByLeafIdx(cloneColgroup);
    if (origColgroup && origColgroup !== cloneColgroup) moveByLeafIdx(origColgroup);
    // leafTr — leaf idx → leafTr child idx
    const leafFrom = model.leafIdxToLeafChildIdx(from);
    const leafTo = model.leafIdxToLeafChildIdx(to);
    if (leafFrom >= 0 && leafTo >= 0 && leafFrom !== leafTo) {
      const node = model.leafTr.children[leafFrom];
      const target = model.leafTr.children[leafTo];
      if (node && target) {
        if (leafFrom < leafTo) model.leafTr.insertBefore(node, target.nextSibling);
        else model.leafTr.insertBefore(node, target);
      }
    }
    // tbody tr — leaf idx 와 1:1
    origTable.querySelectorAll('tbody > tr').forEach(tr => moveByLeafIdx(tr));
  }

  // ----- moveRow1Group: 2단 전용. row1 group cell 통째 이동 (산하 row2 leaves + colgroup cols + body tds) -----
  function moveRow1Group(srcRow1Cell, tgtRow1Cell) {
    if (!model.isTwoRow || srcRow1Cell === tgtRow1Cell) return;

    const srcRange = model.row1CellLeafRange(srcRow1Cell);
    const tgtRange = model.row1CellLeafRange(tgtRow1Cell);
    if (!srcRange || !tgtRange) return;

    const srcRs = parseInt(srcRow1Cell.getAttribute('rowspan')) || 1;
    const tgtRs = parseInt(tgtRow1Cell.getAttribute('rowspan')) || 1;
    if (srcRs >= 2 || tgtRs >= 2) return; // rs=2 cell 은 이동 안 함

    const srcRow2Start = model.row1CellRow2Start(srcRow1Cell);
    const tgtRow2Start = model.row1CellRow2Start(tgtRow1Cell);

    const movingForward = srcRange.start < tgtRange.start;

    // 0) 사전 reference 수집 (DOM mutation 후 indices 변해도 reference 는 stable)
    const row2Tr = model.leafTr;
    const row1 = model.row1;
    const srcRow2Cells = [];
    for (let i = 0; i < srcRange.count; i++) {
      srcRow2Cells.push(row2Tr.children[srcRow2Start + i]);
    }
    const srcCloneCols = [];
    for (let i = 0; i < srcRange.count; i++) {
      srcCloneCols.push(cloneColgroup.children[srcRange.start + i]);
    }
    const srcOrigCols = [];
    if (origColgroup && origColgroup !== cloneColgroup) {
      for (let i = 0; i < srcRange.count; i++) {
        srcOrigCols.push(origColgroup.children[srcRange.start + i]);
      }
    }
    const tbodyTrs = Array.from(origTable.querySelectorAll('tbody > tr'));
    const srcBodyTds = tbodyTrs.map(tr => {
      const cells = [];
      for (let i = 0; i < srcRange.count; i++) {
        cells.push(tr.children[srcRange.start + i]);
      }
      return cells;
    });

    // ref 설정 (target 의 위치)
    const row1Ref = movingForward ? tgtRow1Cell.nextSibling : tgtRow1Cell;
    const row2Ref = movingForward
      ? row2Tr.children[tgtRow2Start + tgtRange.count]
      : row2Tr.children[tgtRow2Start];
    const colRefIdx = movingForward ? tgtRange.start + tgtRange.count : tgtRange.start;
    const cloneColRef = cloneColgroup.children[colRefIdx] || null;
    const origColRef = (origColgroup && origColgroup !== cloneColgroup) ? (origColgroup.children[colRefIdx] || null) : null;
    const bodyTdRefs = tbodyTrs.map(tr => tr.children[colRefIdx] || null);

    // 1) row1 cell 이동
    row1.insertBefore(srcRow1Cell, row1Ref);
    // 2) row2 cell 들 이동
    srcRow2Cells.forEach(c => { if (c) row2Tr.insertBefore(c, row2Ref); });
    // 3) colgroup cols (clone + orig) 이동
    srcCloneCols.forEach(c => { if (c) cloneColgroup.insertBefore(c, cloneColRef); });
    if (origColgroup && origColgroup !== cloneColgroup) {
      srcOrigCols.forEach(c => { if (c) origColgroup.insertBefore(c, origColRef); });
    }
    // 4) body td 들 이동 (각 tr 별로)
    tbodyTrs.forEach((tr, idx) => {
      const ref = bodyTdRefs[idx];
      srcBodyTds[idx].forEach(td => { if (td) tr.insertBefore(td, ref); });
    });
  }

  // ----- drag handlers (1단 leaf / 2단 row2 leaf / 2단 row1 group cell 모두 동일 함수) -----
  let dragSrcTh = null;
  let dragSrcIdx = null;       // leaf idx (row1 group cell 일 땐 -1)

  function attachDragHandlers(th) {
    th.draggable = true;
    th.style.cursor = 'grab';
    th.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('th-resize-handle')) { e.preventDefault(); return; }
      dragSrcTh = th;
      const curIdx = model.thLeafIdx(th, false);
      dragSrcIdx = curIdx; // row1 group cell 이면 -1 (leaves 에 없음)
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(curIdx)); } catch (_) {}
      th.classList.add('is-dragging');
    });
    th.addEventListener('dragover', (e) => {
      if (!dragSrcTh) return;
      // 2단: source / target row 매칭 검증
      if (model.isTwoRow) {
        const srcIsRow1 = dragSrcTh.parentElement === model.row1 && dragSrcTh.parentElement !== model.leafTr;
        const tgtIsRow1 = th.parentElement === model.row1 && th.parentElement !== model.leafTr;
        // (1단에선 row1 === leafTr 라 두 plot 모두 false → 그대로 leaf swap)
        if (srcIsRow1 !== tgtIsRow1) return;     // row1 ↔ row2 교차 차단
        if (srcIsRow1) {
          const tgtRs = parseInt(th.getAttribute('rowspan')) || 1;
          if (tgtRs >= 2) return;                // rs=2 cell 은 drop 불가
          if (dragSrcTh === th) return;
        } else {
          // row2 leaf swap 은 같은 row1 parent 안에서만
          const srcParent = model.leafIdxToRow1Cell(model.thLeafIdx(dragSrcTh));
          const tgtParent = model.leafIdxToRow1Cell(model.thLeafIdx(th));
          if (srcParent !== tgtParent) return;
        }
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      Array.from(model.leafTr.children).forEach(h => h.classList.remove('is-drop-target'));
      if (dragSrcTh !== th) th.classList.add('is-drop-target');
    });
    th.addEventListener('dragleave', () => th.classList.remove('is-drop-target'));
    th.addEventListener('drop', (e) => {
      e.preventDefault();
      Array.from(model.leafTr.children).forEach(h => h.classList.remove('is-drop-target'));
      if (!dragSrcTh) return;
      // 2단 + row1 group 끼리 drop → group swap
      if (model.isTwoRow) {
        const srcIsRow1 = dragSrcTh.parentElement === model.row1 && dragSrcTh.parentElement !== model.leafTr;
        const tgtIsRow1 = th.parentElement === model.row1 && th.parentElement !== model.leafTr;
        if (srcIsRow1 !== tgtIsRow1) { dragSrcTh = null; dragSrcIdx = null; return; }
        if (srcIsRow1) {
          const tgtRs = parseInt(th.getAttribute('rowspan')) || 1;
          if (tgtRs >= 2 || dragSrcTh === th) { dragSrcTh = null; dragSrcIdx = null; return; }
          moveRow1Group(dragSrcTh, th);
          refreshFrozenClassesAndOffsets();
          dragSrcTh = null; dragSrcIdx = null;
          return;
        }
        // row2 leaf swap — 같은 row1 parent 제한
        const srcParent = model.leafIdxToRow1Cell(model.thLeafIdx(dragSrcTh));
        const tgtParent = model.leafIdxToRow1Cell(model.thLeafIdx(th));
        if (srcParent !== tgtParent) { dragSrcTh = null; dragSrcIdx = null; return; }
      }
      // leaf swap (1단 + 2단 row2 leaf)
      const targetIdx = model.thLeafIdx(th, false);
      if (dragSrcIdx < 0 || targetIdx < 0 || dragSrcIdx === targetIdx) { dragSrcTh = null; dragSrcIdx = null; return; }
      moveColumn(dragSrcIdx, targetIdx);
      refreshFrozenClassesAndOffsets();
      dragSrcTh = null; dragSrcIdx = null;
    });
    th.addEventListener('dragend', () => {
      th.classList.remove('is-dragging');
      Array.from(model.leafTr.children).forEach(h => h.classList.remove('is-drop-target'));
    });
  }

  // 1) leaf headers (1단 모든 leaf, 2단 row2 leaf + row1 rs>=2 cell)
  headers.forEach((th) => {
    if (!isReorderable(th)) return;
    attachDragHandlers(th);
  });

  // 2) 2단: row1 group cell (rs=1 만 — rs>=2 는 leaf 로 간주, 위에서 처리됨)
  if (model.isTwoRow) {
    Array.from(model.row1.children).forEach(th => {
      const rs = parseInt(th.getAttribute('rowspan')) || 1;
      if (rs >= 2) return;
      if (th.classList.contains('col-spacer')) return;
      if (th.classList.contains('cb-header')) return;
      attachDragHandlers(th);
    });
  }

  // ----- reorder 후 col-frozen-N 클래스 + --frozen-lN offset 재계산 -----
  // model API (forEachLeafCell / forEachRow1Cell) 로 1단/2단 분기 없이 처리
  function refreshFrozenClassesAndOffsets() {
    const FROZEN_CLASSES = [];
    for (let i = 1; i <= 8; i++) FROZEN_CLASSES.push(`col-frozen-${i}`);
    FROZEN_CLASSES.push('col-frozen-group');  // legacy 2단 thead group cell boundary marker
    FROZEN_CLASSES.push('col-frozen-last');   // 마지막 frozen cell boundary marker (border-right 위치)
    const stripFrozen = (cell) => FROZEN_CLASSES.forEach(c => cell.classList.remove(c));

    // 1) colgroup col 들 — leaf idx 와 1:1
    for (let i = 0; i < cloneColgroup.children.length; i++) {
      const cc = cloneColgroup.children[i];
      if (cc) { stripFrozen(cc); if (i < frozenCount) cc.classList.add(`col-frozen-${i + 1}`); }
      if (origColgroup && origColgroup !== cloneColgroup) {
        const oc = origColgroup.children[i];
        if (oc) { stripFrozen(oc); if (i < frozenCount) oc.classList.add(`col-frozen-${i + 1}`); }
      }
    }

    // 2) leafTr (1단 thead 또는 2단 row2) — leaf idx 기반으로 frozen 클래스 부여
    model.forEachLeafCell((cell, leafIdx /*, span */) => {
      stripFrozen(cell);
      if (leafIdx < frozenCount) cell.classList.add(`col-frozen-${leafIdx + 1}`);
    });

    // 2b) 2단 thead: row1 (group row) 도 colspan 누적 기준으로 col-frozen-N 재적용
    //     1단에서는 row1 === leafTr 이라 위 forEachLeafCell 에서 이미 처리됨.
    //     forEachRow1Cell 은 1단/2단 모두 동작하지만, 1단에서는 forEachLeafCell 과 결과가
    //     동일하므로 (cs 기반 walk) skip 해도 무방. 단 forEachLeafCell 은 multi-leaf cell 일 때
    //     leafIdx 가 cell 의 startLeafIdx 이고 col-frozen-N 도 그 시작 leafIdx 기준으로
    //     부여되어 row1 의 cs>1 cell (e.g., cb-header colspan=2) 도 정확히 마킹됨.
    if (model.isTwoRow) {
      model.forEachRow1Cell((cell, leafIdx /*, count */) => {
        stripFrozen(cell);
        if (leafIdx < frozenCount) cell.classList.add(`col-frozen-${leafIdx + 1}`);
      });
    }

    // 3) tbody tr td 들 — leaf idx 와 1:1
    origTable.querySelectorAll('tbody > tr').forEach(tr => {
      for (let i = 0; i < tr.children.length; i++) {
        const td = tr.children[i];
        stripFrozen(td);
        if (i < frozenCount) td.classList.add(`col-frozen-${i + 1}`);
      }
    });

    // 4) --frozen-lN 누적 offset 재계산 (이동 후 frozen 영역 column 폭이 달라졌을 수 있음)
    let cum = 0;
    for (let i = 0; i < frozenCount; i++) {
      document.documentElement.style.setProperty(`--frozen-l${i + 1}`, cum + 'px');
      const col = cloneColgroup.children[i];
      const w = col ? (parseInt(col.style.width) || col.offsetWidth || 0) : 0;
      cum += w;
    }
    // --frozen-l-end: frozen 영역 우측 끝 = 비-frozen group cell 의 sticky left 기준점
    document.documentElement.style.setProperty('--frozen-l-end', cum + 'px');

    // 5) 마지막 frozen cell 에 col-frozen-last 클래스 부여 (boundary 라인 위치)
    if (frozenCount > 0) {
      const lastIdx = frozenCount - 1;
      // colgroup cols / tbody tds — leaf idx 와 1:1
      if (cloneColgroup.children[lastIdx]) cloneColgroup.children[lastIdx].classList.add('col-frozen-last');
      if (origColgroup && origColgroup !== cloneColgroup && origColgroup.children[lastIdx]) {
        origColgroup.children[lastIdx].classList.add('col-frozen-last');
      }
      origTable.querySelectorAll('tbody > tr').forEach(tr => {
        if (tr.children[lastIdx]) tr.children[lastIdx].classList.add('col-frozen-last');
      });

      // leafTr — leaf idx → leafTr child idx (1단/2단 자동 보정)
      const headerLastIdx = model.leafIdxToLeafChildIdx(lastIdx);
      if (headerLastIdx >= 0 && model.leafTr.children[headerLastIdx]) {
        model.leafTr.children[headerLastIdx].classList.add('col-frozen-last');
      }

      // 2단 thead: row1 도 마지막 frozen leaf 가 포함된 cell 에 부여
      // (1단에서는 leafTr === row1 이라 위에서 이미 부여됨)
      if (model.isTwoRow) {
        const row1Cell = model.leafIdxToRow1Cell(lastIdx);
        if (row1Cell) row1Cell.classList.add('col-frozen-last');
      }
    }
  }

  // init 시점에도 col-frozen-last 적용 (boundary 라인이 처음부터 표시되도록)
  refreshFrozenClassesAndOffsets();

  // ----- 외부(예: VOC 편집 패널)에서 reorder 를 트리거할 수 있도록 API 노출 -----
  // cloneTable 에 stamp — VOC iframe 부모가 이 핸들로 정확한 reorder + frozen
  // 재계산까지 한 번에 호출. closure 안의 model / moveColumn / moveRow1Group /
  // refreshFrozenClassesAndOffsets 를 그대로 묶어 외부에서 사용.
  cloneTable._scmReorder = {
    model,
    moveColumn,
    moveRow1Group,
    refreshFrozenClassesAndOffsets,
    // expose frozenCount as a getter so external code reading
    // `_scmReorder.frozenCount` always sees the live value (it can change
    // via setFrozenCount below).
    get frozenCount() { return frozenCount; },
    // Set the frozen boundary to the first N leaves and refresh the
    // col-frozen-* classes + --frozen-lN offsets so sticky positioning
    // matches. Used by VOC's edit pane "고정" leaf toggle.
    setFrozenCount(n) {
      const next = Math.max(0, Math.floor(Number(n) || 0));
      if (next === frozenCount) return;
      frozenCount = next;
      refreshFrozenClassesAndOffsets();
    },
  };
  if (origTable && origTable !== cloneTable) {
    origTable._scmReorder = cloneTable._scmReorder;
  }
}


/* ============================================================
 * 3. setupCellSelection
 * ============================================================
 * - 드래그로 셀 범위 선택 (외곽 4변 라인 + 옅은 블루 bg)
 * - Cmd/Ctrl+C → 선택된 셀 TSV 클립보드 복사
 * - tableEl._selectColumn(c) API 노출 (헤더 더블클릭에서 사용)
 * ============================================================ */
function setupCellSelection(root = document, opts = {}) {
  const { scrollSelector = '.mp-table-scroll' } = opts;
  const tableEl = root.querySelector(`${scrollSelector} .mp-table`);
  if (!tableEl) return;
  tableEl.classList.add('is-cell-selectable');

  let isDragging = false;
  let anchor = null;
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
    tableEl.querySelectorAll('td.cell-selected, td.cell-active').forEach(td => {
      td.classList.remove('cell-selected', 'cell-active', 'sel-top', 'sel-right', 'sel-bottom', 'sel-left');
    });
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
        if (!isSelectable(td)) continue;
        td.classList.add('cell-selected');
        if (r === r1) td.classList.add('sel-top');
        if (r === r2) td.classList.add('sel-bottom');
        if (c === c1) td.classList.add('sel-left');
        if (c === c2) td.classList.add('sel-right');
      }
    }
    const focusTd = tbody.children[focus.r] && tbody.children[focus.r].children[focus.c];
    if (focusTd && isSelectable(focusTd)) focusTd.classList.add('cell-active');
  };

  // ----- 헤더 더블클릭에서 호출되는 API -----
  tableEl._selectColumn = (c) => {
    const tbody = getTbody();
    if (!tbody || tbody.children.length === 0) return;
    const lastIdx = tbody.children.length - 1;
    let firstR = 0;
    while (firstR <= lastIdx && !isSelectable(tbody.children[firstR] && tbody.children[firstR].children[c])) firstR++;
    let lastR = lastIdx;
    while (lastR >= firstR && !isSelectable(tbody.children[lastR] && tbody.children[lastR].children[c])) lastR--;
    if (firstR > lastR) return;
    anchor = { r: firstR, c };
    focus = { r: lastR, c };
    applySelection();
  };

  // ----- 드래그 선택 -----
  tableEl.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    const td = e.target.closest('td');
    if (!isSelectable(td)) return;
    if (e.target.closest('a, button, input, label, .mp-cb')) {
      clearSelection(); anchor = focus = null; return;
    }
    e.preventDefault();
    anchor = getCoord(td); focus = anchor;
    isDragging = true;
    applySelection();
  });

  tableEl.addEventListener('mouseover', (e) => {
    if (!isDragging) return;
    const td = e.target.closest('td');
    if (!isSelectable(td)) return;
    const c = getCoord(td);
    if (c && (!focus || c.r !== focus.r || c.c !== focus.c)) {
      focus = c; applySelection();
    }
  });

  document.addEventListener('mouseup', () => { isDragging = false; });

  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.mp-table')) {
      clearSelection(); anchor = focus = null;
    }
  });

  // ----- Cmd/Ctrl+C → TSV 복사 -----
  document.addEventListener('copy', (e) => {
    const selected = Array.from(tableEl.querySelectorAll('td.cell-selected'));
    if (!selected.length) return;
    const byRow = {};
    selected.forEach(td => {
      const tr = td.parentElement;
      const tbody = tr.parentElement;
      const r = Array.from(tbody.children).indexOf(tr);
      const c = td.cellIndex;
      if (!byRow[r]) byRow[r] = {};
      // input 값 우선
      const inp = td.querySelector('input');
      const text = inp ? (inp.value || '') : (td.innerText || td.textContent || '').replace(/ /g, ' ').trim();
      byRow[r][c] = text;
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
    e.clipboardData.setData('text/plain', lines.join('\n'));
    e.preventDefault();
  });
}


/* ============================================================
 * 4. ensureHost — `.mp-table` 가 wrapper 없이 단독으로 있으면
 *    .mp-table-host > .mp-thead-sticky + .mp-table-scroll 구조로 자동 wrapping.
 *    이미 wrapper 안에 있으면 기존 host 반환.
 * ============================================================ */
function ensureHost(table) {
  if (!table || !table.classList || !table.classList.contains('mp-table')) return null;
  // data-scm-no-sticky 면 mp-thead-sticky div 를 아예 생성 안 함 (::before 검정 라인 잔재 방지)
  const noSticky = table.dataset.scmNoSticky != null && table.dataset.scmNoSticky !== 'false';

  // 이미 wrapper 안인 경우
  const existingScroll = table.closest('.mp-table-scroll');
  if (existingScroll) {
    const existingHost = existingScroll.closest('.mp-table-host');
    if (existingHost) return existingHost;
    // mp-table-scroll 만 있고 host 없음 → host 로 감싸기
    const h = document.createElement('div');
    h.className = 'mp-table-host';
    existingScroll.parentNode.insertBefore(h, existingScroll);
    h.appendChild(existingScroll);
    // sticky thead 컨테이너 추가 — no-sticky 가 아닐 때만
    if (!noSticky && !h.querySelector('.mp-thead-sticky')) {
      const sticky = document.createElement('div');
      sticky.className = 'mp-thead-sticky';
      const inner = document.createElement('div');
      inner.className = 'mp-thead-scroll';
      sticky.appendChild(inner);
      h.insertBefore(sticky, existingScroll);
    }
    return h;
  }

  // wrapper 전혀 없음 → host > [sticky] + scroll > table 자동 생성
  const host = document.createElement('div');
  host.className = 'mp-table-host';

  if (!noSticky) {
    const stickyOuter = document.createElement('div');
    stickyOuter.className = 'mp-thead-sticky';
    const stickyInner = document.createElement('div');
    stickyInner.className = 'mp-thead-scroll';
    stickyOuter.appendChild(stickyInner);
    host.appendChild(stickyOuter);
  }

  const scroll = document.createElement('div');
  scroll.className = 'mp-table-scroll';

  const parent = table.parentNode;
  if (!parent) return null;
  const next = table.nextSibling;
  parent.removeChild(table);

  scroll.appendChild(table);
  host.appendChild(scroll);

  if (next) parent.insertBefore(host, next);
  else parent.appendChild(host);

  return host;
}

function getTableOpts(table, baseOpts) {
  // 테이블별 옵션 — data-scm-frozen 으로 frozenCount 오버라이드 가능
  const dsFrozen = table.dataset && table.dataset.scmFrozen;
  const frozenCount = dsFrozen != null ? parseInt(dsFrozen, 10) || 0 : (baseOpts.frozenCount || 0);
  return { ...baseOpts, frozenCount };
}

function initOneTable(table, baseOpts) {
  if (!table || table.dataset.scmInited === '1') return;
  if (table.dataset.scmSkipInit != null && table.dataset.scmSkipInit !== 'false') return;
  const host = ensureHost(table);
  if (!host) return;
  const opts = getTableOpts(table, baseOpts);

  // Sticky thead — 데이터 리스트 페이지처럼 가시 + 충분한 scroll 컨텍스트에서 동작.
  //  • data-scm-no-sticky 명시 시 → 항상 skip (interactions 는 원본 thead 에 부착)
  //  • 그 외에는 setupStickyThead 가 visibility 체크로 hidden 시 null 리턴
  //    (모달 hidden 시 init 호출 → null 리턴 → inited 미마킹 → 모달 열림 시 재호출)
  const noSticky = table.dataset.scmNoSticky != null && table.dataset.scmNoSticky !== 'false';
  let stickyOk = false;
  if (!noSticky) {
    const stickyResult = setupStickyThead(host, opts);
    stickyOk = !!stickyResult;
    // sticky 시도했으나 실패 (hidden) — inited 마킹 안 하고 다음 재호출 대기
    if (!stickyOk && !noSticky) return;
  }

  table.dataset.scmInited = '1';
  setupTableInteractions(host, opts);
  setupCellSelection(host, opts);
}

function rebuildOneTable(table, baseOpts) {
  // 이미 init 된 테이블을 다시 측정/재구성 (예: 모달 열릴 때)
  if (!table) return;
  table.dataset.scmInited = '';  // 플래그 초기화
  // sticky thead 의 thead 복제본 제거 — 다시 생성되도록
  const host = table.closest('.mp-table-host');
  if (host) {
    const stickyInner = host.querySelector('.mp-thead-sticky .mp-thead-scroll');
    if (stickyInner) stickyInner.innerHTML = '';
  }
  initOneTable(table, baseOpts);
}

/* ============================================================
 * 5. SCMTable.init — 모든 .mp-table 자동 감지 + 일괄 초기화
 *    각 테이블은 wrapper 없으면 자동 생성되고 sticky/resize/reorder/cell-select 적용.
 *    페이지에서 SCMTable.init() 한 번만 호출하면 끝.
 *    동적으로 추가된 테이블은 SCMTable.init() 재호출 또는 rebuild 사용.
 * ============================================================ */
const SCMTable = {
  init(opts = {}) {
    const root = opts.root || document;
    const tables = Array.from(root.querySelectorAll('.mp-table'));
    tables.forEach((table) => initOneTable(table, opts));
  },
  initOne: initOneTable,
  rebuild(tableOrSelector, opts = {}) {
    let table = tableOrSelector;
    if (typeof tableOrSelector === 'string') table = document.querySelector(tableOrSelector);
    rebuildOneTable(table, opts);
  },
  rebuildAll(opts = {}) {
    const root = opts.root || document;
    Array.from(root.querySelectorAll('.mp-table')).forEach((t) => rebuildOneTable(t, opts));
  },
  ensureHost,
  setupStickyThead,
  setupTableInteractions,
  setupCellSelection,
  buildLeafHeaders,
  LeafModel,
};

// 글로벌 노출 (script 태그 직접 사용)
if (typeof window !== 'undefined') {
  window.SCMTable = SCMTable;
}
