/* ============================================================
 * SCM HUB · auth-gate
 * ------------------------------------------------------------
 * 페이지 로드 시 /api/auth/me 호출 → 미인증이면 /login.html 로 리다이렉트.
 * 인증되었으면 window.SCM_USER 에 사용자 객체 저장 + 'scm:auth-ready' 이벤트 발생.
 *
 * Usage:
 *   <script src="/auth-gate.js"></script>
 *   ...
 *   document.addEventListener('scm:auth-ready', (e) => {
 *     console.log(e.detail.user); // { id, email, name, role }
 *   });
 * ============================================================ */
(function () {
  // 로그인 / 초대수락 페이지 자체는 인증 필요 없음 — 게이트 스킵
  var SKIP = ['/login.html', '/invite-accept.html'];
  if (SKIP.indexOf(location.pathname) !== -1) return;

  // 역할 기반 접근 제어 — 매칭되는 규칙의 allow 외 역할은 DEFAULT_LANDING 으로 리다이렉트.
  var DEFAULT_LANDING = '/demo/sku-management';
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
