/* ============================================================
 * scm-pgsize-select — vanilla factory
 * ------------------------------------------------------------
 * Usage:
 *   const ps = SCM.pgsizeSelect.mount(wrap, {
 *     value: 100,
 *     options: [20, 50, 100, 200],
 *     formatter: (n) => n + '개씩',
 *     onChange: (n) => {},
 *   });
 *   ps.set(50);
 * ============================================================ */

(function (root) {
  function mount(wrap, opts) {
    if (!wrap) return null;
    var options = opts || {};
    wrap.classList.add('scm-pgsize-wrap');

    var btn = wrap.querySelector('.scm-pgsize');
    var label = wrap.querySelector('.scm-pgsize__label');
    var popup = wrap.querySelector('.scm-pgsize-popup');
    if (!btn || !popup) return null;

    var values = options.options || [20, 100, 300, 500, 1000];
    var fmt = options.formatter || function (n) { return n + '개씩'; };
    var current = options.value != null ? options.value : values[0];

    // popup 옵션 렌더 (마크업 없으면 자동 생성)
    if (popup.children.length === 0) {
      values.forEach(function (v) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', String(v));
        li.textContent = fmt(v);
        popup.appendChild(li);
      });
    }

    function sync() {
      if (label) label.textContent = fmt(current);
      Array.from(popup.children).forEach(function (li) {
        var v = parseInt(li.getAttribute('data-value'), 10);
        li.setAttribute('aria-selected', String(v === current));
      });
    }

    function open() {
      popup.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      popup.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (popup.classList.contains('is-open')) close(); else open();
    }

    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    popup.addEventListener('click', function (e) {
      var li = e.target.closest('[data-value]');
      if (!li) return;
      var v = parseInt(li.getAttribute('data-value'), 10);
      current = v;
      sync();
      close();
      if (typeof options.onChange === 'function') options.onChange(v);
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) close();
    });

    sync();

    return {
      el: wrap,
      get: function () { return current; },
      set: function (v) { current = v; sync(); },
      open: open,
      close: close,
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.pgsizeSelect = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
