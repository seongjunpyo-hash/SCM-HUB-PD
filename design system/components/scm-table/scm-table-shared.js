/* ============================================================
 * SCM Table — 공통 인터랙션 모듈 (전역 IIFE)
 * ============================================================
 *
 * 4 페이지 (index / sku-management / editshop-restock-request / editshop-restock-status)
 * 가 공유하는 [공통] 동작을 한 곳에서 정의.
 * [공통] 변경 시 4번 복사 → 1번 수정. 페이지간 누락/드리프트로 인한
 * 버그 (편집샵 필터 bypass 등) 를 원천 차단.
 *
 * 각 페이지 IIFE 안 사용 예:
 *   const filterActions = window.SCMTable.createFilterActions({
 *     searchBtn,
 *     resetBtn,
 *     getCurrentJSON: getCurrentFilterStateJSON,
 *   });
 *   filterActions.update();        // popover 변경 후
 *   filterActions.markApplied();   // 검색 클릭 후
 *   filterActions.markReset();     // 초기화 클릭 후
 *
 *   const stat = window.SCMTable.createSelectionStat({
 *     statEl: document.getElementById('mp-stat-main'),
 *     getCount: () => tableEl.querySelectorAll('tbody td.cb-col .mp-cb[aria-checked="true"]').length,
 *     getTotal: () => ROWS.length,
 *   });
 *   stat.sync();                   // cb 클릭 후
 *
 * 로딩: 페이지 <head> 끝에 <script src="../design%20system/components/scm-table/scm-table-shared.js"></script>
 * (페이지 inline <script> 보다 먼저 실행되도록 head 안에 둠)
 * ============================================================ */

(function (root) {
  'use strict';
  const SCMTable = root.SCMTable = root.SCMTable || {};

  /* ------------------------------------------------------------
   * 1. 필터 actions state machine — 검색/초기화 버튼 상태 관리
   *
   * 책임:
   *   - 검색 버튼 활성/비활성: draft != applied 일 때만 활성
   *     (적용 후 동일하면 비활성, 다시 변경하면 재활성)
   *   - 초기화 버튼 노출/미노출: applied != default('{}') 일 때만 노출
   *     (draft 만 바꾸고 검색 안 했으면 미노출 → 검색 후 노출)
   *
   * 버그 방지:
   *   - 이 모듈을 통해서만 baseline ('{}') 이 갱신되므로,
   *     drawer 검색 적용/초기화 경로가 baseline 갱신을 빠뜨리는 일
   *     (4 페이지 동시 발생했던 버그) 이 발생할 수 없음.
   *
   * @param {Object} opts
   * @param {HTMLButtonElement|null} opts.searchBtn  검색 버튼
   * @param {HTMLButtonElement|null} opts.resetBtn   초기화 버튼
   * @param {() => string}           opts.getCurrentJSON  현재 popover 상태 JSON 문자열
   * @returns {{
   *   update:      () => void,    // popover 변경 후 호출
   *   markApplied: () => void,    // 검색 클릭 → 적용 후 호출 (baseline = 현재 draft)
   *   markReset:   () => void,    // 초기화 클릭 후 호출 (baseline = '{}')
   *   isDirty:     () => boolean, // draft != applied 여부
   *   getApplied:  () => string,  // 현재 baseline (디버깅)
   * }}
   * ------------------------------------------------------------ */
  SCMTable.createFilterActions = function (opts) {
    if (!opts || typeof opts.getCurrentJSON !== 'function') {
      throw new Error('[SCMTable.createFilterActions] getCurrentJSON 필수');
    }
    let baseline = '{}';

    function update() {
      const cur = opts.getCurrentJSON();
      const isDirty = cur !== baseline;
      if (opts.searchBtn) opts.searchBtn.disabled = !isDirty;
      if (opts.resetBtn)  opts.resetBtn.hidden    = (baseline === '{}');
    }

    return {
      update: update,
      markApplied: function () { baseline = opts.getCurrentJSON(); update(); },
      markReset:   function () { baseline = '{}'; update(); },
      isDirty:     function () { return opts.getCurrentJSON() !== baseline; },
      getApplied:  function () { return baseline; },
    };
  };


  /* ------------------------------------------------------------
   * 2. 액션바 선택 stat — "전체 N" ↔ "선택됨 N / total" swap
   *
   * 책임:
   *   - cb 선택 변화 시 stat element 마크업 swap
   *   - 4 페이지 모두 동일한 마크업 출력 (label/num/divider/num-total span)
   *   - mp-stat--all ↔ mp-stat--selected 클래스 toggle 로 padding/font-weight 일괄 처리
   *
   * @param {Object} opts
   * @param {HTMLElement}    opts.statEl    stat element (e.g. id="mp-stat-main")
   * @param {() => number}   opts.getCount  현재 선택된 cb 개수
   * @param {() => number}   opts.getTotal  전체 row 개수
   * @returns {{
   *   sync: () => void,            // cb 변경 후 호출 → 마크업 갱신
   *   getSelectedCount: () => number,
   * }}
   * ------------------------------------------------------------ */
  SCMTable.createSelectionStat = function (opts) {
    if (!opts || !opts.statEl) {
      throw new Error('[SCMTable.createSelectionStat] statEl 필수');
    }
    if (typeof opts.getCount !== 'function' || typeof opts.getTotal !== 'function') {
      throw new Error('[SCMTable.createSelectionStat] getCount/getTotal 필수');
    }

    function sync() {
      const cnt = opts.getCount();
      const total = opts.getTotal();
      const el = opts.statEl;
      if (cnt > 0) {
        el.classList.remove('mp-stat--all');
        el.classList.add('mp-stat--selected');
        el.innerHTML =
          '<span class="label">선택됨</span> ' +
          '<span class="num">' + cnt + '</span> ' +
          '<span class="divider">/</span> ' +
          '<span class="num-total">' + total + '</span>';
      } else {
        el.classList.remove('mp-stat--selected');
        el.classList.add('mp-stat--all');
        el.innerHTML =
          '<span class="label">전체</span> ' +
          '<span class="num">' + total + '</span>';
      }
    }

    return {
      sync: sync,
      getSelectedCount: opts.getCount,
    };
  };

})(window);
