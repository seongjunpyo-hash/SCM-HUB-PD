/* scm-page-section — visual-only helper */
(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-page-section');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.pageSection = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
