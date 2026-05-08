/* scm-stats-bar — visual-only helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-stats-bar');
    if (options.sticky) el.classList.add('scm-stats-bar--sticky');
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.statsBar = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
