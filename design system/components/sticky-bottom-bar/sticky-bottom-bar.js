/* scm-sticky-bottom-bar — visual-only helper */
(function (root) {
  function mount(el) { if (el) el.classList.add('scm-sticky-bottom-bar'); return { el: el }; }
  root.SCM = root.SCM || {};
  root.SCM.stickyBottomBar = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
