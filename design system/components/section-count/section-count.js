/* scm-section-count — visual-only helper */
(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-section-count');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.sectionCount = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
