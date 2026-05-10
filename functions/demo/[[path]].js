// Cloudflare Pages Function — /demo/* catch-all.
//
// 동작:
//   1) 경로가 캐노니컬 데모 자산 (KNOWN_DEMO_ASSETS) 이면 next() 로 Pages 가
//      그대로 서빙. .html 풀경로와 clean URL 양쪽 매칭.
//   2) 그 외 (= voc 신규 슬러그처럼 실제 파일 없는 경로) → /demo/_blank.html
//      본문을 200 OK 로 응답. URL 은 그대로 유지 (브라우저는 redirect 가
//      아닌 200 OK content from server 로 인식 → 무한 루프 X).
//
// 왜 next() status 검사 (`!== 404`) 를 안 쓰나:
//   Cloudflare Pages 의 not_found_handling 이 SPA / 404-page 모드면 미존재
//   자산에도 404 가 아닌 200 + 워크스페이스 루트 index.html 로 응답함. 이전
//   구현 `if (response.status !== 404) return response;` 는 그 워크스페이스
//   랜딩을 그대로 클라이언트에 흘려보내 "신규 슬러그 → 워크스페이스 랜딩으로
//   fallback" 회귀 발생. 화이트리스트 분기는 next() 결과에 의존하지 않아
//   Pages 설정과 무관하게 안정.
//
// 왜 env.ASSETS 응답 헤더를 다 새로 작성하나:
//   Pages clean URL 모드에서 env.ASSETS.fetch 가 /demo/_blank.html 을 308
//   redirect 로 응답한 채 follow 안 하는 케이스가 있음. 그 헤더 (Location 등)
//   를 그대로 들고 status 만 200 으로 바꿔 보내면 브라우저가 Location 따라
//   가서 무한 redirect → ERR_TOO_MANY_REDIRECTS. 안전하게 content-type 만
//   보존하고 나머지 (ETag / Last-Modified / Location / Cache-Control) 는
//   우리가 직접 set.
const KNOWN_DEMO_ASSETS = new Set([
  '_blank.html',
  'dashboard.html',
  'editshop-restock-request.html',
  'editshop-restock-status.html',
  'index.html',
  'otb-budget.html',
  'sku-detail.html',
  'sku-management.html',
  'sku-register.html',
  'wireframe.html',
]);

const INLINE_BLANK_HTML =
  '<!DOCTYPE html><html><body><!-- demo blank fallback --></body></html>';

const NO_STORE_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
};

function isKnownAsset(pathname) {
  // /demo 또는 /demo/ 자체 (clean URL → index.html) 는 알려진 자산으로 간주
  if (pathname === '/demo' || pathname === '/demo/') return true;
  const slug = pathname.replace(/^\/demo\//, '').replace(/\/$/, '');
  if (!slug) return true;
  if (KNOWN_DEMO_ASSETS.has(slug)) return true;
  // clean URL (확장자 없음) 도 .html 추가 시 화이트리스트에 있으면 known
  if (!slug.includes('.') && KNOWN_DEMO_ASSETS.has(slug + '.html')) return true;
  return false;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // 캐노니컬 자산 → Pages 가 그대로 서빙. _blank.html 자체 요청도 여기로 들어옴.
  if (isKnownAsset(url.pathname)) return next();

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
