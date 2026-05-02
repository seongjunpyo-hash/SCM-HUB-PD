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

    function open() {
      if (modal.classList.contains('is-open')) return;
      modal.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      // body scroll 잠금 — 카운터 기반 공용 유틸
      if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.lock();
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
