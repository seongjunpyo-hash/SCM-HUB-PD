/* ============================================================
 * scm-toggle — vanilla factory
 * ------------------------------------------------------------
 * input 기반과 div 기반 둘 다 지원.
 * Usage:
 *   const t = SCM.toggle.mount(el, { onChange: (on) => {} });
 *   t.set(true);
 *   t.toggle();
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    if (el.__scmToggle) return el.__scmToggle;

    var options = opts || {};
    el.classList.add('scm-toggle');
    if (options.size === 'sm') el.classList.add('scm-toggle--sm');
    if (options.disabled) el.classList.add('is-disabled');

    var input = el.querySelector('.scm-toggle-input');

    function getOn() {
      if (input) return input.checked;
      return el.classList.contains('is-on');
    }

    function setOn(v) {
      if (input) {
        input.checked = !!v;
      } else {
        el.classList.toggle('is-on', !!v);
      }
    }

    function fireChange() {
      if (typeof options.onChange === 'function') {
        options.onChange(getOn(), el);
      }
    }

    function clickHandler(e) {
      if (el.classList.contains('is-disabled')) return;
      // input 기반은 native change 가 발생 → 별도 토글 안 함
      if (input) return;
      e.preventDefault();
      setOn(!getOn());
      fireChange();
    }

    function inputChangeHandler() {
      fireChange();
    }

    el.addEventListener('click', clickHandler);
    if (input) input.addEventListener('change', inputChangeHandler);

    if (typeof options.checked === 'boolean') setOn(options.checked);

    var api = {
      el: el,
      get: getOn,
      set: function (v) { setOn(v); fireChange(); return api; },
      toggle: function () { setOn(!getOn()); fireChange(); return api; },
      setDisabled: function (v) { el.classList.toggle('is-disabled', !!v); return api; },
      destroy: function () {
        el.removeEventListener('click', clickHandler);
        if (input) input.removeEventListener('change', inputChangeHandler);
        delete el.__scmToggle;
      },
    };
    el.__scmToggle = api;
    return api;
  }

  root.SCM = root.SCM || {};
  root.SCM.toggle = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
