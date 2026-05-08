/* ============================================================
 * scm-filter-drawer — vanilla helper
 * ------------------------------------------------------------
 * 외부에서 마크업한 drawer 를 mount. open/close + transform 애니메이션.
 *
 * Usage:
 *   const fd = SCM.filterDrawer.mount(drawerEl, {
 *     backdrop: backdropEl,
 *     onClose: () => {},
 *   });
 *   fd.open(); fd.close();
 * ============================================================ */

(function (root) {
  function mount(drawer, opts) {
    if (!drawer) return null;
    if (drawer.__scmFilterDrawer) return drawer.__scmFilterDrawer;

    var options = opts || {};
    drawer.classList.add('scm-filter-drawer');

    var backdrop = options.backdrop || null;
    var closeBtn = drawer.querySelector('.scm-filter-drawer__close');

    function open() {
      if (drawer.classList.contains('is-open')) return;
      drawer.hidden = false;
      if (backdrop) backdrop.hidden = false;
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

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });

    var api = { el: drawer, open: open, close: close };
    drawer.__scmFilterDrawer = api;
    return api;
  }

  root.SCM = root.SCM || {};
  root.SCM.filterDrawer = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
