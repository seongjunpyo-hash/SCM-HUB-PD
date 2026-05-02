/* ============================================================
 * scm-deploy-popover — vanilla factory
 * ------------------------------------------------------------
 * 단일 인스턴스. 셀에서 호출하면 anchor 위치에 표시되고,
 * 외부 클릭 또는 옵션 선택 시 close.
 *
 * Usage:
 *   SCM.deployPopover.open({
 *     anchorEl: cellEl,
 *     options: [
 *       { state: 'deployed',   label: '전개중' },
 *       { state: 'undeployed', label: '미전개' },
 *     ],
 *     current: 'deployed',
 *     onSelect: (state) => {},
 *   });
 *   SCM.deployPopover.close();
 * ============================================================ */

(function (root) {
  var popover = null;
  var listEl = null;
  var currentOpts = null;

  function ensureMounted() {
    if (popover && document.body.contains(popover)) return;
    popover = document.createElement('div');
    popover.className = 'scm-deploy-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', '전개 여부 변경');
    popover.innerHTML = '<ul></ul>';
    listEl = popover.querySelector('ul');

    listEl.addEventListener('click', function (e) {
      var li = e.target.closest('[data-deploy-opt]');
      if (!li || !currentOpts) return;
      var state = li.getAttribute('data-deploy-opt');
      if (typeof currentOpts.onSelect === 'function') currentOpts.onSelect(state);
      close();
    });

    document.body.appendChild(popover);
  }

  function open(opts) {
    var options = opts || {};
    ensureMounted();
    currentOpts = options;

    var current = options.current || null;
    listEl.innerHTML = (options.options || []).map(function (o) {
      var isCur = o.state === current;
      return '<li data-deploy-opt="' + o.state + '" data-current="' + (isCur ? 'true' : 'false') + '"></li>';
    }).join('');

    var lis = listEl.querySelectorAll('li');
    (options.options || []).forEach(function (o, i) {
      if (lis[i]) lis[i].textContent = o.label;
    });

    popover.classList.add('is-open');

    // anchor 위치 (셀 기준 chev 아래)
    if (options.anchorEl) {
      var rect = options.anchorEl.getBoundingClientRect();
      var chev = options.anchorEl.querySelector('.scm-deploy-pill__chev');
      var topRect = chev ? chev.getBoundingClientRect() : rect;
      popover.style.minWidth = rect.width + 'px';
      popover.style.top = (topRect.bottom + 8) + 'px';
      var w = rect.width;
      var left = rect.left;
      if (left < 8) left = 8;
      if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
      popover.style.left = left + 'px';
    }

    setTimeout(function () { document.addEventListener('click', dismissOnOutside, true); }, 0);
  }

  function close() {
    if (!popover) return;
    popover.classList.remove('is-open');
    popover.style.minWidth = '';
    document.removeEventListener('click', dismissOnOutside, true);
    // anchor cell 의 is-open 도 함께 제거 — chev 회전 복원 (외부 클릭 / ESC / 옵션 선택 모든 경우)
    if (currentOpts && currentOpts.anchorEl) {
      currentOpts.anchorEl.classList.remove('is-open');
    }
    currentOpts = null;
  }

  function dismissOnOutside(e) {
    if (!popover.classList.contains('is-open')) return;
    if (popover.contains(e.target)) return;
    if (currentOpts && currentOpts.anchorEl && currentOpts.anchorEl.contains(e.target)) return;
    close();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  root.SCM = root.SCM || {};
  root.SCM.deployPopover = { open: open, close: close };
})(typeof window !== 'undefined' ? window : globalThis);
