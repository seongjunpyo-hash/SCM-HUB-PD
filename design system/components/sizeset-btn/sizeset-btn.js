/* ============================================================
 * scm-sizeset-btn — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   SCM.sizesetBtn.mount(el, {
 *     used: 5, total: 9,
 *     label: '전개',
 *     onClick: () => openSizeDrawer(),
 *   });
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-sizeset-btn');

    if (options.used != null && options.total != null) {
      el.innerHTML =
        '<span>' + (options.label || '전개') + '</span>' +
        '<span class="scm-sizeset-btn__num">' +
          '<em>' + options.used + '</em>' +
          '<span class="divider">/</span>' +
          '<span class="total">' + options.total + '</span>' +
        '</span>';
    }

    if (options.disabled) el.disabled = true;
    if (typeof options.onClick === 'function') el.addEventListener('click', options.onClick);

    return {
      el: el,
      setCount: function (used, total) {
        var em = el.querySelector('.scm-sizeset-btn__num em');
        var totalEl = el.querySelector('.scm-sizeset-btn__num .total');
        if (em) em.textContent = used;
        if (totalEl) totalEl.textContent = total;
      },
      setDisabled: function (v) { el.disabled = !!v; },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.sizesetBtn = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
