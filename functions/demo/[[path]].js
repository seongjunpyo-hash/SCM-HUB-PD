// Cloudflare Pages Function — /demo/* catch-all.
//
// 동작:
//   1) /demo/* 경로의 파일명이 KNOWN_DEMO_ASSETS 화이트리스트에 있거나
//      (clean-URL 형태라 .html 추가 시 화이트리스트에 있으면) → next() 로
//      정적 asset 그대로 서빙.
//   2) 그 외 (= voc 신규 슬러그) → /demo/_blank.html 본문을 200 으로 응답.
//      URL 은 그대로 유지 (브라우저는 redirect 가 아닌 200 OK 본문으로 인식).
//
// 왜 next() status 검사를 안 쓰나:
//   Cloudflare Pages 의 not_found_handling 이 SPA / 404-page / clean URL
//   모드면 미존재 자산에 대해 404 가 아닌 200/308 등이 돌아옴 → 이전 구현
//   `if (response.status !== 404) return response;` 가 잘못된 응답을
//   클라이언트에 흘려보내 무한 redirect / 워크스페이스 랜딩 fallback 회귀
//   발생. 화이트리스트 분기는 next() 결과에 의존하지 않아 Pages 설정과
//   무관하게 안정.
//
// 왜 env.ASSETS 응답 헤더를 다 버리나:
//   Pages 가 clean URL 설정이 켜진 상태에서 env.ASSETS.fetch 가
//   /demo/_blank.html → /demo/_blank 로 308 응답을 (follow 안 하고)
//   그대로 반환하는 케이스가 있음. 그 응답 헤더(Location 등)를 그대로
//   유지한 채 status 만 200 으로 바꿔 보내면 일부 브라우저가 Location 을
//   따라가 /demo/_blank → /demo/_blank 로 무한 redirect → ERR_TOO_MANY_REDIRECTS.
//   안전하게 content-type 정도만 보존하고 나머지는 우리가 직접 set.
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

function isKnownAsset(pathname) {
  // /demo/ 또는 /demo 자체 (clean URL → index.html) 는 알려진 자산으로 간주
  if (pathname === '/demo' || pathname === '/demo/') return true;
  const slug = pathname.replace(/^\/demo\//, '');
  if (!slug) return true;
  if (KNOWN_DEMO_ASSETS.has(slug)) return true;
  // clean URL (확장자 없음) — Cloudflare Pages 가 .html 자동 매칭
  if (!slug.includes('.') && KNOWN_DEMO_ASSETS.has(slug + '.html')) return true;
  return false;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // 알려진 캐노니컬 데모 자산 → 그대로 서빙. _blank.html 자체 요청도 여기로 들어옴.
  if (isKnownAsset(url.pathname)) return next();

  // 미지의 슬러그 (= voc 에서 등록한 신규 페이지 path) → _blank.html 본문으로 200 응답.
  try {
    const blankUrl = new URL('/demo/_blank.html', url.origin).toString();
    // 클라이언트의 If-None-Match / If-Modified-Since 는 _blank.html 의 ETag 와
    // 우연히 일치할 수 있으니 제거 — 304 가 다른 slug 응답으로 흘러가는 사고 방지.
    const cleanHeaders = new Headers(request.headers);
    cleanHeaders.delete('if-none-match');
    cleanHeaders.delete('if-modified-since');
    const blankReq = new Request(blankUrl, {
      headers: cleanHeaders,
      // 명시적으로 follow — Pages 가 clean URL redirect 를 했을 때 끝까지 따라가
      // 최종 200 응답을 받도록.
      redirect: 'follow',
    });
    const blankRes = await env.ASSETS.fetch(blankReq);

    // 응답이 redirect (3xx) 면 follow 가 안 됐다는 뜻 — Location 등 redirect
    // 메타가 새 응답에 새어들어가지 않게 본문은 빈 상태로, 200 OK + content-type
    // text/html 만 박아서 broken iframe 라도 redirect 루프는 막는다.
    if (blankRes.status >= 300 && blankRes.status < 400) {
      return new Response(
        '<!DOCTYPE html><html><body><!-- demo blank fallback --></body></html>',
        { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
      );
    }

    // 정상 응답 — content-type 만 보존하고 redirect 관련 / 캐시 메타는 전부 새로
    // 작성. ETag / Last-Modified / Location 등이 슬러그 응답에 새어들어가면
    // 캐시 오염 / 추가 redirect 트리거 위험이 있어 제거.
    const ct = blankRes.headers.get('content-type') || 'text/html; charset=utf-8';
    return new Response(blankRes.body, {
      status: 200,
      headers: {
        'content-type': ct,
        'cache-control': 'no-store',
      },
    });
  } catch (e) {
    // env.ASSETS 없거나 fetch 실패 시 — 빈 200 응답 (redirect 루프 차단이 최우선).
    return new Response(
      '<!DOCTYPE html><html><body><!-- demo blank fallback (catch) --></body></html>',
      { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
    );
  }
}
