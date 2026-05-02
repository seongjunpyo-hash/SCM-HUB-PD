/* scm-code-link — visual-only helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-code-link');
    if (options.codeType) el.setAttribute('data-code-type', options.codeType);
    if (typeof options.onClick === 'function') el.addEventListener('click', options.onClick);
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.codeLink = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
