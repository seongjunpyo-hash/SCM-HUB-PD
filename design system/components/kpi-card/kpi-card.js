/* scm-kpi-card — visual-only helper */
(function (root) {
  function mount(el) { if (el) el.classList.add('scm-kpi-card'); return { el: el }; }
  root.SCM = root.SCM || {};
  root.SCM.kpiCard = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
