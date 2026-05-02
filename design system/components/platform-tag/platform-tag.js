/* scm-platform-tag — visual-only helper */
(function (root) {
  var COLORS = ['blue', 'yellow', 'gray'];
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-platform-tag');
    if (options.color && COLORS.indexOf(options.color) !== -1) {
      el.setAttribute('data-color', options.color);
    }
    return {
      el: el,
      setColor: function (c) {
        if (c && COLORS.indexOf(c) !== -1) el.setAttribute('data-color', c);
        else el.removeAttribute('data-color');
      },
    };
  }
  root.SCM = root.SCM || {};
  root.SCM.platformTag = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
