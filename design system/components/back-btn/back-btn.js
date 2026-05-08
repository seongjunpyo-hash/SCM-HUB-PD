/* scm-back-btn — vanilla helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-back-btn');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', '뒤로');
    if (typeof options.onClick === 'function') {
      el.addEventListener('click', options.onClick);
    }
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.backBtn = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
