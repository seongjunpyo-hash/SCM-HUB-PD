/* ============================================================
 * scm-shell.js — 데모 페이지 공통 스크립트 번들 로더
 * ------------------------------------------------------------
 * 이전: 각 데모 페이지가 개별적으로 4개 <script src="..."> 를 작성 →
 *       한 줄 빼먹으면 그 페이지만 동작 깨짐 (ex. profile-menu.js 누락
 *       으로 OTB 페이지 프로필 모달 안됨).
 *
 * 이후: 페이지는 <script src="/auth-gate.js"></script> +
 *       <script src="/scm-shell.js" defer></script> 두 줄만 작성.
 *       나머지 공통 스크립트는 본 파일이 일괄 주입.
 *
 * auth-gate.js 는 동기 redirect 로직 (미로그인 → /login.html) 이
 * 있으므로 별도 동기 로드 유지 — defer 로 늦추면 미인증 상태로
 * 잠시 페이지가 노출될 수 있음.
 *
 * 추가 책임:
 *   - sticky-filter / sticky-stats 토큰 dynamic 측정 (이전 각 페이지의
 *     syncStickyVars 보일러플레이트를 단일 source 로 통합)
 *
 * 추가/제거할 공통 스크립트는 아래 SCRIPTS 배열만 수정하면 모든
 * 데모 페이지에 일괄 반영.
 * ============================================================ */
(function () {
  if (window.__scmShellBooted) return;
  window.__scmShellBooted = true;

  var SCRIPTS = [
    // 추가 DOM 빌더 단일 source — dev-export.js 가 추가 테이블 / 필터 wrapper
    // 결정 시 사용. 반드시 dev-export.js 앞에 두어야 함.
    '/voc/added-dom-builders.js',
    '/voc/comment-overlay.js',
    '/dev-export.js',
    '/profile-menu.js',
  ];

  SCRIPTS.forEach(function (src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  });

  // sticky-filter / sticky-stats 토큰 — 페이지 #filter-bar 와 .scm-stats-bar
  // 의 실측 높이를 :root 변수로 set. 페이지마다 동일했던 보일러플레이트.
  function syncStickyVars() {
    var root = document.documentElement;
    var fb = document.getElementById('filter-bar');
    var sb = document.querySelector('.scm-stats-bar');
    root.style.setProperty('--scm-sticky-filter', (fb ? fb.offsetHeight : 0) + 'px');
    root.style.setProperty('--scm-sticky-stats',  (sb ? sb.offsetHeight : 0) + 'px');
  }
  function bootStickyVars() {
    syncStickyVars();
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(syncStickyVars);
      document.querySelectorAll('#filter-bar, .scm-stats-bar').forEach(function (el) { ro.observe(el); });
    }
    window.addEventListener('resize', syncStickyVars);
  }

  // filter-bar / filter-drawer 자동 mount — 페이지마다 복붙되어 있던
  // SCM.filterBar.mount(#filter-bar) / SCM.filterDrawer.mount(#filter-drawer)
  // 보일러플레이트 통합. 마크업 (placeholder element + open button) 만 있으면
  // 자동 동작.
  function bootFilterMounts() {
    if (window.SCM && SCM.filterBar) {
      var fb = document.getElementById('filter-bar');
      if (fb && !fb.dataset.scmFilterBarMounted) {
        fb.dataset.scmFilterBarMounted = '1';
        try { SCM.filterBar.mount(fb); } catch (_) {}
      }
    }
    if (window.SCM && SCM.filterDrawer) {
      var fd = document.getElementById('filter-drawer');
      var bd = document.getElementById('fd-backdrop');
      var openBtn = document.getElementById('filter-drawer-open');
      if (fd && !fd.dataset.scmFilterDrawerMounted) {
        fd.dataset.scmFilterDrawerMounted = '1';
        try {
          var inst = SCM.filterDrawer.mount(fd, { backdrop: bd || undefined });
          if (openBtn && inst && typeof inst.open === 'function') {
            openBtn.addEventListener('click', inst.open);
          }
        } catch (_) {}
      }
    }
  }

  function boot() {
    bootStickyVars();
    bootFilterMounts();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
