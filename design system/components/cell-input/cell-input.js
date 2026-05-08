/* ============================================================
 * scm-cell-input — mp-table 의 td.cell-input 을 엑셀처럼 동작시키는 모듈
 * ------------------------------------------------------------
 * 의존: mp-table (scm-table.js 의 setupCellSelection — 드래그 다중 선택, Cmd+C 복사)
 * 페어: cell-input.css
 *
 * 동작:
 *   - 디폴트: input 은 readonly + pointer-events:none → mp-table cellSelection 이 셀 선택 처리
 *   - 1번 클릭   → 셀 선택만 (cellSelection 가 td.cell-selected + cell-active 부여)
 *   - 더블클릭   → 편집 모드 진입 (.is-editing, input.focus, 텍스트 select)
 *   - Enter / F2 → 편집 모드 진입 (selected 셀에서)
 *   - 타이핑 시작 (printable key) → 편집 모드 진입, 기존 값 → 새 값 시작
 *   - blur / Enter → 편집 모드 종료, 값 확정
 *   - Esc        → 편집 모드 종료, 값 원복
 *   - 화살표 (selected 상태) → 인접 입력 가능 셀로 selected 이동
 *   - Tab / Shift+Tab → 다음/이전 입력 가능 셀로 이동 (편집 가능 시 편집 모드)
 *
 * 옵션:
 *   - onChange(td, input, oldVal, newVal) — 값 확정 시 호출
 *
 * Usage:
 *   SCM.cellInput.mount({
 *     scope: document,
 *     tableSelector: '.mp-table-scroll .mp-table',
 *     onChange: function (td, input, oldVal, newVal) { ... },
 *   });
 * ============================================================ */

(function (root) {
  'use strict';

  function mount(config) {
    config = config || {};
    var scope = config.scope || document;
    var tableSelector = config.tableSelector || '.mp-table-scroll .mp-table';
    var onChange = typeof config.onChange === 'function' ? config.onChange : null;

    var tables = scope.querySelectorAll(tableSelector);
    var instances = [];
    tables.forEach(function (table) {
      instances.push(mountOne(table, { onChange: onChange }));
    });
    return {
      instances: instances,
      destroy: function () { instances.forEach(function (i) { i.destroy && i.destroy(); }); },
    };
  }

  function mountOne(table, opts) {
    opts = opts || {};
    var onChange = opts.onChange || null;

    // 모든 input 을 디폴트 readonly 처리
    // (페이지 마크업에 readonly attribute 를 두는 것이 권장되며,
    //  여기선 fallback 으로 동기 처리한 뒤 enter/exit edit 에서만 토글)
    function syncReadonly() {
      table.querySelectorAll('td.cell-input > input').forEach(function (inp) {
        var td = inp.parentElement;
        if (td.classList.contains('is-editing')) return;
        if (!inp.readOnly) inp.readOnly = true;
      });
    }
    syncReadonly();

    // ---- 헬퍼 ----
    function getTbody() { return table.querySelector('tbody'); }
    function isEditableCell(td) {
      return td && td.tagName === 'TD'
        && td.classList.contains('cell-input')
        && td.getAttribute('data-readonly') !== 'true';
    }
    function isEditingNow() { return !!table.querySelector('td.cell-input.is-editing'); }
    function getActiveCell() { return table.querySelector('td.cell-active'); }
    function getInputOf(td) { return td ? td.querySelector(':scope > input') : null; }

    // ---- 편집 모드 진입 / 종료 ----
    var editingState = null; // { td, input, originalValue }

    function enterEdit(td, opts) {
      opts = opts || {};
      if (!isEditableCell(td)) return;
      // 기존 편집 셀 종료 (값 확정)
      if (editingState && editingState.td !== td) commitEdit();
      var inp = getInputOf(td);
      if (!inp) return;
      td.classList.add('is-editing');
      inp.readOnly = false;
      editingState = { td: td, input: inp, originalValue: inp.value };
      // 타이핑 시작이면 기존 값 비우고 새 글자만, 아니면 전체 select
      if (opts.startTyping) {
        inp.value = '';
      }
      inp.focus();
      if (opts.selectAll !== false && !opts.startTyping) {
        try { inp.select(); } catch (_) {}
      }
    }
    function commitEdit() {
      if (!editingState) return;
      var st = editingState;
      editingState = null;
      st.td.classList.remove('is-editing');
      st.input.readOnly = true;
      var newVal = st.input.value;
      if (newVal !== st.originalValue) {
        // native change 이벤트 dispatch — 페이지의 change 핸들러가 데이터 갱신 처리
        try {
          st.input.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { /* ignore */ }
        if (onChange) {
          try { onChange(st.td, st.input, st.originalValue, newVal); }
          catch (e) { console.warn('[cell-input] onChange threw', e); }
        }
      }
    }
    function cancelEdit() {
      if (!editingState) return;
      var st = editingState;
      editingState = null;
      st.input.value = st.originalValue;
      st.td.classList.remove('is-editing');
      st.input.readOnly = true;
    }

    // ---- 클릭/더블클릭 ----
    table.addEventListener('dblclick', function (e) {
      var td = e.target.closest('td.cell-input');
      if (!isEditableCell(td)) return;
      e.preventDefault();
      e.stopPropagation();
      enterEdit(td);
    });

    // ---- input 의 blur/keydown ----
    table.addEventListener('focusout', function (e) {
      // 편집 중이던 input 에서 포커스가 나가면 commit
      if (!editingState) return;
      var inp = e.target;
      if (inp !== editingState.input) return;
      // 포커스가 같은 cell-input 의 다른 곳에 가면 유지 — 일반적으로 commit
      setTimeout(function () {
        // 만약 active element 가 같은 input 이면 그대로
        if (document.activeElement === inp) return;
        commitEdit();
      }, 0);
    });

    table.addEventListener('keydown', function (e) {
      // 편집 중 — Enter / Esc / Tab 처리
      if (editingState) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var td = editingState.td;
          commitEdit();
          // 다음 행 같은 컬럼으로 selected 이동
          moveSelected(td, 1, 0);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          var td2 = editingState.td;
          commitEdit();
          moveSelected(td2, 0, e.shiftKey ? -1 : 1);
        }
        return;
      }

      // 편집 X — selected 셀에 대한 키 처리
      var active = getActiveCell();
      if (!active || !active.classList.contains('cell-input')) return;

      if (e.key === 'Enter' || e.key === 'F2') {
        e.preventDefault();
        enterEdit(active);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        moveSelected(active, 0, e.shiftKey ? -1 : 1);
        return;
      }
      if (e.key === 'ArrowUp')    { e.preventDefault(); moveSelected(active, -1, 0); return; }
      if (e.key === 'ArrowDown')  { e.preventDefault(); moveSelected(active, 1, 0);  return; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); moveSelected(active, 0, -1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveSelected(active, 0, 1);  return; }

      // 타이핑 시작 (printable key, 단일 문자, 모디파이어 없음)
      if (
        e.key.length === 1
        && !e.ctrlKey && !e.metaKey && !e.altKey
        && isEditableCell(active)
      ) {
        e.preventDefault();
        enterEdit(active, { startTyping: true });
        // 첫 글자 입력
        var inp = getInputOf(active);
        if (inp) {
          // input.value 는 enterEdit 가 비웠음
          inp.value = e.key;
          // 커서를 끝으로
          try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (_) {}
        }
      }
    });

    // ---- 인접 셀 selected 이동 ----
    function moveSelected(fromTd, dr, dc) {
      var tbody = getTbody();
      if (!tbody) return;
      var tr = fromTd.parentElement;
      var rows = Array.from(tbody.children);
      var rIdx = rows.indexOf(tr);
      var cIdx = fromTd.cellIndex;
      // dr/dc 방향으로 input cell 찾기 (skip 비입력 셀)
      var maxStep = Math.max(rows.length, tr.children.length) + 5;
      var nr = rIdx, nc = cIdx;
      for (var i = 0; i < maxStep; i++) {
        nr += dr; nc += dc;
        if (nr < 0 || nr >= rows.length) return;
        if (nc < 0 || nc >= tr.children.length) return;
        var nextTd = rows[nr] && rows[nr].children[nc];
        if (isEditableCell(nextTd)) {
          selectCell(nextTd);
          // 자동 스크롤
          if (nextTd.scrollIntoView) nextTd.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          return;
        }
      }
    }

    function selectCell(td) {
      // setupCellSelection 가 부여하는 클래스 그대로 사용
      table.querySelectorAll('td.cell-selected, td.cell-active').forEach(function (x) {
        x.classList.remove('cell-selected', 'cell-active', 'sel-top', 'sel-right', 'sel-bottom', 'sel-left');
      });
      td.classList.add('cell-selected', 'cell-active', 'sel-top', 'sel-right', 'sel-bottom', 'sel-left');
    }

    // 외부에서 다시 readonly 동기화 호출용 (테이블 재렌더 시)
    function rebuild() { syncReadonly(); }

    // tbody 가 다시 그려졌을 때 readonly 자동 복원 (MutationObserver)
    var mo = new MutationObserver(function () { syncReadonly(); });
    var tbody = getTbody();
    if (tbody) mo.observe(tbody, { childList: true, subtree: true });

    function destroy() {
      mo.disconnect();
    }

    return { table: table, rebuild: rebuild, destroy: destroy };
  }

  root.SCM = root.SCM || {};
  root.SCM.cellInput = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
