/* ============================================================
 * scm-text-button — vanilla helper
 * ------------------------------------------------------------
 * 클래스 부착 + 옵션 적용. 실제 동작은 native button 그대로.
 * ============================================================ */

(function (root) {
  var VARIANTS = ['secondary', 'negative', 'accent'];
  var SIZES = ['sm', 'lg', 'xl'];

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-text-button');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-text-button--' + options.variant);
    }
    if (options.size && SIZES.indexOf(options.size) !== -1) {
      el.classList.add('scm-text-button--' + options.size);
    }
    if (options.underline) el.classList.add('scm-text-button--underline');
    if (options.disabled) el.disabled = true;
    if (typeof options.onClick === 'function') {
      el.addEventListener('click', options.onClick);
    }
    return {
      el: el,
      setDisabled: function (v) { el.disabled = !!v; },
    };
  }

  if (!root.SCM) root.SCM = {};
  root.SCM.textButton = { mount: mount };
})(typeof window !== 'undefined' ? window : this);
