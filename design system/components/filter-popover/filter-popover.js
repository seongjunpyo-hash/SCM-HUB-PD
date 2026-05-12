/* ============================================================
 * scm-filter-popover — vanilla helper
 * ------------------------------------------------------------
 * 인스턴스를 root element 위에 mount. open/close + anchor 위치
 * 계산 + 외부 클릭 / ESC 닫기.
 *
 * Usage:
 *   const fp = SCM.filterPopover.mount(rootEl);
 *   fp.openAt(anchorEl, 'list');     // mode 지정
 *   fp.close();
 * ============================================================ */

(function (root) {
  function mount(rootEl, opts) {
    if (!rootEl) return null;
    var options = opts || {};
    rootEl.classList.add('scm-filter-popover-root');

    var currentAnchor = null;

    // anchor 의 현재 viewport 위치를 기준으로 popover top/left 재계산
    function reposition() {
      if (!currentAnchor) return;
      var rect = currentAnchor.getBoundingClientRect();
      // sub-pixel rounding — anchor chip 의 rect.left 가 fractional 이면 border-box align 이
      // 1px 어긋나 보임. Math.round 로 정수 픽셀에 강제.
      var anchorLeft = Math.round(rect.left);
      var anchorBottom = Math.round(rect.bottom);
      rootEl.style.top = (anchorBottom + 4) + 'px';
      var pop = rootEl.querySelector('.scm-filter-popover');
      var w = pop ? pop.getBoundingClientRect().width : 280;
      // 우측 넘침 보정 — 넘치면 우측 8px 여백 두고 정렬
      if (anchorLeft + w > window.innerWidth - 8) {
        rootEl.style.left = (window.innerWidth - w - 8) + 'px';
      } else {
        rootEl.style.left = anchorLeft + 'px';
      }
    }

    function openAt(anchorEl, mode) {
      if (!anchorEl) return;
      currentAnchor = anchorEl;
      if (mode) rootEl.setAttribute('data-pop-mode', mode);
      rootEl.classList.add('is-open');
      reposition();
      // 스크롤/리사이즈 시 anchor 따라 popover 위치 갱신
      window.addEventListener('scroll', reposition, true);   // capture — 모든 ancestor scroll 캐치
      window.addEventListener('resize', reposition);
      setTimeout(function () { document.addEventListener('click', dismissOnOutside, true); }, 0);
    }

    function close() {
      rootEl.classList.remove('is-open');
      document.removeEventListener('click', dismissOnOutside, true);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      currentAnchor = null;
      if (typeof options.onClose === 'function') options.onClose();
    }

    function dismissOnOutside(e) {
      if (!rootEl.classList.contains('is-open')) return;
      if (rootEl.contains(e.target)) return;
      if (currentAnchor && currentAnchor.contains(e.target)) return;
      close();
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && rootEl.classList.contains('is-open')) close();
    });

    return {
      el: rootEl,
      openAt: openAt,
      close: close,
      reposition: reposition,
      isOpen: function () { return rootEl.classList.contains('is-open'); },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.filterPopover = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
