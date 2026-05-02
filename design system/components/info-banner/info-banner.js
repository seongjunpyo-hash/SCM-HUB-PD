/* ============================================================
 * scm-info-banner — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   const ib = SCM.infoBanner.mount(el, { collapsed: false });
 *   ib.toggle();
 *   ib.collapse();
 *   ib.expand();
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-info-banner');
    if (options.full) el.classList.add('scm-info-banner--full');
    if (options.collapsed) el.classList.add('is-collapsed');

    var toggleBtn = el.querySelector('.scm-info-banner__toggle');

    function expand() { el.classList.remove('is-collapsed'); }
    function collapse() { el.classList.add('is-collapsed'); }
    function toggle() { el.classList.toggle('is-collapsed'); }

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);

    return {
      el: el,
      expand: expand,
      collapse: collapse,
      toggle: toggle,
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.infoBanner = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
