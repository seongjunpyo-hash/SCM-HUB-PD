/* scm-filter-reset-btn — vanilla helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-filter-reset-btn');
    if (typeof options.onClick === 'function') el.addEventListener('click', options.onClick);
    return {
      el: el,
      show: function () { el.removeAttribute('hidden'); },
      hide: function () { el.setAttribute('hidden', ''); },
    };
  }
  root.SCM = root.SCM || {};
  root.SCM.filterResetBtn = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
