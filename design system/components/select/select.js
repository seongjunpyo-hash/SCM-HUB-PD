/* ============================================================
 * scm-select — vanilla helper (트리거 버튼만)
 * ------------------------------------------------------------
 * 실제 드롭다운 popup 은 별도 모듈 (Stage 7) 또는 호출처에서.
 * 이 모듈은 시각 트리거 + state 관리 헬퍼.
 *
 * Usage:
 *   const sel = SCM.select.mount(el, {
 *     value: '',
 *     placeholder: '선택하세요',
 *     onClick: () => openMyPopup(),
 *   });
 *   sel.setValue('옵션1');
 *   sel.setExpanded(true);
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-select');
    if (options.size === 'sm') el.classList.add('scm-select--sm');
    if (options.size === 'bu') el.classList.add('scm-select--bu');
    if (options.disabled) el.classList.add('is-disabled');

    var valueEl = el.querySelector('.scm-select__value');
    var placeholder = options.placeholder || (valueEl ? valueEl.textContent : '');

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

    setValue(options.value);
    setExpanded(false);

    if (typeof options.onClick === 'function') {
      el.addEventListener('click', function (e) {
        if (el.classList.contains('is-disabled')) return;
        options.onClick(e);
      });
    }

    return {
      el: el,
      setValue: setValue,
      setExpanded: setExpanded,
      setDisabled: function (v) { el.classList.toggle('is-disabled', !!v); },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.select = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
