/* ============================================================
 * scm-textarea — vanilla helper
 * ------------------------------------------------------------
 * autoresize + count 바인딩.
 *
 *   SCM.textarea.mount(elTextarea, {
 *     autoresize: true,
 *     count: { el: elCountNum, max: 200 }
 *   });
 * ============================================================ */

(function (root) {
  function resizeTo(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-textarea');

    if (options.autoresize) {
      el.classList.add('scm-textarea--autoresize');
      // 초기값
      resizeTo(el);
      el.addEventListener('input', function () { resizeTo(el); });
    }

    if (options.count && options.count.el) {
      var countEl = options.count.el;
      var update = function () {
        countEl.textContent = String(el.value.length);
      };
      el.addEventListener('input', update);
      update();
    }

    if (options.disabled) el.disabled = true;

    return {
      el: el,
      setDisabled: function (v) { el.disabled = !!v; },
      resize: function () { if (options.autoresize) resizeTo(el); },
    };
  }

  if (!root.SCM) root.SCM = {};
  root.SCM.textarea = { mount: mount };
})(typeof window !== 'undefined' ? window : this);
