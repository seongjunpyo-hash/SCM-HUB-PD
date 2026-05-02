/* ============================================================
 * scm-input — vanilla helper
 * ------------------------------------------------------------
 * 클래스 부착 + char counter 자동 갱신.
 * Usage:
 *   SCM.input.mount(input, { size: 'sm', maxLength: 30, counter: counterEl });
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-input');
    if (options.size === 'sm') el.classList.add('scm-input--sm');
    if (options.disabled) el.disabled = true;

    var counter = options.counter || null;
    var maxLength = options.maxLength != null ? options.maxLength : el.maxLength > 0 ? el.maxLength : null;

    function syncCounter() {
      if (!counter) return;
      var len = el.value.length;
      counter.textContent = maxLength != null ? (len + ' / ' + maxLength) : String(len);
    }

    if (counter) {
      el.addEventListener('input', syncCounter);
      syncCounter();
    }

    return {
      el: el,
      setValue: function (v) { el.value = v; syncCounter(); },
      setDisabled: function (v) { el.disabled = !!v; },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.input = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
