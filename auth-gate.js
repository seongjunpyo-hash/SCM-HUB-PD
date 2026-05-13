/* ============================================================
 * SCM HUB · auth-gate
 * ------------------------------------------------------------
 * 페이지 로드 시 /api/auth/me 호출 → 미인증이면 /login.html 로 리다이렉트.
 * 인증되었으면 window.SCM_USER 에 사용자 객체 저장 + 'scm:auth-ready' 이벤트 발생.
 *
 * 추가: LNB 펼침 상태 FOUC 복원 (이전엔 각 페이지 inline script 였으나
 *       단일 source 로 여기서 처리). auth-gate 가 동기 로드라서 첫 paint
 *       이전에 .is-lnb-open 클래스 부여 가능.
 *
 * Usage:
 *   <script src="/auth-gate.js"></script>
 *   ...
 *   document.addEventListener('scm:auth-ready', (e) => {
 *     console.log(e.detail.user); // { id, email, name, role }
 *   });
 * ============================================================ */

// FOUC 방지 — DOM 파싱 시작 즉시 적용. IIFE 밖, sync 로드의 이점 활용.
try {
  if (typeof localStorage !== 'undefined' &&
      localStorage.getItem('scm-lnb-open') === '1' &&
      typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList.add('is-lnb-open');
  }
} catch (_) {}

// 일회성 마이그레이션 — 캐노니컬 'order' L1 (발주/입고 관리) 이 menu-deleted 에
// 들어가있어서 OTB 예산 관리가 LNB 에서 숨겨진 케이스 자동 복구. FIX_KEY 로
// 한 번만 실행되게 마킹. 사용자가 명시적으로 다시 삭제하면 그건 유지됨.
try {
  if (typeof localStorage !== 'undefined') {
    var _FIX_KEY = 'scm:voc:_fix:order-l1-restore:v1';
    if (!localStorage.getItem(_FIX_KEY)) {
      ['scm:voc:menu-deleted:v1', 'scm:voc:menu-hidden:v1'].forEach(function (k) {
        var raw = localStorage.getItem(k);
        if (!raw) return;
        var v;
        try { v = JSON.parse(raw); } catch (_) { return; }
        if (v && Array.isArray(v.l1) && v.l1.indexOf('order') >= 0) {
          v.l1 = v.l1.filter(function (x) { return x !== 'order'; });
          localStorage.setItem(k, JSON.stringify(v));
        }
      });
      // 신규 그룹 '발주/입고 관리' 가 있는데 그 안에 OTB 가 없으면 OTB 페이지 entry 자동 추가
      var npRaw = localStorage.getItem('scm:voc:newpages:v1');
      if (npRaw) {
        var np;
        try { np = JSON.parse(npRaw); } catch (_) { np = null; }
        if (Array.isArray(np)) {
          var orderL1 = np.find(function (p) {
            return p && p.mode === 'l1' && (p.l1Label === '발주/입고 관리' || p.l1 === 'Order/Receipt-Manage');
          });
          var hasOtb = np.find(function (p) { return p && p.path === '/demo/otb-budget.html'; });
          if (orderL1 && !hasOtb) {
            np.push({
              id: 'otb-budget-restored-' + Date.now(),
              mode: 'l2',
              l1: orderL1.l1,
              path: '/demo/otb-budget.html',
              name: 'OTB 예산 관리',
              createdAt: Date.now(),
            });
            localStorage.setItem('scm:voc:newpages:v1', JSON.stringify(np));
          }
        }
      }
      localStorage.setItem(_FIX_KEY, '1');
    }
  }
} catch (_) {}

(function () {
  // 로컬 dev (localhost / 127.0.0.1 / file://) — 백엔드 (/api/*) 가 없어서 /api/auth/me 가
  //   404 HTML 응답을 받음 → JSON.parse 실패 → catch → login 리다이렉트 → login 페이지도
  //   /api/auth/login 호출 시 같은 HTML 받아 "Unexpected token '<' is not valid JSON" 노출.
  //   로컬에선 fake super 유저로 통과시켜 데모 페이지 검수 가능하도록.
  var isLocal =
    location.protocol === 'file:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname.endsWith('.local');
  if (isLocal) {
    window.SCM_USER = { id: 'local', email: 'local@dev', name: '로컬', role: 'super' };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        document.dispatchEvent(new CustomEvent('scm:auth-ready', { detail: { user: window.SCM_USER } }));
      }, { once: true });
    } else {
      document.dispatchEvent(new CustomEvent('scm:auth-ready', { detail: { user: window.SCM_USER } }));
    }
    // 로그아웃 helper 도 fake — fetch 안 보내고 그냥 reload.
    window.SCM = window.SCM || {};
    window.SCM.logout = function () { location.reload(); };
    return;
  }

  // 로그인 / 초대수락 페이지 자체는 인증 필요 없음 — 게이트 스킵
  var SKIP = ['/login.html', '/invite-accept.html'];
  if (SKIP.indexOf(location.pathname) !== -1) return;

  // 역할 기반 접근 제어 — 매칭되는 규칙의 allow 외 역할은 DEFAULT_LANDING 으로 리다이렉트.
  var DEFAULT_LANDING = '/demo/dashboard';
  var ROLE_RULES = [
    // VOC 는 편집 모드 — super/admin 만 접근 가능
    { test: function (p) { return p === '/voc/' || p.indexOf('/voc/') === 0; }, allow: ['super', 'admin'] },
  ];

  fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.json().catch(function () { return {}; }); })
    .then(function (data) {
      if (!data || !data.user) {
        location.replace('/login.html?next=' + encodeURIComponent(location.pathname + location.search));
        return;
      }
      for (var i = 0; i < ROLE_RULES.length; i++) {
        if (ROLE_RULES[i].test(location.pathname) && ROLE_RULES[i].allow.indexOf(data.user.role) === -1) {
          location.replace(DEFAULT_LANDING);
          return;
        }
      }
      window.SCM_USER = data.user;
      document.dispatchEvent(new CustomEvent('scm:auth-ready', { detail: { user: data.user } }));
      // 첫 로그인 사용자에게만 데모 페이지 onboarding 튜토리얼 동적 로드
      try {
        if (location.pathname.indexOf('/demo/') === 0) {
          var seenKey = 'scm:tutorial:seen:' + data.user.id + ':v1';
          if (!localStorage.getItem(seenKey)) {
            var s = document.createElement('script');
            s.src = '/tutorial.js';
            s.defer = true;
            document.head.appendChild(s);
          }
        }
      } catch (_) {}
    })
    .catch(function () {
      // 네트워크 오류 시도 일단 로그인으로 — 잘못된 상태로 화면 노출 방지
      location.replace('/login.html?next=' + encodeURIComponent(location.pathname + location.search));
    });

  // 전역 헬퍼 — 어느 페이지에서나 SCM.logout() 호출 가능
  window.SCM = window.SCM || {};
  window.SCM.logout = function () {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      .catch(function () {})
      .then(function () { location.replace('/login.html'); });
  };
})();
