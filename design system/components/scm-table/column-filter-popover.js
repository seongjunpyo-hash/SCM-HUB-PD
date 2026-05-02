/* ============================================================
 * scm-column-filter-popover — 컬럼 filter-ic 클릭 → 코드 입력 popover
 * ------------------------------------------------------------
 * 사용:
 *   SCM.columnFilterPopover.mount({
 *     scope: document,
 *     tableSelector: '.mp-table-scroll .mp-table',
 *     codeMax: 999,                              // 최대 라인 (default 999)
 *     placeholder: '값을 줄바꿈으로 구분해 입력', // textarea placeholder
 *     helper: '여러 값은 줄바꿈으로 구분',         // helper text
 *   });
 *
 * 동작:
 *   - filter-ic 클릭 시 해당 column 위에 popover 오픈
 *   - 입력값(줄바꿈 구분) 의 1+ 줄에 매칭되는 행만 표시 (부분 매칭, 대소문자 무시)
 *   - '적용' 클릭 시 매칭되는 행만 보이고 popover 닫힘 + filter-ic 가 'is-active'
 *   - '초기화' 클릭 시 textarea 비우고 컬럼 필터 해제 (해당 column 의 모든 행 다시 표시)
 *   - 외부 클릭 시 닫힘 (변경사항 미적용)
 * ============================================================ */
(function (root) {
  // colIndex → 입력값 저장
  function buildPopover(opts) {
    var el = document.createElement('div');
    el.className = 'scm-column-filter-popover';
    el.setAttribute('hidden', '');
    el.innerHTML =
      '<div class="scm-column-filter-popover__field">' +
        '<div class="scm-column-filter-popover__textarea">' +
          '<textarea data-input placeholder="' + (opts.placeholder || '필터하실 값 입력') + '"></textarea>' +
          '<span class="scm-column-filter-popover__counter"><strong data-count>0</strong>&nbsp;/&nbsp;' + (opts.codeMax || 999) + '</span>' +
        '</div>' +
        '<div class="scm-column-filter-popover__helper">' + (opts.helper || '값을 줄바꿈으로 구분해 입력') + '</div>' +
      '</div>' +
      '<div class="scm-column-filter-popover__footer">' +
        '<button type="button" class="scm-column-filter-popover__reset" data-reset>초기화</button>' +
        '<button type="button" class="scm-column-filter-popover__apply" data-apply>적용</button>' +
      '</div>';
    document.body.appendChild(el);
    return el;
  }

  function getThColIndex(th) {
    var tr = th.parentElement;
    if (!tr) return -1;
    return Array.prototype.indexOf.call(tr.children, th);
  }

  function findFilterIcsForCol(scope, tableSelector, colIndex) {
    var out = [];
    var theads = [scope.querySelector(tableSelector + ' thead'), scope.querySelector('.mp-thead-sticky .mp-thead-scroll thead')];
    theads.forEach(function (thead) {
      if (!thead) return;
      var rows = thead.querySelectorAll('tr');
      var leaf = rows[rows.length - 1];
      if (!leaf) return;
      var th = leaf.children[colIndex];
      if (!th) return;
      var fi = th.querySelector('.filter-ic');
      if (fi) out.push(fi);
    });
    return out;
  }

  function mount(opts) {
    opts = opts || {};
    var scope = opts.scope || document;
    var tableSelector = opts.tableSelector || '.mp-table-scroll .mp-table';
    var codeMax = opts.codeMax || 999;

    var popoverEl = buildPopover({ placeholder: opts.placeholder, helper: opts.helper, codeMax: codeMax });
    var taEl = popoverEl.querySelector('[data-input]');
    var counterEl = popoverEl.querySelector('[data-count]');
    var resetBtn = popoverEl.querySelector('[data-reset]');
    var applyBtn = popoverEl.querySelector('[data-apply]');

    var anchorTh = null;
    var anchorIcon = null;
    var anchorColIndex = -1;
    // 컬럼별 적용된 필터값 저장 (colIndex → string)
    var applied = {};

    function countLines(s) {
      if (!s) return 0;
      return s.split('\n').map(function (l) { return l.trim(); }).filter(Boolean).length;
    }
    function refreshButtons() {
      var n = countLines(taEl.value);
      // 적용: 입력 1+ 라인일 때 활성
      if (n > 0) applyBtn.classList.add('is-enabled');
      else applyBtn.classList.remove('is-enabled');
      // 초기화: 입력값 있거나 이미 적용된 필터가 있을 때 활성
      var hasApplied = anchorTh ? !!applied[getThColIndex(anchorTh)] : false;
      if (n > 0 || hasApplied) resetBtn.classList.add('is-enabled');
      else resetBtn.classList.remove('is-enabled');
    }

    taEl.addEventListener('input', function () {
      var lines = taEl.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      if (lines.length > codeMax) {
        taEl.value = lines.slice(0, codeMax).join('\n');
        lines = lines.slice(0, codeMax);
      }
      counterEl.textContent = String(lines.length);
      refreshButtons();
    });

    function reposition() {
      if (!anchorTh) return;
      var anchorRect = (anchorIcon || anchorTh).getBoundingClientRect();
      var popRect = popoverEl.getBoundingClientRect();
      // 아이콘 하단 8px + 가로 가운데 정렬
      var top = anchorRect.bottom + 8;
      var left = anchorRect.left + anchorRect.width / 2 - popRect.width / 2;
      if (left < 8) left = 8;
      if (left + popRect.width > window.innerWidth - 8) left = window.innerWidth - popRect.width - 8;
      // 아래로 넘치면 위로
      if (top + popRect.height > window.innerHeight - 8) {
        top = anchorRect.top - popRect.height - 8;
      }
      popoverEl.style.top = top + 'px';
      popoverEl.style.left = left + 'px';
    }
    function open(th, iconEl) {
      anchorTh = th;
      anchorIcon = iconEl;
      anchorColIndex = getThColIndex(th);
      taEl.value = applied[anchorColIndex] || '';
      counterEl.textContent = String(countLines(taEl.value));
      refreshButtons();

      popoverEl.removeAttribute('hidden');
      reposition();
      setTimeout(function () { taEl.focus(); }, 0);
      setTimeout(function () { document.addEventListener('click', onOutside, true); }, 0);
      // scroll/resize 추적
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onScroll);
    }
    function close() {
      popoverEl.setAttribute('hidden', '');
      anchorTh = null;
      anchorIcon = null;
      anchorColIndex = -1;
      document.removeEventListener('click', onOutside, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    }
    function onOutside(e) {
      if (popoverEl.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.filter-ic')) return;
      close();
    }
    function onScroll() {
      if (!anchorTh || popoverEl.hasAttribute('hidden')) return;
      reposition();
    }

    function applyFilterToColumn(colIndex, lines) {
      var tableEl = scope.querySelector(tableSelector);
      if (!tableEl) return;
      var tbody = tableEl.querySelector('tbody');
      if (!tbody) return;
      var rows = tbody.children;
      // 빈 lines 면 컬럼 필터 해제 → 'col-filter-hidden' 마커 제거
      var hasFilter = lines && lines.length > 0;
      var lower = hasFilter ? lines.map(function (l) { return l.toLowerCase(); }) : null;
      Array.prototype.forEach.call(rows, function (tr) {
        var td = tr.children[colIndex];
        var match = true;
        if (hasFilter) {
          var text = (td ? (td.textContent || '') : '').toLowerCase();
          match = lower.some(function (v) { return text.indexOf(v) !== -1; });
        }
        // 컬럼별 필터 마커 — 'col-filter-hidden-{colIndex}' 와 같이 누적 X. 단순화: 'data-col-filter-N'
        // 다른 필터 (전역) 와 충돌 방지를 위해 별도 attribute 사용
        if (match) {
          tr.removeAttribute('data-col-filter-' + colIndex);
        } else {
          tr.setAttribute('data-col-filter-' + colIndex, '1');
        }
        // 어떤 컬럼이든 col-filter-* 가 1개라도 있으면 hide
        var hide = false;
        for (var i = 0; i < tr.attributes.length; i++) {
          var name = tr.attributes[i].name;
          if (name.indexOf('data-col-filter-') === 0) { hide = true; break; }
        }
        // tr style.display 로 hide — 단 다른 필터 시스템 (전역 filter) 가 별도 hide 했을 가능성 있어
        // 그쪽이 우선하도록 'display: none' 만 set/unset.
        if (hide) tr.style.display = 'none';
        else tr.style.display = '';
      });
    }

    function setIconActive(colIndex, active) {
      // is-active 클래스만 토글 — CSS 가 opacity/pointer-events/color 처리
      var icons = findFilterIcsForCol(scope, tableSelector, colIndex);
      icons.forEach(function (ic) {
        if (active) ic.classList.add('is-active');
        else        ic.classList.remove('is-active');
      });
    }

    applyBtn.addEventListener('click', function () {
      if (!applyBtn.classList.contains('is-enabled')) return;
      if (!anchorTh) return;
      var colIndex = getThColIndex(anchorTh);
      var lines = taEl.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      applied[colIndex] = lines.join('\n');
      applyFilterToColumn(colIndex, lines);
      setIconActive(colIndex, true);
      close();
    });

    resetBtn.addEventListener('click', function () {
      if (!resetBtn.classList.contains('is-enabled')) return;
      if (!anchorTh) return;
      var colIndex = getThColIndex(anchorTh);
      taEl.value = '';
      counterEl.textContent = '0';
      delete applied[colIndex];
      applyFilterToColumn(colIndex, []);
      setIconActive(colIndex, false);
      refreshButtons();
    });

    function onClick(e) {
      var icon = e.target.closest && e.target.closest('.filter-ic');
      if (!icon) return;
      var th = icon.closest('th');
      if (!th) return;
      if (!th.closest(tableSelector + ' thead, .mp-thead-sticky thead')) return;
      e.preventDefault();
      e.stopPropagation();
      var clickedColIndex = getThColIndex(th);
      var isOpen = !popoverEl.hasAttribute('hidden');
      // 같은 컬럼 (origin/sticky 무관) 재클릭 시 토글 close, 다른 컬럼이면 reopen
      if (isOpen && clickedColIndex === anchorColIndex) {
        close();
        return;
      }
      if (isOpen) close();
      open(th, icon);
    }
    scope.addEventListener('click', onClick);

    return {
      close: close,
      destroy: function () {
        scope.removeEventListener('click', onClick);
        if (popoverEl.parentNode) popoverEl.parentNode.removeChild(popoverEl);
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.columnFilterPopover = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
