/* scm-bar-chart — visual-only helper (실제는 Chart lib 권장) */
(function (root) {
  function mount(el) { if (el) el.classList.add('scm-bar-chart'); return { el: el }; }
  root.SCM = root.SCM || {};
  root.SCM.barChart = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
