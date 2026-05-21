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
  // ===== Canonical topbar markup =====
  // 모든 데모 페이지의 topbar 마크업이 동일해야 하므로 단일 source.
  // 페이지는 빈 <header class="scm-topbar" role="banner"></header> placeholder
  // 만 두면 mount() 가 자동으로 inject. 수정 시 이 변수만 갱신.
  var CANONICAL_TOPBAR_HTML = `<header class="scm-topbar" role="banner">
  <div class="scm-topbar__left">
    <button class="scm-topbar__menu-btn" type="button" data-scm-lnb-toggle aria-label="메뉴 열기/닫기">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12H20.0714M4 6H20.0714M4 18H20.0714" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="round" fill="none"/>
      </svg>
    </button>
    <a class="scm-topbar__logo" href="dashboard.html" aria-label="SCM-Hub 홈">
      <svg viewBox="0 0 96 18" aria-hidden="true">
        <path d="M85.3496 1.61133V6.90625C85.7984 6.47277 86.9465 5.55859 88.8203 5.55859C91.9664 5.55882 94.2324 8.02321 94.2324 11.1191C94.2323 14.215 91.9663 16.6785 88.8203 16.6787C86.817 16.6787 85.6764 15.6848 85.2168 15.1523L84.6914 16.4482L84.666 16.5107H83.1973V1.61133H85.3496ZM88.6729 7.62793C86.6351 7.62794 85.3076 9.19315 85.3076 11.1191C85.3077 13.045 86.6351 14.6103 88.6729 14.6104C90.7106 14.6104 92.038 13.045 92.0381 11.1191C92.0381 9.19314 90.7107 7.62793 88.6729 7.62793Z" fill="currentColor"/>
        <path d="M74.9072 5.81055V12.5674C74.9073 13.4123 75.113 13.9079 75.4238 14.2188C75.7602 14.5551 76.2172 14.7353 76.7393 14.7354C77.2613 14.7354 77.7183 14.5551 78.0547 14.2188C78.3658 13.9077 78.5713 13.4329 78.5713 12.5674V5.81055H80.7451V16.5098H79.2812L78.9209 15.7891C78.5897 16.1418 77.7942 16.7411 76.3408 16.7412C74.3798 16.7412 72.7129 15.3361 72.7129 13.1338V5.81055H74.9072Z" fill="currentColor"/>
        <path d="M59.9746 1.61133V7.78516H67.6074V1.61133H69.9287V16.5107H67.6074V10.0635H59.9746V16.5107H57.6543V1.61133H59.9746Z" fill="currentColor"/>
        <path d="M55.085 9.69727V11.9971H48.9004V9.69727H55.085Z" fill="currentColor"/>
        <path d="M33.2148 1.61133L33.2441 1.6582L38.4297 10.0664L43.6367 1.6582L43.666 1.61133H46.3213V16.5107H44.0215V5.16895L39.4814 12.4941L39.4521 12.542H37.4082L37.3789 12.4941L32.8604 5.1709V16.5107H30.5605V1.61133H33.2148Z" fill="currentColor"/>
        <path d="M20.8125 1.40039C24.402 1.40039 27.1131 3.42106 27.9238 6.51465L27.9561 6.63965H25.4473L25.4238 6.5752C24.7679 4.833 23.1271 3.6582 20.8125 3.6582C17.6172 3.65842 15.4953 6.02401 15.4951 9.05957C15.4951 12.0935 17.6362 14.4617 20.9385 14.4619C23.2565 14.4619 25.0415 13.2841 25.6963 11.5449L25.7207 11.4805H28.2295L28.1963 11.6055C27.3849 14.7011 24.5254 16.7197 20.9385 16.7197C16.3491 16.7195 13.1113 13.5053 13.1113 9.05957C13.1115 4.61571 16.2847 1.4006 20.8125 1.40039Z" fill="currentColor"/>
        <path d="M6.58008 1.40039C8.00725 1.40041 9.16335 1.8319 9.96289 2.61523C10.7625 3.39871 11.1952 4.52346 11.1953 5.88867V5.98926H8.76855V5.61621C8.76855 4.9693 8.54277 4.47783 8.16309 4.14746C7.78158 3.81556 7.23461 3.63673 6.58008 3.63672C5.91491 3.63672 5.3783 3.81593 5.00977 4.12988C4.64309 4.44242 4.43268 4.89677 4.43262 5.46875C4.43262 5.97 4.57135 6.33564 4.92578 6.66309C5.28822 6.99784 5.88072 7.29742 6.80371 7.64355L7.64453 7.95801C8.9502 8.44273 9.74471 8.86969 10.3906 9.55859C11.0368 10.2478 11.4258 11.0278 11.4258 12.252C11.4258 14.6421 9.42384 16.7197 6.60059 16.7197C5.21506 16.7196 3.97684 16.2828 3.08398 15.46C2.18996 14.6359 1.65039 13.4321 1.65039 11.916V11.8164H4.07617V12.126C4.07617 12.8674 4.33961 13.4538 4.78125 13.8555C5.2239 14.258 5.85415 14.4833 6.60059 14.4834C7.34821 14.4834 7.94765 14.2683 8.3584 13.8975C8.76809 13.5275 9 12.9936 9 12.3359C8.99999 11.9579 8.93955 11.6633 8.82812 11.4238C8.71705 11.1853 8.55272 10.9951 8.33398 10.8301C7.88946 10.4948 7.23524 10.27 6.37695 9.95215L5.36914 9.57324C4.25265 9.15193 3.47465 8.74531 2.91113 8.05176C2.35254 7.36415 2.00684 6.58617 2.00684 5.51074C2.0069 4.54201 2.3672 3.51388 3.12109 2.72754C3.87671 1.93954 5.02247 1.40039 6.58008 1.40039Z" fill="currentColor"/>
      </svg>
    </a>
    <span class="scm-topbar__demo-tag" aria-label="데모 환경">DEMO</span>
  </div>
  <div class="scm-topbar__end">
    <button class="scm-topbar__notify-btn" type="button" aria-label="알림함" aria-haspopup="dialog" aria-expanded="false">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <span class="scm-topbar__notify-badge" aria-hidden="true">2</span>
    </button>
    <div class="scm-topbar__right" role="button" tabindex="0">
      <span class="scm-topbar__avatar">홍</span>
      <div class="scm-topbar__name-group">
        <span class="scm-topbar__name">
          <span class="scm-topbar__name-first">홍길동</span>
          <span class="scm-topbar__name-suffix">님</span>
        </span>
        <span class="scm-topbar__chev">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 6L8 11L13 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </span>
      </div>
    </div>
  </div>
</header>
`;

  function setText(el, text) {
    if (el && typeof text === 'string') el.textContent = text;
  }

  function mount(el, opts) {
    if (!el) return null;
    if (el.children.length === 0 && CANONICAL_TOPBAR_HTML) {
      // Extract inner HTML from the canonical <header>...</header> string
      var tmp = document.createElement('div');
      tmp.innerHTML = CANONICAL_TOPBAR_HTML;
      var src = tmp.firstElementChild;
      if (src) el.innerHTML = src.innerHTML;
    }
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

  // Auto-mount — 페이지 인라인 SCM.topbar.mount() 호출 없이도 동작
  function autoMount() {
    var nodes = document.querySelectorAll('.scm-topbar');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length === 0) mount(el);
    }
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoMount, { once: true });
    } else {
      autoMount();
    }
  }

  root.SCM = root.SCM || {};
  root.SCM.topbar = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
