/* scm-download-btn — vanilla helper */
(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-download-btn');
    if (typeof options.onClick === 'function') el.addEventListener('click', options.onClick);
    return { el: el };
  }
  root.SCM = root.SCM || {};
  root.SCM.downloadBtn = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
