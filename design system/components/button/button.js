/* ============================================================
 * scm-button — vanilla helper
 * ------------------------------------------------------------
 * 클래스 부착 + 옵션 적용. 실제 동작은 native button 그대로.
 * ============================================================ */

(function (root) {
  var VARIANTS = ['primary', 'ghost'];
  var SIZES = ['sm', 'lg'];

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-button');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-button--' + options.variant);
    }
    if (options.size && SIZES.indexOf(options.size) !== -1) {
      el.classList.add('scm-button--' + options.size);
    }
    if (options.block) el.classList.add('scm-button--block');
    if (options.disabled) el.disabled = true;
    if (typeof options.onClick === 'function') {
      el.addEventListener('click', options.onClick);
    }
    return {
      el: el,
      setDisabled: function (v) { el.disabled = !!v; },
      setVariant: function (v) {
        VARIANTS.forEach(function (n) { el.classList.remove('scm-button--' + n); });
        if (v && VARIANTS.indexOf(v) !== -1) el.classList.add('scm-button--' + v);
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.button = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
