/* ============================================================
 * scm-backdrop — vanilla factory
 * ------------------------------------------------------------
 * Usage:
 *   const bd = SCM.backdrop.mount(el, { transparent: false });
 *   bd.open();
 *   bd.close();
 *   bd.onClick(() => bd.close());
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    if (el.__scmBackdrop) return el.__scmBackdrop;

    var options = opts || {};
    el.classList.add('scm-backdrop');
    if (options.transparent) el.classList.add('scm-backdrop--transparent');

    var api = {
      el: el,
      open: function () { el.classList.add('is-open'); return api; },
      close: function () { el.classList.remove('is-open'); return api; },
      toggle: function (v) {
        if (typeof v === 'boolean') el.classList.toggle('is-open', v);
        else el.classList.toggle('is-open');
        return api;
      },
      isOpen: function () { return el.classList.contains('is-open'); },
      onClick: function (fn) { el.addEventListener('click', fn); return api; },
      destroy: function () {
        el.classList.remove('scm-backdrop', 'scm-backdrop--transparent', 'is-open');
        delete el.__scmBackdrop;
      },
    };

    el.__scmBackdrop = api;
    return api;
  }

  root.SCM = root.SCM || {};
  root.SCM.backdrop = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
