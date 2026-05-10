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

  // iframe 안에서 부모가 같은-origin 으로 이미 인증돼 있으면 그 인증을 그대로 채택.
  // VOC 의 데모 미리보기 iframe 처럼 부모-자식이 같은 origin 인 경우 cookie /
  // 캐시 race 로 인해 자식의 /api/auth/me 가 일시적으로 {user:null} 을 받아
  // /login.html 로 redirect → login.html 은 부모 세션을 보고 다시 자식 path 로
  // location.replace → ERR_TOO_MANY_REDIRECTS 루프가 발생할 수 있음. 부모가
  // 이미 인증돼 있다면 자식이 굳이 /api/auth/me 를 다시 칠 필요 없이 부모의
  // SCM_USER 를 채택하면 루프가 원천 차단됨. cross-origin 부모면 접근 시 throw
  // 라 catch 로 무시 → 정상 fetch 흐름으로 폴백.
  try {
    if (window.parent && window.parent !== window && window.parent.SCM_USER) {
      var parentUser = window.parent.SCM_USER;
      // role 규칙은 자식 path 기준으로 적용 — 부모가 super 라도 자식이 권한 밖
      // 경로면 DEFAULT_LANDING 으로 보냄 (정책 일관).
      for (var ri = 0; ri < ROLE_RULES.length; ri++) {
        if (ROLE_RULES[ri].test(location.pathname) && ROLE_RULES[ri].allow.indexOf(parentUser.role) === -1) {
          location.replace(DEFAULT_LANDING);
          return;
        }
      }
      window.SCM_USER = parentUser;
      document.dispatchEvent(new CustomEvent('scm:auth-ready', { detail: { user: parentUser } }));
      return;
    }
  } catch (_) { /* cross-origin parent — 정상 fetch 흐름으로 */ }

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
