/* scm-empty-state — visual-only helper */
(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-empty-state');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.emptyState = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
