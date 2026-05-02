/* ============================================================
 * scm-checkbox — vanilla factory
 * ------------------------------------------------------------
 * Usage:
 *   const cb = SCM.checkbox.mount(el, { onChange: (checked) => {} });
 *   cb.set(true);        // checked
 *   cb.set('mixed');     // indeterminate
 *   cb.toggle();
 * ============================================================ */

(function (root) {
  function readChecked(el) {
    var v = el.getAttribute('aria-checked');
    if (v === 'mixed') return 'mixed';
    return v === 'true';
  }

  function writeChecked(el, value) {
    if (value === 'mixed') el.setAttribute('aria-checked', 'mixed');
    else el.setAttribute('aria-checked', value ? 'true' : 'false');
  }

  function mount(el, opts) {
    if (!el) return null;
    if (el.__scmCheckbox) return el.__scmCheckbox;

    var options = opts || {};
    el.classList.add('scm-checkbox');
    el.setAttribute('role', 'checkbox');
    el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');
    if (!el.hasAttribute('aria-checked')) {
      writeChecked(el, !!options.checked);
    }
    if (options.disabled) el.classList.add('is-disabled');

    function fireChange() {
      if (typeof options.onChange === 'function') {
        options.onChange(readChecked(el), el);
      }
    }

    function clickHandler(e) {
      if (el.classList.contains('is-disabled')) return;
      e.preventDefault();
      var cur = readChecked(el);
      writeChecked(el, !(cur === true)); // mixed/false → true, true → false
      fireChange();
    }

    function keyHandler(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        clickHandler(e);
      }
    }

    el.addEventListener('click', clickHandler);
    el.addEventListener('keydown', keyHandler);

    var api = {
      el: el,
      get: function () { return readChecked(el); },
      set: function (v) { writeChecked(el, v); fireChange(); return api; },
      toggle: function () { writeChecked(el, readChecked(el) !== true); fireChange(); return api; },
      setDisabled: function (v) { el.classList.toggle('is-disabled', !!v); return api; },
      destroy: function () {
        el.removeEventListener('click', clickHandler);
        el.removeEventListener('keydown', keyHandler);
        delete el.__scmCheckbox;
      },
    };

    el.__scmCheckbox = api;
    return api;
  }

  root.SCM = root.SCM || {};
  root.SCM.checkbox = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
