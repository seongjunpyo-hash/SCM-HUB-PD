// Cloudflare Pages Function — /demo/* catch-all.
//
// 동작:
//   1) 먼저 next() 호출 → 정적 asset 검색 (sku-management.html, dashboard.html 등).
//   2) 200 응답이면 그대로 반환.
//   3) 404 응답이면 (= voc 에서 만든 슬러그라 실제 파일 없음)
//      env.ASSETS.fetch 로 /demo/_blank.html 을 가져와 200 으로 반환.
//      URL 은 클라이언트에 그대로 유지 (브라우저는 redirect 가 아닌
//      "200 OK content from server" 로 인식 → 무한 루프 X).
//
// 이전엔 _redirects 의 200 rewrite 로 처리하려 했으나, _blank.html 자체도
// 패턴에 매칭돼 자기 자신으로 rewrite → ERR_TOO_MANY_REDIRECTS 무한 루프 발생.
// 함수 안에서 명시적으로 next() 결과를 검사하는 방식이 안전.
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // _blank.html 자체 요청은 재귀 차단을 위해 그대로 next() — 매칭되는 정적
  // 파일이 있으니 그대로 서빙됨.
  if (url.pathname === '/demo/_blank.html') {
    return next();
  }

  const response = await next();
  if (response.status !== 404) return response;

  // 404 → /demo/_blank.html 로 fallback (URL 은 그대로, 200 으로 응답).
  try {
    const blankUrl = new URL('/demo/_blank.html', url.origin).toString();
    // 클라이언트가 보낸 If-None-Match / If-Modified-Since 는 _blank.html 의 ETag 와
    // 우연히 일치할 수 있으니 제거 — 304 가 다른 slug 응답으로 흘러가는 사고 방지.
    const cleanHeaders = new Headers(request.headers);
    cleanHeaders.delete('if-none-match');
    cleanHeaders.delete('if-modified-since');
    const blankReq = new Request(blankUrl, { headers: cleanHeaders });
    const blankRes = await env.ASSETS.fetch(blankReq);
    // status 200 강제. ETag / Last-Modified 는 _blank.html 의 메타라 임의 slug 응답에
    // 같은 값을 주면 캐시 오염 → 제거. Cache-Control 도 'no-store' 로 명시.
    const newHeaders = new Headers(blankRes.headers);
    newHeaders.delete('etag');
    newHeaders.delete('last-modified');
    newHeaders.set('cache-control', 'no-store');
    return new Response(blankRes.body, { status: 200, headers: newHeaders });
  } catch (e) {
    // env.ASSETS 없거나 fetch 실패 시 원래 404 그대로.
    return response;
  }
}
