// Cloudflare Pages Function — /demo/* catch-all.
//
// 동작:
//   1) 경로가 캐노니컬 데모 자산 (KNOWN_DEMO_ASSETS) 이면 next() 로 Pages 가
//      그대로 서빙. .html 풀경로와 clean URL 양쪽 매칭.
//   2) 그 외 (= voc 신규 슬러그처럼 실제 파일 없는 경로) → /demo/_blank.html
//      본문을 200 OK 로 응답. URL 은 그대로 유지 (브라우저는 redirect 가
//      아닌 200 OK content from server 로 인식 → 무한 루프 X).
//   3) 모든 함수 응답에 Cache-Control: no-store 강제 (next() 결과 포함) —
//      혹시 함수 회귀로 broken 응답이 나가도 Cloudflare CDN 이 캐시 못
//      하게. pages.dev 는 zone-level Purge 가 없어서 한 번 박힌 캐시가
//      만료 전에 잘 안 빠지는 운영 제약을 시스템적으로 차단.
//
// 왜 next() status 검사 (`!== 404`) 를 안 쓰나:
//   Cloudflare Pages 의 not_found_handling 이 SPA / 404-page 모드면 미존재
//   자산에도 404 가 아닌 200 + 워크스페이스 루트 index.html 로 응답함.
//   status 만 보고 통과시키면 그 워크스페이스 랜딩이 그대로 클라이언트에
//   흘러가 "신규 슬러그 → 워크스페이스 랜딩으로 fallback" 회귀 발생.
//   화이트리스트 분기는 next() 결과에 의존하지 않아 Pages 설정과 무관하게
//   안정적.
//
// 왜 env.ASSETS 응답 헤더를 다 새로 작성하나:
//   Pages clean URL 모드에서 env.ASSETS.fetch 가 /demo/_blank.html 을 308
//   redirect 로 응답한 채 follow 안 하는 케이스가 있음. 그 헤더 (Location 등)
//   를 그대로 들고 status 만 200 으로 바꿔 보내면 브라우저가 Location 따라
//   가서 무한 redirect → ERR_TOO_MANY_REDIRECTS. 안전하게 content-type 만
//   보존하고 나머지는 우리가 직접 set.

import { KNOWN_DEMO_ASSETS } from './_known-assets.js';

// 소문자 normalized 셋. macOS 의 case-insensitive 파일시스템에서 sync 가
// 혼합 케이스 (예: 'Product-Arrival-Status.html') 로 자산을 기록해도, 사용자가
// 소문자 URL 로 접근했을 때 정상 매칭되게.
const KNOWN = new Set(KNOWN_DEMO_ASSETS.map((s) => s.toLowerCase()));

const INLINE_BLANK_HTML =
  '<!DOCTYPE html><html><body><!-- demo blank fallback --></body></html>';

const NO_STORE_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
};

export function isKnownAsset(pathname) {
  // /demo 또는 /demo/ 자체 (clean URL → index.html) 는 알려진 자산으로 간주
  if (pathname === '/demo' || pathname === '/demo/') return true;
  const slug = pathname.replace(/^\/demo\//, '').replace(/\/$/, '').toLowerCase();
  if (!slug) return true;
  if (KNOWN.has(slug)) return true;
  // clean URL (확장자 없음) 도 .html 추가 시 화이트리스트에 있으면 known
  if (!slug.includes('.') && KNOWN.has(slug + '.html')) return true;
  return false;
}

// next() 결과를 Cache-Control: no-store 으로 덮어써서 통과시키는 헬퍼.
// 응답 본문 / status / 다른 헤더는 그대로 유지 — 단지 캐시만 못하게.
async function passThroughNoStore(next) {
  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // ─── case-insensitive alias ───
  // PascalCase / 혼합 케이스 URL 로 들어왔는데 lowercase 버전이 화이트리스트에
  // 있다면, lowercase 로 301 redirect. (`_redirects` 파일이 모종의 이유로 적용 안
  // 되는 케이스 대비 — Pages Functions 가 _redirects 보다 우선 평가되는 환경도
  // 있고, 신규 데모 파일 rename 직후 캐시 영향도 받을 수 있어 functions 에서도
  // 안전망으로 직접 처리.)
  const slug = url.pathname.replace(/^\/demo\//, '').replace(/\/$/, '');
  if (slug && slug !== slug.toLowerCase()) {
    const lower = slug.toLowerCase();
    const lowerInList = KNOWN.has(lower) || (!lower.includes('.') && KNOWN.has(lower + '.html'));
    if (lowerInList) {
      const lowerPath = '/demo/' + lower;
      const newUrl = new URL(lowerPath + url.search, url.origin);
      return Response.redirect(newUrl.toString(), 301);
    }
  }

  // 캐노니컬 자산 → Pages 가 그대로 서빙. _blank.html 자체 요청도 여기로 들어옴.
  if (isKnownAsset(url.pathname)) {
    return passThroughNoStore(next);
  }

  // 미지의 슬러그 (= voc 신규 페이지 path) → _blank.html 본문을 200 으로 응답.
  try {
    const blankUrl = new URL('/demo/_blank.html', url.origin).toString();
    // 클라이언트의 If-None-Match / If-Modified-Since 는 _blank.html 의 ETag 와
    // 우연히 일치할 수 있으니 제거 — 304 가 다른 slug 응답으로 흘러가는 사고 방지.
    const cleanHeaders = new Headers(request.headers);
    cleanHeaders.delete('if-none-match');
    cleanHeaders.delete('if-modified-since');
    const blankReq = new Request(blankUrl, {
      headers: cleanHeaders,
      // 명시적으로 follow — Pages 의 clean URL redirect 가 걸려도 끝까지 따라가
      // 최종 200 응답을 받도록.
      redirect: 'follow',
    });
    const blankRes = await env.ASSETS.fetch(blankReq);

    // 응답이 redirect (3xx) 면 follow 가 무시됐다는 뜻 — Location 등 redirect
    // 메타가 새 응답에 새어들어가지 않게 인라인 빈 HTML 200 응답.
    if (blankRes.status >= 300 && blankRes.status < 400) {
      return new Response(INLINE_BLANK_HTML, { status: 200, headers: NO_STORE_HEADERS });
    }

    // 정상 200 — content-type 만 보존, 나머지 헤더는 우리가 새로 작성.
    return new Response(blankRes.body, {
      status: 200,
      headers: {
        'content-type': blankRes.headers.get('content-type') || NO_STORE_HEADERS['content-type'],
        'cache-control': 'no-store',
      },
    });
  } catch (_) {
    // env.ASSETS 미바인딩 / fetch 실패 → 인라인 빈 HTML 200 (redirect 루프 차단 우선).
    return new Response(INLINE_BLANK_HTML, { status: 200, headers: NO_STORE_HEADERS });
  }
}
