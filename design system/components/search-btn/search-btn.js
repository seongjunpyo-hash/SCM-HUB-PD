/* scm-search-btn — vanilla helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-search-btn');
    if (options.disabled !== false) el.disabled = !!options.disabled || el.disabled;
    if (typeof options.onClick === 'function') el.addEventListener('click', options.onClick);
    return {
      el: el,
      setDisabled: function (v) { el.disabled = !!v; },
    };
  }
  root.SCM = root.SCM || {};
  root.SCM.searchBtn = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
