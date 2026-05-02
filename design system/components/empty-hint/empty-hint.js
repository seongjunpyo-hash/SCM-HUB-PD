/* scm-empty-hint — visual-only helper */
(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-empty-hint');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.emptyHint = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
