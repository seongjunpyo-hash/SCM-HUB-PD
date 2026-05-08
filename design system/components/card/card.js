/* scm-card — visual-only helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-card');
    if (options.variant === 'gray') el.classList.add('scm-card--gray');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.card = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
