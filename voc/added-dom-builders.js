/* VOC 추가 DOM 빌더 — voc/index.html 의 편집 미리보기 + dev-export.js 의
 * standalone 데모 적용 양쪽이 단일 source 로 사용. window.SCM_VOC_BUILDERS
 * 로 노출.
 *
 * 이전엔 voc 와 dev-export 에 동일 로직이 두 벌로 복제돼 있어 한 쪽만
 * 수정하면 drift 가 발생 (PR #132 의 withCheck/withNo 추가, PR #126 의
 * height 갱신 등 모두 두 군데 동시 수정 필요했음).
 *
 * 외부 의존: 환경별 escapeHtml. 안전하게 파라미터로 받음.
 */
(function (root) {
  'use strict';

  function _escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---- (1) 추가 테이블 HTML 빌더 ----
  // 1단/2단 thead, withCheck (cb-col), withNo (col-no) 옵션 지원.
  // 호출처: voc applyAddedTables, dev-export _applyAddedTables.
  function buildAddedTableHTML(t) {
    const klass = `voc-added-table-${t.id}`;
    const cellStyle = 'min-width:120px;width:120px;padding:12px 16px;';
    const safeLabel = _escapeHtml(t.label || '새 테이블');
    const withCheck = !!t.withCheck;
    const withNo = !!t.withNo;
    // 앵커 컬럼 markup — sku-management 와 동일 패턴.
    const cbHeadCell = `<th class="cb-col"${t.type === 'grouped' ? ' rowspan="2"' : ''}><span class="scm-checkbox" role="checkbox" aria-checked="false" tabindex="0" aria-label="전체 선택"></span></th>`;
    const noHeadCell = `<th class="col-auto col-no"${t.type === 'grouped' ? ' rowspan="2"' : ''}>No</th>`;
    const cbBodyCell = '<td class="cb-col"><span class="scm-checkbox" role="checkbox" aria-checked="false" tabindex="0" aria-label="선택"></span></td>';
    const headAnchorPrefix = (withCheck ? cbHeadCell : '') + (withNo ? noHeadCell : '');
    const cgAnchor = (withCheck ? '<col style="width:36px"/>' : '') + (withNo ? '<col style="width:48px"/>' : '');
    const colgroup = `<colgroup>${cgAnchor}<col style="width:120px"/><col style="width:120px"/><col class="col-spacer" data-empty="true"/></colgroup>`;
    let thead;
    if (t.type === 'grouped') {
      thead = '<thead>'
        + '<tr class="group-row">'
        +   headAnchorPrefix
        +   `<th colspan="2" style="${cellStyle}">${safeLabel} 그룹</th>`
        +   '<th class="col-spacer" data-empty="true" rowspan="2" aria-hidden="true"></th>'
        + '</tr>'
        + '<tr>'
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 1</div></th>`
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 2</div></th>`
        + '</tr>'
        + '</thead>';
    } else {
      thead = '<thead>'
        + '<tr>'
        +   headAnchorPrefix
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 1</div></th>`
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 2</div></th>`
        +   '<th class="col-spacer" data-empty="true" aria-hidden="true"></th>'
        + '</tr>'
        + '</thead>';
    }
    const tbodyRow = (n) => '<tr>'
      +   (withCheck ? cbBodyCell : '')
      +   (withNo ? `<td class="col-auto col-no">${n}</td>` : '')
      +   `<td style="${cellStyle}">—</td>`
      +   `<td style="${cellStyle}">—</td>`
      +   '<td class="col-spacer" data-empty="true"></td>'
      + '</tr>';
    const tbody = `<tbody>${tbodyRow(1)}${tbodyRow(2)}${tbodyRow(3)}</tbody>`;
    return `<section class="scm-page-section scm-voc-added-table ${klass}" id="voc-added-table-${t.id}">`
      +   `<div class="scm-page-section__title">${safeLabel}</div>`
      +   '<div class="mp-table-host">'
      +     '<div class="mp-table-scroll">'
      +       `<table class="mp-table">${colgroup}${thead}${tbody}</table>`
      +     '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- (2) 필터 칩 wrapper picker ----
  // 추가 필터 inject / reorder 시 사용. .scm-filter-overflow__track 우선 —
  // 첫 칩이 .scm-filter-group (display:inline-flex; gap:0 — 인접 칩 시각적
  // 연결용) 안에 있을 때 그걸 wrapper 로 잡으면 모든 칩이 group 으로 들어가
  // gap=0 으로 flush 붙어 보이는 버그가 있었음 (PR #132 fix).
  function pickFilterChipWrapper(filterBar) {
    if (!filterBar) return null;
    const track = filterBar.querySelector('.scm-filter-overflow__track');
    if (track) return track;
    const realChip = filterBar.querySelector(
      '.scm-filter-select[data-mp-filter]:not(.scm-voc-added-filter)'
    );
    return (realChip && realChip.parentElement) || filterBar.firstElementChild || filterBar;
  }

  root.SCM_VOC_BUILDERS = {
    buildAddedTableHTML: buildAddedTableHTML,
    pickFilterChipWrapper: pickFilterChipWrapper,
  };
})(typeof window !== 'undefined' ? window : globalThis);
