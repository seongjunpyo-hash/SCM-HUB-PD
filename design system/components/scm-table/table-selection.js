/* ============================================================
 * scm-table-selection — 체크박스 ↔ 액션바 공유 wiring
 * ------------------------------------------------------------
 * 무탠 페이지(scm hub/index.html)에서 검증된 inline document
 * delegation 패턴을 그대로 모듈화.
 *
 * Usage:
 *   SCM.tableSelection.init({
 *     tableEl: document.querySelector('.mp-table'),
 *     cbAllId: 'mp-cb-all',                                       // 헤더 cb id
 *     rowCbSelector: 'td.cb-col .scm-checkbox',                   // 본문 cb selector
 *     actionBarEl: document.getElementById('table-action-bar'),   // 옵션
 *     countEl:     document.getElementById('tab-count'),          // 옵션
 *     onChange:    (selectedCount, totalCount) => {},             // 옵션
 *   });
 * ============================================================ */

(function (root) {
  function init(config) {
    config = config || {};
    var tableEl = config.tableEl || document.querySelector('.mp-table');
    if (!tableEl) {
      console.warn('[table-selection] tableEl not found');
      return null;
    }
    var cbAllId = config.cbAllId || 'mp-cb-all';
    var rowCbSelector = (config.rowCbSelector || 'td.cb-col .scm-checkbox').replace(/^\s*tbody\s+/, '');
    var actionBarEl = config.actionBarEl || null;
    var countEl = config.countEl || null;
    var onChange = typeof config.onChange === 'function' ? config.onChange : null;

    function getRowCbs() {
      var tbody = tableEl.querySelector('tbody');
      if (!tbody) return [];
      return Array.from(tbody.querySelectorAll(rowCbSelector));
    }
    function getCbAll() { return document.getElementById(cbAllId); }
    function getSelectedCount() {
      return getRowCbs().filter(function (cb) { return cb.getAttribute('aria-checked') === 'true'; }).length;
    }

    function refresh() {
      var rows = getRowCbs();
      var n = rows.filter(function (cb) { return cb.getAttribute('aria-checked') === 'true'; }).length;
      var total = rows.length;
      var all = getCbAll();
      if (all) {
        if (n === 0)         all.setAttribute('aria-checked', 'false');
        else if (n === total) all.setAttribute('aria-checked', 'true');
        else                  all.setAttribute('aria-checked', 'mixed');
      }
      if (countEl) countEl.textContent = String(n);
      if (actionBarEl) {
        if (n === 0) actionBarEl.setAttribute('hidden', '');
        else         actionBarEl.removeAttribute('hidden');
      }
      if (onChange) onChange(n, total);
    }

    function clear() {
      getRowCbs().forEach(function (cb) { cb.setAttribute('aria-checked', 'false'); });
      var all = getCbAll();
      if (all) all.setAttribute('aria-checked', 'false');
      refresh();
    }

    // 무탠 검증 패턴 — document delegation, 매우 broad selector.
    // .mp-table 안의 모든 .scm-checkbox + 헤더 cb (id 로 매칭, sticky thead 로 이동돼도 OK).
    document.addEventListener('click', function (e) {
      var cb = e.target.closest('.mp-table .scm-checkbox, #' + cbAllId);
      if (!cb) return;
      if (cb.classList.contains('is-disabled')) return;
      // 다른 테이블 (예: SKU 상세 페이지) 의 cb 와 충돌 방지 — tableEl 또는 sticky thead clone 안에 있어야 함
      var inThisTable = tableEl.contains(cb)
                     || (cb.id === cbAllId && cb.closest('.mp-thead-sticky'));
      if (!inThisTable) return;

      e.preventDefault();
      var cur = cb.getAttribute('aria-checked');
      var next = (cur === 'true') ? 'false' : 'true';

      if (cb.id === cbAllId) {
        // 헤더 → 모든 row cb 토글
        cb.setAttribute('aria-checked', next);
        getRowCbs().forEach(function (rcb) { rcb.setAttribute('aria-checked', next); });
      } else {
        // 본문 cb (td.cb-col 안) → 토글 + 헤더 mixed/all/none 동기 (refresh 가 처리)
        cb.setAttribute('aria-checked', next);
      }
      refresh();
    });

    refresh();

    return {
      refresh: refresh,
      getSelectedCount: getSelectedCount,
      clear: clear,
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.tableSelection = { init: init };
})(typeof window !== 'undefined' ? window : globalThis);
