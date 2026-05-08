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
 * 추가/제거할 공통 스크립트는 아래 SCRIPTS 배열만 수정하면 모든
 * 데모 페이지에 일괄 반영.
 * ============================================================ */
(function () {
  if (window.__scmShellBooted) return;
  window.__scmShellBooted = true;

  var SCRIPTS = [
    '/voc/comment-overlay.js',
    '/dev-export.js',
    '/profile-menu.js',
  ];

  SCRIPTS.forEach(function (src) {
    // 이미 로드된 경우 (legacy 페이지가 직접 <script src> 로 박은 케이스)
    // 중복 로드 방지
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  });
})();
