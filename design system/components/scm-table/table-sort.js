/* ============================================================
 * scm-table table-sort — column 헤더 클릭 → asc/desc/default 토글 + tbody 행 재정렬
 * ------------------------------------------------------------
 * 사용:
 *   SCM.tableSort.mount({
 *     scope: document,                       // 기본: document
 *     tableSelector: '.mp-table-scroll .mp-table',  // 정렬 대상 테이블 (tbody 보유)
 *   });
 *
 * 동작:
 *   - 테이블의 모든 sort-ic (icon) 클릭 시 cycle: '' → 'asc' → 'desc' → '' 반복
 *   - .mp-thead-sticky 의 cloned thead 와 .mp-table-scroll 의 source thead 양쪽에 있는
 *     동일 column index 의 sort-ic 모두 동기화 (icon swap + data-sort attr)
 *   - tbody 의 TR 들을 해당 column 의 cell text 기준으로 재정렬
 *   - filter 로 hidden 처리된 행도 함께 재정렬 (DOM 순서만 바뀜, display 는 유지)
 *   - 정렬 비교: 빈값/'-' 은 항상 마지막. 양쪽 다 숫자면 숫자 비교, 아니면 한국어 locale 문자 비교.
 * ============================================================ */
(function (root) {
  function parseNumOrNull(s) {
    if (s == null) return null;
    var t = String(s).replace(/[,\s]/g, '').trim();
    if (t === '' || t === '-') return null;
    var n = Number(t);
    return isFinite(n) ? n : null;
  }

  function compareValues(a, b, dir) {
    var aEmpty = (a == null || a === '' || a === '-');
    var bEmpty = (b == null || b === '' || b === '-');
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    var na = parseNumOrNull(a);
    var nb = parseNumOrNull(b);
    var cmp;
    if (na != null && nb != null) cmp = na - nb;
    else cmp = String(a).localeCompare(String(b), 'ko');
    return dir === 'desc' ? -cmp : cmp;
  }

  function getCellText(tr, colIndex) {
    var td = tr.children[colIndex];
    if (!td) return '';
    return (td.textContent || '').trim();
  }

  function getThColIndex(th) {
    // th 의 부모 tr 안에서의 인덱스
    var tr = th.parentElement;
    if (!tr) return -1;
    return Array.prototype.indexOf.call(tr.children, th);
  }

  function findTableScope(th, scope, tableSelector) {
    // 클릭된 th 가 sticky thead clone 이든 원본 thead 든, 같은 페이지의 tbody 보유 테이블 찾기
    return scope.querySelector(tableSelector);
  }

  function findAllThs(scope, tableSelector) {
    // 원본 thead + sticky cloned thead 양쪽의 leaf row th 들 (column index 동기화용)
    var out = [];
    var origThead = scope.querySelector(tableSelector + ' thead');
    var stickyThead = scope.querySelector('.mp-thead-sticky .mp-thead-scroll thead');
    [origThead, stickyThead].forEach(function (th) {
      if (!th) return;
      var rows = th.querySelectorAll('tr');
      var leaf = rows[rows.length - 1];
      if (leaf) Array.prototype.forEach.call(leaf.children, function (cell) { out.push(cell); });
    });
    return out;
  }

  function mount(opts) {
    opts = opts || {};
    var scope = opts.scope || document;
    var tableSelector = opts.tableSelector || '.mp-table-scroll .mp-table';
    var tableEl = scope.querySelector(tableSelector);
    if (!tableEl) return null;
    var tbody = tableEl.querySelector('tbody');
    if (!tbody) return null;

    // 초기: 각 TR 에 원본 순서 인덱스 저장 (default 복원용)
    function reindex() {
      Array.prototype.forEach.call(tbody.children, function (tr, i) {
        tr.setAttribute('data-original-index', String(i));
      });
    }
    reindex();

    function applySort(colIndex, dir) {
      var trs = Array.prototype.slice.call(tbody.children);
      var indexed = trs.map(function (tr, i) {
        return { tr: tr, i: i, val: getCellText(tr, colIndex) };
      });
      if (dir === '') {
        indexed.sort(function (a, b) {
          var oa = parseInt(a.tr.getAttribute('data-original-index'), 10);
          var ob = parseInt(b.tr.getAttribute('data-original-index'), 10);
          if (isNaN(oa) || isNaN(ob)) return a.i - b.i;
          return oa - ob;
        });
      } else {
        indexed.sort(function (a, b) {
          var c = compareValues(a.val, b.val, dir);
          return c !== 0 ? c : a.i - b.i;
        });
      }
      var frag = document.createDocumentFragment();
      indexed.forEach(function (it) { frag.appendChild(it.tr); });
      tbody.appendChild(frag);
    }

    function updateAllIcons(colIndex, dir) {
      // 원본 + sticky 양쪽 모든 leaf row th 의 같은 column index 만 업데이트, 나머지는 default 로 복귀
      var allThs = findAllThs(scope, tableSelector);
      allThs.forEach(function (th) {
        var i = getThColIndex(th);
        var sortIcon = th.querySelector('.sort-ic');
        if (!sortIcon) return;
        var useEl = sortIcon.querySelector('use');
        if (i === colIndex && dir !== '') {
          th.setAttribute('data-sort', dir);
          if (useEl) useEl.setAttribute('href', dir === 'asc' ? '#ic-sort-asc' : '#ic-sort-desc');
        } else {
          th.removeAttribute('data-sort');
          if (useEl) useEl.setAttribute('href', '#ic-arrowUpDown');
        }
      });
    }

    // document delegation — sort-ic 직접 클릭만 처리 (th 의 다른 기능과 충돌 방지)
    function onClick(e) {
      // sort-ic 자체 (또는 그 내부 svg/use) 가 클릭된 경우만
      var sortIcon = e.target.closest && e.target.closest('.sort-ic');
      if (!sortIcon) return;
      var th = sortIcon.closest('th');
      if (!th) return;
      // 이 테이블 / sticky 와 관련된 thead 인지 확인
      if (!th.closest(tableSelector + ' thead, .mp-thead-sticky thead')) return;

      // 다른 th 기능 (dblclick 컬럼 선택, resize 등) 으로 번지지 않도록 차단
      e.preventDefault();
      e.stopPropagation();

      var colIndex = getThColIndex(th);
      if (colIndex < 0) return;
      var cur = th.getAttribute('data-sort') || '';
      var next = cur === '' ? 'asc' : (cur === 'asc' ? 'desc' : '');
      updateAllIcons(colIndex, next);
      applySort(colIndex, next);
      if (typeof opts.onSort === 'function') opts.onSort(colIndex, next, th);
    }

    function onDblClick(e) {
      // sort-ic 더블클릭 시 th 의 컬럼 선택 동작 차단
      if (e.target.closest && e.target.closest('.sort-ic')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    scope.addEventListener('click', onClick);
    scope.addEventListener('dblclick', onDblClick, true);   // capture — th 의 dblclick 보다 먼저

    return {
      reindex: reindex,
      reset: function () {
        updateAllIcons(-1, '');     // 모두 default 로
        applySort(0, '');
      },
      destroy: function () {
        scope.removeEventListener('click', onClick);
        scope.removeEventListener('dblclick', onDblClick, true);
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.tableSort = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
