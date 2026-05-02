/* ============================================================
 * scm-radio — vanilla helper
 * ------------------------------------------------------------
 * 라디오 자체는 native input 동작. 헬퍼는 disabled 토글, 값 변화
 * 이벤트 콜백 정도만 제공.
 *
 * Usage:
 *   SCM.radio.group(groupEl, { onChange: (value) => {} });
 * ============================================================ */

(function (root) {
  function group(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-radio-group');
    if (options.size === 'sm') el.classList.add('scm-radio-group--sm');
    if (options.layout === '2col') el.classList.add('scm-radio-group--2col');

    function handler(e) {
      var t = e.target;
      if (t && t.matches('input[type="radio"]')) {
        if (typeof options.onChange === 'function') options.onChange(t.value, t);
      }
    }
    el.addEventListener('change', handler);

    function getValue() {
      var checked = el.querySelector('input[type="radio"]:checked');
      return checked ? checked.value : null;
    }
    function setValue(v) {
      var inputs = el.querySelectorAll('input[type="radio"]');
      inputs.forEach(function (i) { i.checked = (i.value === v); });
    }

    return {
      el: el,
      getValue: getValue,
      setValue: setValue,
      destroy: function () { el.removeEventListener('change', handler); },
    };
  }

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-radio');
    if (options.size === 'sm') el.classList.add('scm-radio--sm');
    if (options.disabled) el.setAttribute('aria-disabled', 'true');
    return { el: el };
  }

  root.SCM = root.SCM || {};
  root.SCM.radio = { mount: mount, group: group };
})(typeof window !== 'undefined' ? window : globalThis);
