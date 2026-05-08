/* ============================================================
 * scm-tabs — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   const t = SCM.tabs.mount(el, {
 *     variant: 'underline',
 *     onChange: (key) => {},
 *   });
 *   t.activate('barcode-used');
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-tabs');
    if (options.variant === 'underline') el.classList.add('scm-tabs--underline');
    if (options.variant === 'pill') el.classList.add('scm-tabs--pill');

    function activate(key) {
      var matched = null;
      el.querySelectorAll('.scm-tab').forEach(function (b) {
        var k = b.getAttribute('data-key');
        if (k === key) {
          b.classList.add('is-active');
          matched = b;
        } else {
          b.classList.remove('is-active');
        }
      });
      return matched;
    }

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('.scm-tab');
      if (!btn) return;
      var k = btn.getAttribute('data-key');
      activate(k);
      if (typeof options.onChange === 'function') options.onChange(k, btn);
    });

    return {
      el: el,
      activate: activate,
      get: function () {
        var act = el.querySelector('.scm-tab.is-active');
        return act ? act.getAttribute('data-key') : null;
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.tabs = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
