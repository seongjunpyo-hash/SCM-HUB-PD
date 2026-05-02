/* ============================================================
 * scm-confirm-modal — vanilla factory (singleton)
 * ------------------------------------------------------------
 * Usage:
 *   SCM.confirmModal.open({
 *     title: 'n건 스토어 전개 여부 변경',
 *     descHtml: `선택하신 상품의 ... <strong class="accent">'전개중'</strong>(으)로 일괄 변경합니다.<br/>계속 진행하시겠습니까?`,
 *     cancelLabel: '취소',
 *     confirmLabel: '변경',
 *     onConfirm: () => {},
 *     onCancel: () => {},
 *   });
 *   SCM.confirmModal.close();
 * ============================================================ */

(function (root) {
  var modal = null;
  var backdrop = null;
  var titleEl = null;
  var descEl = null;
  var cancelBtn = null;
  var confirmBtn = null;
  var currentOpts = null;

  function ensureMounted() {
    if (modal && document.body.contains(modal)) return;

    backdrop = document.createElement('div');
    backdrop.className = 'scm-confirm-modal-backdrop';

    modal = document.createElement('div');
    modal.className = 'scm-confirm-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'scm-confirm-modal-title');
    modal.innerHTML =
      '<h3 class="scm-confirm-modal__title" id="scm-confirm-modal-title"></h3>' +
      '<p class="scm-confirm-modal__desc"></p>' +
      '<div class="scm-confirm-modal__actions">' +
        '<button type="button" class="scm-confirm-modal__cancel"></button>' +
        '<button type="button" class="scm-confirm-modal__confirm primary"></button>' +
      '</div>';

    titleEl = modal.querySelector('.scm-confirm-modal__title');
    descEl = modal.querySelector('.scm-confirm-modal__desc');
    cancelBtn = modal.querySelector('.scm-confirm-modal__cancel');
    confirmBtn = modal.querySelector('.scm-confirm-modal__confirm');

    backdrop.addEventListener('click', function () {
      if (currentOpts && typeof currentOpts.onCancel === 'function') currentOpts.onCancel();
      close();
    });
    cancelBtn.addEventListener('click', function () {
      if (currentOpts && typeof currentOpts.onCancel === 'function') currentOpts.onCancel();
      close();
    });
    confirmBtn.addEventListener('click', function () {
      if (currentOpts && typeof currentOpts.onConfirm === 'function') currentOpts.onConfirm();
      close();
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
  }

  function open(opts) {
    var options = opts || {};
    ensureMounted();
    currentOpts = options;

    titleEl.textContent = options.title || '';
    if (options.descHtml != null) descEl.innerHTML = options.descHtml;
    else descEl.textContent = options.desc || '';
    cancelBtn.textContent = options.cancelLabel || '취소';
    confirmBtn.textContent = options.confirmLabel || '확인';

    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.lock();
  }

  function close() {
    if (!modal) return;
    if (!modal.classList.contains('is-open')) return;     // 이미 닫힘 — unlock 중복 방지
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.unlock();
    currentOpts = null;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (currentOpts && typeof currentOpts.onCancel === 'function') currentOpts.onCancel();
      close();
    }
  });

  root.SCM = root.SCM || {};
  root.SCM.confirmModal = { open: open, close: close };
})(typeof window !== 'undefined' ? window : globalThis);
