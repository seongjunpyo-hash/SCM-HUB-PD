/* scm-stat — visual + count update helper */
(function (root) {
  var VARIANTS = ['all', 'deployed', 'undeployed', 'selected'];

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-stat');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-stat--' + options.variant);
    }
    var numEl = el.querySelector('.scm-stat__num');
    return {
      el: el,
      setCount: function (n) { if (numEl) numEl.textContent = String(n); },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.stat = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
