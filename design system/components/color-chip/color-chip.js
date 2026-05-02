/* ============================================================
 * scm-color-chip — vanilla helper
 * Visual-only.
 * ============================================================ */

(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-color-chip');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.colorChip = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
