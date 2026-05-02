/* scm-page-head — visual-only helper */
(function (root) {
  var VARIANTS = ['list', 'detail', 'form', 'dashboard'];
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-page-head');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-page-head--' + options.variant);
    }
    if (options.sticky) el.classList.add('scm-page-head--sticky');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.pageHead = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
