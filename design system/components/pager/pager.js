/* ============================================================
 * scm-pager — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   const p = SCM.pager.mount(el, {
 *     current: 1, total: 99,
 *     onPrev: () => {}, onNext: () => {},
 *   });
 *   p.set(5);   // 현재 페이지 변경
 * ============================================================ */

(function (root) {
  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-pager');

    var curEl = el.querySelector('.scm-pager__current');
    var totalEl = el.querySelector('.scm-pager__total span');
    var prevBtn = el.querySelector('[aria-label="이전 페이지"]') || el.querySelector('.scm-pager-btn[data-dir="prev"]');
    var nextBtn = el.querySelector('[aria-label="다음 페이지"]') || el.querySelector('.scm-pager-btn[data-dir="next"]');

    var current = options.current != null ? options.current : (parseInt(curEl && curEl.textContent, 10) || 1);
    var total = options.total != null ? options.total : (parseInt(totalEl && totalEl.textContent, 10) || 1);

    function sync() {
      if (curEl) curEl.textContent = String(current);
      if (totalEl) totalEl.textContent = String(total);
      if (prevBtn) prevBtn.disabled = current <= 1;
      if (nextBtn) nextBtn.disabled = current >= total;
    }

    function go(n) {
      if (n < 1 || n > total) return;
      current = n;
      sync();
      if (typeof options.onChange === 'function') options.onChange(current);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1); if (options.onPrev) options.onPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1); if (options.onNext) options.onNext(); });

    sync();

    return {
      el: el,
      get: function () { return { current: current, total: total }; },
      set: function (n) { go(n); },
      setTotal: function (t) { total = t; sync(); },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.pager = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
