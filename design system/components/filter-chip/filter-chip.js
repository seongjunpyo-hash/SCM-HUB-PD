/* scm-filter-chip — vanilla helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-filter-chip');
    if (typeof options.onClick === 'function') el.addEventListener('click', options.onClick);
    var countEl = el.querySelector('.scm-filter-chip__count');
    return {
      el: el,
      setCount: function (n) {
        if (!countEl) return;
        if (n == null || n === 0) countEl.style.display = 'none';
        else { countEl.style.display = ''; countEl.textContent = String(n); }
      },
    };
  }
  root.SCM = root.SCM || {};
  root.SCM.filterChip = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
