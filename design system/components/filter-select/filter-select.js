/* ============================================================
 * scm-filter-select — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   const fs = SCM.filterSelect.mount(el, {
 *     onClick: () => openMyPopover(el),
 *   });
 *   fs.setValue('전개중');     // data-state → filled
 *   fs.setValue('');           // data-state → placeholder
 *   fs.setExpanded(true);
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-filter-select');

    var labelEl = el.querySelector('.scm-filter-select__label');
    var valueEl = el.querySelector('.scm-filter-select__value');
    var placeholder = options.placeholder || (valueEl ? valueEl.textContent : '');
    if (!el.hasAttribute('data-state')) el.setAttribute('data-state', 'placeholder');
    if (!el.hasAttribute('aria-expanded')) el.setAttribute('aria-expanded', 'false');

    function setValue(v) {
      if (!valueEl) return;
      if (v == null || v === '') {
        valueEl.textContent = placeholder;
        el.setAttribute('data-state', 'placeholder');
      } else {
        valueEl.textContent = v;
        el.setAttribute('data-state', 'filled');
      }
    }

    function setExpanded(v) {
      el.setAttribute('aria-expanded', v ? 'true' : 'false');
    }

    if (typeof options.onClick === 'function') {
      el.addEventListener('click', options.onClick);
    }

    if (options.value) setValue(options.value);

    return {
      el: el,
      setValue: setValue,
      setExpanded: setExpanded,
      setLabel: function (text) { if (labelEl) labelEl.firstChild.textContent = text + ' '; },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.filterSelect = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
