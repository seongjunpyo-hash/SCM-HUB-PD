/* scm-activity-item — visual-only helper */
(function (root) {
  function mount(el) { if (el) el.classList.add('scm-activity-item'); return { el: el }; }
  root.SCM = root.SCM || {};
  root.SCM.activityItem = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
