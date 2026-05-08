/* scm-info-table — visual-only helper */
(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-info-table');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.infoTable = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
