/* ============================================================
 * scm-topbar — vanilla factory (IIFE)
 * ------------------------------------------------------------
 * Usage:
 *   SCM.topbar.mount(document.querySelector('.scm-topbar'), {
 *     userName: '홍길동',          // first-name
 *     userSuffix: '님',             // 호칭 ('님')
 *     userInitial: '홍',            // avatar 1글자
 *     demoTag: 'DEMO',              // '' 면 hide
 *     onLnbToggle: function () { } // optional; default → SCM.lnb.toggle()
 *   });
 *
 * - data-scm-lnb-toggle 버튼 클릭을 잡아 onLnbToggle 호출
 * - opts 미지정 시 마크업 텍스트 그대로 유지
 * ============================================================ */

(function (root) {
  function setText(el, text) {
    if (el && typeof text === 'string') el.textContent = text;
  }

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};

    var firstEl = el.querySelector('.scm-topbar__name-first');
    var suffixEl = el.querySelector('.scm-topbar__name-suffix');
    var avatarEl = el.querySelector('.scm-topbar__avatar');
    var demoEl = el.querySelector('.scm-topbar__demo-tag');
    var menuBtn = el.querySelector('[data-scm-lnb-toggle], .scm-topbar__menu-btn');

    if (options.userName) setText(firstEl, options.userName);
    if (typeof options.userSuffix === 'string') setText(suffixEl, options.userSuffix);
    if (options.userInitial) setText(avatarEl, options.userInitial);
    if (typeof options.demoTag === 'string') {
      if (options.demoTag) {
        setText(demoEl, options.demoTag);
        if (demoEl) demoEl.style.display = '';
      } else if (demoEl) {
        demoEl.style.display = 'none';
      }
    }

    function defaultToggle() {
      if (root.SCM && root.SCM.lnb && typeof root.SCM.lnb.toggle === 'function') {
        root.SCM.lnb.toggle();
      } else {
        var html = document.documentElement;
        html.classList.toggle('is-lnb-open');
        try {
          localStorage.setItem(
            'scm-lnb-open',
            html.classList.contains('is-lnb-open') ? '1' : '0'
          );
        } catch (_) {}
      }
    }

    var handler = function () {
      if (typeof options.onLnbToggle === 'function') options.onLnbToggle();
      else defaultToggle();
    };

    if (menuBtn) menuBtn.addEventListener('click', handler);

    return {
      el: el,
      setUserName: function (name) { setText(firstEl, name); },
      setUserInitial: function (init) { setText(avatarEl, init); },
      setDemoTag: function (tag) { setText(demoEl, tag); },
      destroy: function () {
        if (menuBtn) menuBtn.removeEventListener('click', handler);
      },
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.topbar = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
