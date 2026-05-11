/* ============================================================
 * pbo-design · auth-gate
 * ------------------------------------------------------------
 * Supabase 인증 + 도메인 권한 게이트.
 *
 * 흐름:
 *   1. supabase.auth.getUser() 로 현재 세션 조회
 *   2. 미인증 → /home/login.html?next=... 리다이렉트
 *   3. URL path 의 첫 segment 로 도메인 추정 (e.g. /scm-hub/... → 'scm-hub')
 *   4. user_domains 테이블 조회 → 권한 있으면 통과, 없으면 /home/forbidden.html
 *   5. window.SCM_USER = { id, email, role, domain } 전역 노출
 *   6. document 에 'scm:auth-ready' 이벤트 dispatch
 *
 * Usage:
 *   <script src="/home/auth-gate.js"></script>
 *   ...
 *   document.addEventListener('scm:auth-ready', (e) => {
 *     console.log(e.detail.user);  // { id, email, role, domain }
 *   });
 * ============================================================ */
(function () {
  'use strict';

  // 로그인/공개 페이지는 게이트 스킵
  var SKIP = ['/home/login.html', '/home/forbidden.html', '/home/invite-accept.html'];
  if (SKIP.indexOf(location.pathname) !== -1) return;

  // ─── Supabase 설정 ─────────────────────────────────────────
  // production 에서는 빌드 시 inject 또는 home/config.js 에서 주입.
  // 지금은 placeholder — 실제 키는 home/config.js 에 분리해서 .gitignore.
  var SUPABASE_URL = (window.__PBO_DESIGN__ && window.__PBO_DESIGN__.supabaseUrl)
    || 'https://YOUR_PROJECT_REF.supabase.co';
  var SUPABASE_ANON_KEY = (window.__PBO_DESIGN__ && window.__PBO_DESIGN__.supabaseAnonKey)
    || 'YOUR_ANON_KEY';

  // ─── path 에서 도메인 ID 추정 ─────────────────────────────
  // /scm-hub/...        → 'scm-hub'
  // /scm-portal/demo/...→ 'scm-portal'
  // /home/...            → null (home 자체는 모든 사용자 접근)
  function inferDomain(pathname) {
    var seg = (pathname.split('/')[1] || '').toLowerCase();
    if (!seg || seg === 'home' || seg === 'conductor') return null;
    var known = ['scm-hub', 'scm-portal', 'o4o', 'logistics'];
    return known.indexOf(seg) !== -1 ? seg : null;
  }

  function redirectToLogin() {
    location.replace('/home/login.html?next=' + encodeURIComponent(location.pathname + location.search));
  }

  // ─── Supabase JS 로드 (ESM CDN) ───────────────────────────
  // 정적 시스템이므로 import map 또는 dynamic import 사용.
  var script = document.createElement('script');
  script.type = 'module';
  script.textContent = [
    "import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';",
    "const sb = createClient('" + SUPABASE_URL + "', '" + SUPABASE_ANON_KEY + "');",
    "window.__SUPABASE__ = sb;",
    "(async () => {",
    "  const { data: { user }, error } = await sb.auth.getUser();",
    "  if (error || !user) { " + redirectToLogin.toString() + "; redirectToLogin(); return; }",
    "  const domainId = " + inferDomain.toString() + "(location.pathname);",
    "  let role = null;",
    "  if (domainId) {",
    "    const { data: ud } = await sb.from('user_domains')",
    "      .select('role').eq('user_id', user.id).eq('domain_id', domainId).maybeSingle();",
    "    if (!ud) { location.replace('/home/forbidden.html'); return; }",
    "    role = ud.role;",
    "  }",
    "  window.SCM_USER = { id: user.id, email: user.email, name: user.user_metadata?.name || user.email, role, domain: domainId };",
    "  document.dispatchEvent(new CustomEvent('scm:auth-ready', { detail: { user: window.SCM_USER } }));",
    "})();",
    "",
    "window.SCM = window.SCM || {};",
    "window.SCM.logout = async function () {",
    "  await sb.auth.signOut();",
    "  location.replace('/home/login.html');",
    "};",
  ].join('\n');
  document.head.appendChild(script);
})();
