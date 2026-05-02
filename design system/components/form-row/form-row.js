/* scm-form-row — visual-only helper */
(function (root) {
  function mount(el) {
    if (!el) return null;
    el.classList.add('scm-form-row');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.formRow = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
