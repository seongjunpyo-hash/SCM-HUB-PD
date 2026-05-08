/* ============================================================
 * cell-input — vanilla factory (IIFE)
 * ------------------------------------------------------------
 * 테이블 셀 안 input 의 셀-편집 모드 처리:
 *   - 셀 클릭: focus → readonly 해제 → 텍스트 전체 선택
 *   - blur / Enter / Tab: readonly 복귀
 *   - 화살표(↑/↓/←/→) 로 인접 cell-input 셀로 이동 (Excel-like)
 *
 * Usage:
 *   SCM.cellInput.mount({
 *     scope: document,
 *     tableSelector: '.mp-table',
 *     onChange: function (td, input, oldVal, newVal) { ... },
 *   });
 * ============================================================ */
(function (root) {
  'use strict';

  function mount(opts) {
    var options = opts || {};
    var scope = options.scope || document;
    var tableSel = options.tableSelector || '.mp-table';
    var onChange = typeof options.onChange === 'function' ? options.onChange : null;

    var tables = scope.querySelectorAll(tableSel);
    if (!tables.length) return null;

    var bound = [];
    tables.forEach(function (tbl) {
      var handler = function (e) { handleEvent(tbl, e); };
      tbl.addEventListener('click', handler, true);
      tbl.addEventListener('focusin', handler, true);
      tbl.addEventListener('keydown', handler, true);
      tbl.addEventListener('change', handler, true);
      tbl.addEventListener('blur', handler, true);
      bound.push({ tbl: tbl, handler: handler });
    });

    function inputAt(tbl, rowIdx, colIdx) {
      var rows = tbl.tBodies[0] ? tbl.tBodies[0].rows : [];
      var r = rows[rowIdx];
      if (!r) return null;
      var td = r.cells[colIdx];
      if (!td || !td.classList.contains('cell-input')) return null;
      return td.querySelector('input');
    }
    function findCellPos(tbl, td) {
      var tr = td.closest('tr');
      var tbody = tr ? tr.parentElement : null;
      if (!tbody) return null;
      var rowIdx = Array.prototype.indexOf.call(tbody.rows, tr);
      var colIdx = Array.prototype.indexOf.call(tr.cells, td);
      return { rowIdx: rowIdx, colIdx: colIdx };
    }
    function activate(input) {
      if (!input) return;
      input.removeAttribute('readonly');
      try { input.focus({ preventScroll: false }); } catch (_) { input.focus(); }
      try { input.select(); } catch (_) {}
    }
    function deactivate(input) {
      if (!input) return;
      input.setAttribute('readonly', '');
    }
    function moveTo(tbl, fromTd, dr, dc) {
      var pos = findCellPos(tbl, fromTd);
      if (!pos) return;
      // 인접 cell-input 셀 찾기 (없으면 그 방향으로 더 멀리 시도, 최대 8회)
      var rowIdx = pos.rowIdx, colIdx = pos.colIdx;
      for (var i = 0; i < 8; i++) {
        rowIdx += dr; colIdx += dc;
        var next = inputAt(tbl, rowIdx, colIdx);
        if (next) { activate(next); return; }
      }
    }

    function handleEvent(tbl, e) {
      var t = e.target;
      var td = t.closest && t.closest('td.cell-input');
      var input = td ? td.querySelector('input') : null;
      if (!td || !input) return;

      if (e.type === 'click' || e.type === 'focusin') {
        if (input.hasAttribute('readonly')) activate(input);
        return;
      }
      if (e.type === 'keydown') {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          deactivate(input);
          input.blur();
          if (e.key === 'Enter') moveTo(tbl, td, 1, 0); // 다음 행 같은 열
          return;
        }
        if (e.key === 'Tab') {
          // 기본 Tab 동작 유지 (브라우저가 다음 focusable 로 이동) — readonly 복귀
          deactivate(input);
          return;
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveTo(tbl, td, 1, 0); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); moveTo(tbl, td, -1, 0); return; }
        if (e.key === 'ArrowRight' && (input.selectionStart === input.value.length)) {
          e.preventDefault(); moveTo(tbl, td, 0, 1); return;
        }
        if (e.key === 'ArrowLeft' && (input.selectionStart === 0)) {
          e.preventDefault(); moveTo(tbl, td, 0, -1); return;
        }
        return;
      }
      if (e.type === 'change') {
        var oldVal = input.dataset.cellOldValue || '';
        var newVal = input.value;
        if (onChange) {
          try { onChange(td, input, oldVal, newVal); } catch (_) {}
        }
        input.dataset.cellOldValue = newVal;
        return;
      }
      if (e.type === 'blur') {
        deactivate(input);
      }
    }

    return {
      destroy: function () {
        bound.forEach(function (b) {
          b.tbl.removeEventListener('click', b.handler, true);
          b.tbl.removeEventListener('focusin', b.handler, true);
          b.tbl.removeEventListener('keydown', b.handler, true);
          b.tbl.removeEventListener('change', b.handler, true);
          b.tbl.removeEventListener('blur', b.handler, true);
        });
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.cellInput = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
