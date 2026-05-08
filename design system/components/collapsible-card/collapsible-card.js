/* ============================================================
 * scm-collapsible-card — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   const cc = SCM.collapsibleCard.mount(el, { collapsed: false });
 *   cc.toggle(); cc.collapse(); cc.expand();
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-collapsible-card');
    if (options.collapsed) el.classList.add('is-collapsed');

    var head = el.querySelector('.scm-collapsible-card__head');
    function expand() { el.classList.remove('is-collapsed'); }
    function collapse() { el.classList.add('is-collapsed'); }
    function toggle() {
      el.classList.toggle('is-collapsed');
      if (typeof options.onToggle === 'function') options.onToggle(el.classList.contains('is-collapsed'));
    }

    if (head) head.addEventListener('click', toggle);

    return { el: el, expand: expand, collapse: collapse, toggle: toggle };
  }

  root.SCM = root.SCM || {};
  root.SCM.collapsibleCard = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
