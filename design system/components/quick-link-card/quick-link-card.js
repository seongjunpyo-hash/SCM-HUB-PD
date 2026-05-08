/* scm-quick-link-card — visual-only helper */
(function (root) {
  function mount(el) { if (el) el.classList.add('scm-quick-link-card'); return { el: el }; }
  root.SCM = root.SCM || {};
  root.SCM.quickLinkCard = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
