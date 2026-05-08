/* ============================================================
 * scm-code-popover — vanilla factory
 * ------------------------------------------------------------
 * 단일 인스턴스를 페이지 어디서든 호출 가능하게 관리.
 *
 * Usage:
 *   SCM.codePopover.open({
 *     type: 'uid',
 *     items: ['383827', '383828', ...],
 *     anchorEl: someElement,
 *     copyLabel: 'UID 복사',
 *     onCopy: () => navigator.clipboard.writeText(...),
 *   });
 *   SCM.codePopover.close();
 * ============================================================ */

(function (root) {
  var popover = null;
  var backdrop = null;
  var titleEl = null;
  var listEl = null;
  var copyBtn = null;
  var copyLabelEl = null;
  var countEl = null;
  var closeBtn = null;
  var currentOpts = null;

  function ensureMounted() {
    if (popover && document.body.contains(popover)) return;

    backdrop = document.createElement('div');
    backdrop.className = 'scm-code-popover-backdrop';

    popover = document.createElement('div');
    popover.className = 'scm-code-popover';
    popover.setAttribute('role', 'dialog');
    popover.innerHTML = '' +
      '<h4 class="scm-code-popover__title"></h4>' +
      '<ul class="scm-code-popover__list"></ul>' +
      '<div class="scm-code-popover__actions">' +
        '<button type="button" class="scm-code-popover__copy">' +
          '<span class="scm-code-popover__copy-label"></span> (<span class="scm-code-popover__count">0</span>)' +
        '</button>' +
        '<button type="button" class="primary scm-code-popover__close">닫기</button>' +
      '</div>';

    titleEl = popover.querySelector('.scm-code-popover__title');
    listEl = popover.querySelector('.scm-code-popover__list');
    copyBtn = popover.querySelector('.scm-code-popover__copy');
    copyLabelEl = popover.querySelector('.scm-code-popover__copy-label');
    countEl = popover.querySelector('.scm-code-popover__count');
    closeBtn = popover.querySelector('.scm-code-popover__close');

    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    copyBtn.addEventListener('click', function () {
      if (currentOpts && typeof currentOpts.onCopy === 'function') currentOpts.onCopy(currentOpts.items);
      close();
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(popover);
  }

  function open(opts) {
    var options = opts || {};
    ensureMounted();
    currentOpts = options;

    titleEl.textContent = options.title || '코드 확인';
    listEl.innerHTML = (options.items || []).map(function (v) {
      var linked = options.linked !== false;
      return '<li' + (linked ? ' class="linked"' : '') + '></li>';
    }).join('');
    // textContent 로 안전하게 채움
    var lis = listEl.querySelectorAll('li');
    (options.items || []).forEach(function (v, i) { if (lis[i]) lis[i].textContent = v; });
    countEl.textContent = (options.items || []).length;
    copyLabelEl.textContent = options.copyLabel || '복사';

    popover.classList.add('is-open');
    backdrop.classList.add('is-open');

    // Anchor 위치 계산
    if (options.anchorEl) {
      var r = options.anchorEl.getBoundingClientRect();
      popover.style.top = (r.bottom + 6) + 'px';
      var popW = 240;
      var left = r.left - 18;
      if (left < 8) left = 8;
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
      popover.style.left = left + 'px';
      popover.style.right = 'auto';
    }
  }

  function close() {
    if (!popover) return;
    popover.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    currentOpts = null;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  root.SCM = root.SCM || {};
  root.SCM.codePopover = { open: open, close: close };
})(typeof window !== 'undefined' ? window : globalThis);
