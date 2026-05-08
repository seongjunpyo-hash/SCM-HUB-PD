/* ============================================================
 * scm-column-more-menu — 컬럼 ⋮ (more-ic) 클릭 → 액션 메뉴 popover
 * ------------------------------------------------------------
 * 사용:
 *   SCM.columnMoreMenu.mount({
 *     scope: document,
 *     tableSelector: '.mp-table-scroll .mp-table',
 *     onAction: (action, ctx) => { ... }   // (옵션) custom 처리
 *   });
 *
 * 처리 액션:
 *   sort-asc / sort-desc / sort-reset  → SCM.tableSort 와 동기 (sort-ic 도 함께 갱신)
 *   freeze-left / freeze-right / freeze-none → 토스트 (구현 보류)
 *   hide / unhide                     → 컬럼 숨김/해제
 * ============================================================ */
(function (root) {
  function buildMenu() {
    var el = document.createElement('div');
    el.className = 'scm-column-more-menu';
    el.setAttribute('hidden', '');
    el.innerHTML =
      '<ul class="scm-column-more-menu__group" data-group="sort">' +
        item('sort-asc',    'ic-sort-asc',  '오름차순 정렬') +
        item('sort-desc',   'ic-sort-desc', '내림차순 정렬') +
        item('sort-reset',  '',             '정렬 해제') +
      '</ul>' +
      '<ul class="scm-column-more-menu__group" data-group="freeze">' +
        item('freeze-left',  'ic-pin-left',  '컬럼 좌측 고정') +
        item('freeze-right', 'ic-pin-right', '컬럼 우측 고정') +
        item('freeze-none',  '',             '컬럼 고정 해제') +
      '</ul>' +
      '<ul class="scm-column-more-menu__group" data-group="visibility">' +
        item('hide',   'ic-eye-off', '컬럼 숨기기') +
        item('unhide', 'ic-eye',     '컬럼 숨기기 해제') +
      '</ul>';
    document.body.appendChild(el);
    return el;
  }
  function item(action, iconId, label) {
    var iconHtml = iconId
      ? '<span class="scm-column-more-menu__icon"><svg viewBox="0 0 20 20" aria-hidden="true"><use href="#' + iconId + '"/></svg></span>'
      : '<span class="scm-column-more-menu__icon scm-column-more-menu__icon--placeholder"></span>';
    return '<li class="scm-column-more-menu__item" data-action="' + action + '">' +
             iconHtml +
             '<span>' + label + '</span>' +
           '</li>';
  }

  function getThColIndex(th) {
    var tr = th.parentElement;
    if (!tr) return -1;
    return Array.prototype.indexOf.call(tr.children, th);
  }
  function findAllThs(scope, tableSelector) {
    var out = [];
    var origThead = scope.querySelector(tableSelector + ' thead');
    var stickyThead = scope.querySelector('.mp-thead-sticky .mp-thead-scroll thead');
    [origThead, stickyThead].forEach(function (thead) {
      if (!thead) return;
      var rows = thead.querySelectorAll('tr');
      var leaf = rows[rows.length - 1];
      if (leaf) Array.prototype.forEach.call(leaf.children, function (cell) { out.push(cell); });
    });
    return out;
  }

  function mount(opts) {
    opts = opts || {};
    var scope = opts.scope || document;
    var tableSelector = opts.tableSelector || '.mp-table-scroll .mp-table';
    var menuEl = buildMenu();
    var anchorTh = null;

    function open(th) {
      anchorTh = th;
      anchorColIndex = getThColIndex(th);
      menuEl.removeAttribute('hidden');
      reposition();
      // 외부 클릭 닫기 — 다음 frame 부터 리스닝
      setTimeout(function () { document.addEventListener('click', onOutside, true); }, 0);
      // 스크롤 / 리사이즈 시 popover 가 아이콘 따라 이동
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onScroll);
    }
    function close() {
      menuEl.setAttribute('hidden', '');
      anchorTh = null;
      anchorColIndex = -1;
      document.removeEventListener('click', onOutside, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    }
    function onOutside(e) {
      if (menuEl.contains(e.target)) return;
      // more-ic 클릭은 mount 의 onClick 이 토글 처리 — outside close 제외
      if (e.target.closest && e.target.closest('.more-ic')) return;
      close();
    }
    function onScroll() {
      if (!anchorTh || menuEl.hasAttribute('hidden')) return;
      reposition();
    }
    function reposition() {
      if (!anchorTh) return;
      var moreIcon = anchorTh.querySelector('.more-ic');
      var anchorRect = moreIcon ? moreIcon.getBoundingClientRect() : anchorTh.getBoundingClientRect();
      var menuRect = menuEl.getBoundingClientRect();
      // 아이콘 하단 8px 아래 + 가로 가운데 정렬
      var top = anchorRect.bottom + 8;
      var left = anchorRect.left + anchorRect.width / 2 - menuRect.width / 2;
      if (left < 8) left = 8;
      if (left + menuRect.width > window.innerWidth - 8) left = window.innerWidth - menuRect.width - 8;
      // 아래로 넘치면 위로 띄우기
      if (top + menuRect.height > window.innerHeight - 8) {
        top = anchorRect.top - menuRect.height - 8;
      }
      menuEl.style.top = top + 'px';
      menuEl.style.left = left + 'px';
    }
    var anchorColIndex = -1;

    // ----- 액션 처리 -----
    function applySortFromMenu(dir) {
      // dir: 'asc' | 'desc' | ''
      if (!anchorTh) return;
      var colIndex = getThColIndex(anchorTh);
      // 모든 sort-ic 와 data-sort 동기화
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
      // tbody 재정렬
      var tableEl = scope.querySelector(tableSelector);
      var tbody = tableEl ? tableEl.querySelector('tbody') : null;
      if (!tbody) return;
      var trs = Array.prototype.slice.call(tbody.children);
      var indexed = trs.map(function (tr, i) {
        var td = tr.children[colIndex];
        return { tr: tr, i: i, val: td ? (td.textContent || '').trim() : '' };
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
          var aE = !a.val || a.val === '-';
          var bE = !b.val || b.val === '-';
          if (aE && bE) return 0;
          if (aE) return 1;
          if (bE) return -1;
          var na = Number(String(a.val).replace(/[,\s]/g, ''));
          var nb = Number(String(b.val).replace(/[,\s]/g, ''));
          var c = (isFinite(na) && isFinite(nb)) ? (na - nb) : String(a.val).localeCompare(String(b.val), 'ko');
          c = dir === 'desc' ? -c : c;
          return c !== 0 ? c : a.i - b.i;
        });
      }
      var frag = document.createDocumentFragment();
      indexed.forEach(function (it) { frag.appendChild(it.tr); });
      tbody.appendChild(frag);
    }

    // ----- 컬럼 셀 모두 수집 (origin thead / sticky thead / tbody) -----
    function getColumnCells(colIndex) {
      var tableEl = scope.querySelector(tableSelector);
      if (!tableEl) return [];
      var roots = [
        tableEl.querySelector('thead'),
        tableEl.querySelector('tbody'),
        scope.querySelector('.mp-thead-sticky .mp-thead-scroll thead'),
      ];
      var cells = [];
      roots.forEach(function (r) {
        if (!r) return;
        r.querySelectorAll('tr').forEach(function (tr) {
          var c = tr.children[colIndex];
          if (c) cells.push(c);
        });
      });
      return cells;
    }
    function getColgroupCols(colIndex) {
      var tableEl = scope.querySelector(tableSelector);
      var origCols = tableEl ? tableEl.querySelectorAll('colgroup col') : [];
      var stickyCols = scope.querySelectorAll('.mp-thead-sticky .mp-thead-scroll table colgroup col');
      var out = [];
      if (origCols[colIndex]) out.push(origCols[colIndex]);
      if (stickyCols[colIndex]) out.push(stickyCols[colIndex]);
      return out;
    }

    // ----- 숨김 / 해제 -----
    function setColumnVisibility(colIndex, hide) {
      getColgroupCols(colIndex).forEach(function (col) { col.style.display = hide ? 'none' : ''; });
      getColumnCells(colIndex).forEach(function (c) { c.style.display = hide ? 'none' : ''; });
      if (root.SCM && root.SCM.toast) {
        root.SCM.toast.show({ variant: 'info', title: hide ? '컬럼 숨김' : '컬럼 표시', desc: '' });
      }
    }

    // ----- 좌측 / 우측 고정 / 해제 -----
    function setColumnFreeze(colIndex, side) {
      // side: 'left' | 'right' | 'none'
      var cells = getColumnCells(colIndex);
      cells.forEach(function (c) {
        if (side === 'none') {
          c.style.position = '';
          c.style.left = '';
          c.style.right = '';
          c.style.zIndex = '';
          c.style.boxShadow = '';
          c.removeAttribute('data-col-frozen');
        } else {
          c.style.position = 'sticky';
          c.style.zIndex = '4';
          if (!c.style.background) c.style.background = '#fff';
          if (side === 'left') {
            c.style.left = '0';
            c.style.right = '';
            c.style.boxShadow = '2px 0 4px rgba(0,0,0,0.04)';
          } else {
            c.style.right = '0';
            c.style.left = '';
            c.style.boxShadow = '-2px 0 4px rgba(0,0,0,0.04)';
          }
          c.setAttribute('data-col-frozen', side);
        }
      });
      // th 에 data-col-frozen-side 토글 — CSS 가 more-ic 컬러 변경에 사용
      getColumnThs(colIndex).forEach(function (th) {
        if (side === 'none') th.removeAttribute('data-col-frozen-side');
        else th.setAttribute('data-col-frozen-side', side);
      });
      if (root.SCM && root.SCM.toast) {
        var msg = side === 'left' ? '컬럼 좌측 고정' : (side === 'right' ? '컬럼 우측 고정' : '컬럼 고정 해제');
        root.SCM.toast.show({ variant: 'info', title: msg, desc: '' });
      }
    }
    function getColumnThs(colIndex) {
      var out = [];
      var theads = [
        scope.querySelector(tableSelector + ' thead'),
        scope.querySelector('.mp-thead-sticky .mp-thead-scroll thead'),
      ];
      theads.forEach(function (thead) {
        if (!thead) return;
        var rows = thead.querySelectorAll('tr');
        var leaf = rows[rows.length - 1];
        if (leaf && leaf.children[colIndex]) out.push(leaf.children[colIndex]);
      });
      return out;
    }

    menuEl.addEventListener('click', function (e) {
      var li = e.target.closest('.scm-column-more-menu__item');
      if (!li) return;
      var action = li.getAttribute('data-action');
      var colIndex = anchorTh ? getThColIndex(anchorTh) : -1;
      var th = anchorTh;
      close();
      if (typeof opts.onAction === 'function') {
        var handled = opts.onAction(action, { th: th, colIndex: colIndex });
        if (handled === true) return;
      }
      switch (action) {
        case 'sort-asc':    applySortFromMenu('asc'); break;
        case 'sort-desc':   applySortFromMenu('desc'); break;
        case 'sort-reset':  applySortFromMenu(''); break;
        case 'hide':        setColumnVisibility(colIndex, true); break;
        case 'unhide':      setColumnVisibility(colIndex, false); break;
        case 'freeze-left': setColumnFreeze(colIndex, 'left'); break;
        case 'freeze-right':setColumnFreeze(colIndex, 'right'); break;
        case 'freeze-none': setColumnFreeze(colIndex, 'none'); break;
      }
    });

    // more-ic 클릭 → 메뉴 오픈/토글
    function onClick(e) {
      var moreIcon = e.target.closest && e.target.closest('.more-ic');
      if (!moreIcon) return;
      var th = moreIcon.closest('th');
      if (!th) return;
      if (!th.closest(tableSelector + ' thead, .mp-thead-sticky thead')) return;
      e.preventDefault();
      e.stopPropagation();
      var clickedColIndex = getThColIndex(th);
      var isOpen = !menuEl.hasAttribute('hidden');
      // 같은 컬럼 (origin/sticky 무관) 재클릭 시 토글 close, 다른 컬럼이면 즉시 reopen
      if (isOpen && clickedColIndex === anchorColIndex) {
        close();
        return;
      }
      if (isOpen) close();
      open(th);
    }
    scope.addEventListener('click', onClick);

    return {
      close: close,
      destroy: function () {
        scope.removeEventListener('click', onClick);
        if (menuEl.parentNode) menuEl.parentNode.removeChild(menuEl);
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.columnMoreMenu = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
