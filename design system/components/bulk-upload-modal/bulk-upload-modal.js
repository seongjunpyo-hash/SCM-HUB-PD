/* ============================================================
 * scm-bulk-upload-modal — vanilla helper
 * ------------------------------------------------------------
 * 외부에서 마크업한 modal 을 mount. open/close + warning toggle 자동 부착.
 *
 * Usage:
 *   const m = SCM.bulkUploadModal.mount({
 *     modal: modalEl, backdrop: backdropEl,
 *   });
 *   m.open(); m.close();
 * ============================================================ */

(function (root) {
  function mount(opts) {
    var options = opts || {};
    var modal = options.modal;
    var backdrop = options.backdrop;
    if (!modal) return null;

    modal.classList.add('scm-bu-modal');
    if (backdrop) backdrop.classList.add('scm-bu-backdrop');

    var closeBtn = modal.querySelector('.scm-bu-close');
    var warning = modal.querySelector('.scm-bu-warning');
    var warningToggle = warning ? warning.querySelector('.scm-bu-warning__toggle') : null;
    var bodyEl = modal.querySelector('.scm-bu-body');

    function open() {
      if (modal.classList.contains('is-open')) return;
      modal.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      // body scroll 잠금 — 카운터 기반 공용 유틸
      if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.lock();
      // 모달 내 .mp-table init — page-load 시점엔 hidden 상태라 sticky 측정 0 으로 init skip 됨.
      // 모달 visible 후 init 재호출 → setupStickyThead 정상 측정 → resize/reorder/dblclick 부착.
      if (root.SCMTable && typeof root.SCMTable.init === 'function') {
        requestAnimationFrame(function () {
          try { root.SCMTable.init({ root: modal }); } catch (e) {}
        });
      }
    }

    function close() {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.unlock();
      if (typeof options.onClose === 'function') options.onClose();
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    if (warningToggle && warning) {
      warningToggle.addEventListener('click', function () {
        warning.classList.toggle('is-collapsed');
      });
    }

    // body 세로 스크롤 시 warning 자동 접힘 (8px 이상 스크롤되면 collapse)
    if (bodyEl && warning) {
      var lastScrollTop = 0;
      bodyEl.addEventListener('scroll', function () {
        var st = bodyEl.scrollTop;
        if (st > 8 && !warning.classList.contains('is-collapsed')) {
          warning.classList.add('is-collapsed');
        } else if (st === 0 && warning.classList.contains('is-collapsed') && lastScrollTop > 0) {
          // 맨 위로 돌아오면 자동 펼침 (사용자가 toggle 로 접은 게 아니면)
          // — 단, 사용자가 명시적으로 접어둔 상태도 그대로 유지하고 싶으면 이 라인 제거
          // 간단성 위해 자동 재오픈은 안 함
        }
        lastScrollTop = st;
      }, { passive: true });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    return {
      modal: modal,
      backdrop: backdrop,
      open: open,
      close: close,
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.bulkUploadModal = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
