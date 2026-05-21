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
    // D1 영구 저장 sync — voc / 데모 모두 동일 모듈. localStorage 가 아닌 D1 이
    // 진실원천. 반드시 lnb.js / dev-export.js 의 localStorage 읽기 BEFORE 에
    // bootstrap 이 끝나야 정확한 데이터가 mount 에 들어감 → bootSync() 안에서
    // bootstrap 끝난 후 dispatch.
    '/voc-config-sync.js',
    // 추가 DOM 빌더 단일 source — dev-export.js 가 추가 테이블 / 필터 wrapper
    // 결정 시 사용. 반드시 dev-export.js 앞에 두어야 함.
    '/voc/added-dom-builders.js',
    '/voc/comment-overlay.js',
    '/dev-export.js',
    '/profile-menu.js',
    '/notify-box.js',
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

  // D1 영구 저장 sync — D1 의 진실원천을 받아 localStorage 에 mirror 한 후
  // LNB 를 다시 mount → 다른 탭/세션 / Clear site data 후에도 메뉴 / 페이지
  // 편집 데이터가 유지됨. defer-loaded voc-config-sync.js 가 준비될 때까지 폴.
  function bootConfigSync() {
    function tryBootstrap() {
      if (window.SCM_CONFIG_SYNC && typeof window.SCM_CONFIG_SYNC.bootstrap === 'function') {
        window.SCM_CONFIG_SYNC.bootstrap().then(function () {
          // localStorage 갱신 완료 → LNB / dev-export 재적용. lnb.js 는 이미
          // mount 됐을 가능성 → re-mount 로 새 데이터 반영.
          var lnbs = document.querySelectorAll('.scm-lnb');
          if (window.SCM && SCM.lnb && SCM.lnb.mount) {
            lnbs.forEach(function (el) {
              try { el.innerHTML = ''; SCM.lnb.mount(el); } catch (_) {}
            });
          }
          try { document.dispatchEvent(new CustomEvent('scm:config-applied')); } catch (_) {}
        });
        return true;
      }
      return false;
    }
    if (!tryBootstrap()) {
      // sync 모듈 아직 안 로드됨 — 짧은 폴.
      var n = 0;
      var iv = setInterval(function () {
        if (tryBootstrap() || ++n > 40) clearInterval(iv);
      }, 50);
    }
  }
  // 같은-origin 다른 탭의 변경 즉시 반영 — BroadcastChannel.
  function bootBroadcast() {
    if (typeof BroadcastChannel === 'undefined' || window.__scmShellBcWired) return;
    try {
      var bc = new BroadcastChannel('scm-voc-config');
      bc.addEventListener('message', function (e) {
        if (!e || !e.data || e.data.type !== 'config-changed') return;
        // 다른 탭이 localStorage 를 갱신했음. broadcaster 는 push() 호출 직후
        // 즉시 broadcast 하므로 그 시점 D1 PUT 은 아직 디바운스 (600ms) 중 —
        // 이 시점에 _refetch (D1 GET) 하면 옛 D1 응답으로 방금 갱신된
        // localStorage 를 덮어써 reorder 한 게 사라지는 race 발생.
        // → broadcaster 가 이미 localStorage 에 NEW 값을 써놨으므로 LNB 만
        //    localStorage 다시 읽어 re-mount 하면 충분. _refetch 하면 안 됨.
        var lnbs = document.querySelectorAll('.scm-lnb');
        if (window.SCM && SCM.lnb && SCM.lnb.mount) {
          lnbs.forEach(function (el) { try { el.innerHTML = ''; SCM.lnb.mount(el); } catch (_) {} });
        }
      });
      window.__scmShellBcWired = true;
    } catch (_) {}
  }

  function boot() {
    bootStickyVars();
    bootFilterMounts();
    bootConfigSync();
    bootBroadcast();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
