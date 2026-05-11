/* ============================================================
 * scm-icon-button — vanilla helper
 * ------------------------------------------------------------
 * 클래스 부착 + 옵션 적용.
 * ============================================================ */

(function (root) {
  var VARIANTS = ['filled', 'outlined'];
  var SIZES = ['xl', 'lg', 'sm', 'xs', '2xs'];

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-icon-button');
    if (options.variant && VARIANTS.indexOf(options.variant) !== -1) {
      el.classList.add('scm-icon-button--' + options.variant);
    }
    if (options.size && SIZES.indexOf(options.size) !== -1) {
      el.classList.add('scm-icon-button--' + options.size);
    }
    if (options.disabled) el.disabled = true;
    if (options.ariaLabel && !el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', options.ariaLabel);
    }
    if (typeof options.onClick === 'function') {
      el.addEventListener('click', options.onClick);
    }
    return {
      el: el,
      setDisabled: function (v) { el.disabled = !!v; },
    };
  }

  if (!root.SCM) root.SCM = {};
  root.SCM.iconButton = { mount: mount };
})(typeof window !== 'undefined' ? window : this);
