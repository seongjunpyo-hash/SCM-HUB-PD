/* ============================================================
 * scm-icon-box — vanilla factory
 * ------------------------------------------------------------
 * Visual-only 컴포넌트라 mount 는 단순 클래스 부착 헬퍼.
 *
 * Usage:
 *   SCM.iconBox.mount(el, { color: 'blue', size: 'sm' });
 * ============================================================ */

(function (root) {
  var COLORS = ['blue', 'green', 'orange', 'red'];
  var SIZES = ['sm'];

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-icon-box');
    if (options.color && COLORS.indexOf(options.color) !== -1) {
      el.classList.add('scm-icon-box--' + options.color);
    }
    if (options.size && SIZES.indexOf(options.size) !== -1) {
      el.classList.add('scm-icon-box--' + options.size);
    }
    return {
      el: el,
      setColor: function (color) {
        COLORS.forEach(function (c) { el.classList.remove('scm-icon-box--' + c); });
        if (color && COLORS.indexOf(color) !== -1) {
          el.classList.add('scm-icon-box--' + color);
        }
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.iconBox = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
