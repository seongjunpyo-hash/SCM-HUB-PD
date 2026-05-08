/* ============================================================
 * scm-side-drawer — vanilla helper
 * ------------------------------------------------------------
 * 외부에서 마크업한 drawer 를 mount. open/close 시 [hidden] 토글
 * + transform 애니메이션 트리거.
 *
 * Usage:
 *   const dr = SCM.sideDrawer.mount(drawerEl, {
 *     backdrop: backdropEl,
 *     onClose: () => {},
 *   });
 *   dr.open(); dr.close();
 * ============================================================ */

(function (root) {
  function mount(drawer, opts) {
    if (!drawer) return null;
    if (drawer.__scmSideDrawer) return drawer.__scmSideDrawer;

    var options = opts || {};
    drawer.classList.add('scm-side-drawer');
    if (options.size === 'sm') drawer.classList.add('scm-side-drawer--sm');
    if (options.size === 'md') drawer.classList.add('scm-side-drawer--md');
    if (options.size === 'lg') drawer.classList.add('scm-side-drawer--lg');

    var backdrop = options.backdrop || null;
    var closeBtn = drawer.querySelector('.scm-side-drawer__close');

    function open() {
      if (drawer.classList.contains('is-open')) return;
      drawer.hidden = false;
      if (backdrop) backdrop.hidden = false;
      // 다음 frame 에 transform 적용 → transition 트리거
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.lock();
    }

    function close() {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      if (root.SCM && root.SCM.scrollLock) root.SCM.scrollLock.unlock();
      setTimeout(function () {
        drawer.hidden = true;
        if (backdrop) backdrop.hidden = true;
        if (typeof options.onClose === 'function') options.onClose();
      }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    var api = {
      el: drawer,
      open: open,
      close: close,
      destroy: function () { delete drawer.__scmSideDrawer; },
    };
    drawer.__scmSideDrawer = api;
    return api;
  }

  root.SCM = root.SCM || {};
  root.SCM.sideDrawer = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
