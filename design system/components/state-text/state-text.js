/* scm-state-text — visual-only helper */
(function (root) {
  var VARIANTS = ['accent', 'critical'];
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-state-text');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-state-text--' + options.variant);
    }
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.stateText = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
