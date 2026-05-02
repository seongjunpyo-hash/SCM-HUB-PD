/* ============================================================
 * scm-tag — vanilla helpers
 * ------------------------------------------------------------
 * Visual-only. 단순 클래스 부착 헬퍼.
 * ============================================================ */

(function (root) {
  var VARIANTS = ['blue', 'green', 'gray'];

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-tag');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-tag--' + options.variant);
    }
    return {
      el: el,
      setVariant: function (v) {
        VARIANTS.forEach(function (n) { el.classList.remove('scm-tag--' + n); });
        if (v && VARIANTS.indexOf(v) !== -1) el.classList.add('scm-tag--' + v);
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.tag = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
