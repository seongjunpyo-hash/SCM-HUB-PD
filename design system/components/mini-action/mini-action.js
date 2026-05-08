/* ============================================================
 * scm-mini-action — vanilla factory
 * ------------------------------------------------------------
 * Usage:
 *   const m = SCM.miniAction.mount(wrap, {
 *     items: [{ key: 'rep', label: '대표스타일 복사' }, ...],
 *     onSelect: (key) => {},
 *   });
 *   m.setDisabled(true);
 * ============================================================ */

(function (root) {
  function mount(wrap, opts) {
    if (!wrap) return null;
    var options = opts || {};
    wrap.classList.add('scm-mini-wrap');

    var btn = wrap.querySelector('.scm-mini-action');
    var popup = wrap.querySelector('.scm-mini-popup');
    if (!btn) return null;

    if (options.variant === 'primary') btn.classList.add('scm-mini-action--primary');
    if (options.disabled) btn.disabled = true;

    function open() {
      if (!popup) return;
      popup.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      if (!popup) return;
      popup.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (!popup) return;
      popup.classList.contains('is-open') ? close() : open();
    }

    if (popup) {
      btn.addEventListener('click', function (e) {
        if (btn.disabled) return;
        e.stopPropagation();
        toggle();
      });
      popup.addEventListener('click', function (e) {
        var li = e.target.closest('[data-key]');
        if (!li) return;
        if (typeof options.onSelect === 'function') options.onSelect(li.getAttribute('data-key'), li);
        close();
      });
      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) close();
      });
    } else if (typeof options.onClick === 'function') {
      btn.addEventListener('click', options.onClick);
    }

    return {
      el: wrap,
      open: open,
      close: close,
      setDisabled: function (v) { btn.disabled = !!v; },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.miniAction = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
