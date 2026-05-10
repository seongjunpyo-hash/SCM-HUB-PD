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
//   Cloudflare Pages 의 not_found_handling 이 SPA 모드(또는 404-page) 면
//   미존재 자산에 대해 404 가 아닌 200 + 워크스페이스 루트 index.html 이
//   돌아옴 → 이전 구현 `if (response.status !== 404) return response;` 가
//   루트 index.html 을 그대로 클라이언트에 흘려보내 "신규 슬러그가 워크스페이스
//   랜딩으로 fallback" 회귀 발생. 화이트리스트 분기는 next() 결과에 의존
//   하지 않아 SPA 모드와 무관하게 안정적으로 동작.
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
    // 클라이언트가 보낸 If-None-Match / If-Modified-Since 는 _blank.html 의 ETag 와
    // 우연히 일치할 수 있으니 제거 — 304 가 다른 slug 응답으로 흘러가는 사고 방지.
    const cleanHeaders = new Headers(request.headers);
    cleanHeaders.delete('if-none-match');
    cleanHeaders.delete('if-modified-since');
    const blankReq = new Request(blankUrl, { headers: cleanHeaders });
    const blankRes = await env.ASSETS.fetch(blankReq);
    // ETag / Last-Modified 는 _blank.html 의 메타라 임의 slug 응답에 같은 값을
    // 주면 캐시 오염 → 제거. Cache-Control 도 'no-store' 로 명시.
    const newHeaders = new Headers(blankRes.headers);
    newHeaders.delete('etag');
    newHeaders.delete('last-modified');
    newHeaders.set('cache-control', 'no-store');
    return new Response(blankRes.body, { status: 200, headers: newHeaders });
  } catch (e) {
    // env.ASSETS 없거나 fetch 실패 시에만 next() 로 폴백 (최후의 수단).
    return next();
  }
}
