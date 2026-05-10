#!/usr/bin/env node
// functions/demo/[[path]].js 의 동작 단위 테스트.
//
// PR #144 회귀 (신규 슬러그 → 워크스페이스 랜딩 / iframe redirect 루프) 의
// 핵심 분기들을 모두 명시적으로 검증한다. CI 에서 매 PR 마다 실행돼
// 함수 회귀가 머지되기 전에 차단.
//
// Cloudflare Pages Functions 의 onRequest 시그니처:
//   onRequest({ request, next, env }) → Response
//   - request: Web Fetch API Request
//   - next(): 다음 handler / static asset 으로 폴스루. Promise<Response>
//   - env.ASSETS.fetch(request): 정적 자산 직접 조회. Promise<Response>
//
// 테스트는 next() / env.ASSETS.fetch 를 mock 으로 주입해 함수 분기 동작만 검증.
//
// 사용법:
//   node scripts/check-demo-fn.js

'use strict';

const path = require('path');
const url = require('url');

const FN_PATH = path.resolve(__dirname, '..', 'functions', 'demo', '[[path]].js');
const FN_URL = url.pathToFileURL(FN_PATH).href;

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function assert(cond, msg) {
  if (!cond) throw new Error('Assertion failed: ' + (msg || ''));
}
function eq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual) + (msg ? ' — ' + msg : ''));
  }
}

// ---- mock helpers ----
function makeReq(pathname, init) {
  return new Request('https://example.test' + pathname, init);
}
function makeCtx({ pathname, nextResponse, assetsResponse, assetsThrows }) {
  let nextCalled = 0;
  let assetsCalls = [];
  return {
    request: makeReq(pathname),
    next: async () => {
      nextCalled++;
      return nextResponse || new Response('next-default', { status: 200, headers: { 'content-type': 'text/html' } });
    },
    env: {
      ASSETS: {
        fetch: async (req) => {
          assetsCalls.push(req.url);
          if (assetsThrows) throw new Error('ASSETS unavailable');
          return assetsResponse || new Response('blank-default', { status: 200, headers: { 'content-type': 'text/html' } });
        },
      },
    },
    _stats: () => ({ nextCalled, assetsCalls }),
  };
}

// ---- main ----
async function main() {
  const mod = await import(FN_URL);
  const { onRequest, isKnownAsset } = mod;

  if (typeof onRequest !== 'function') throw new Error('onRequest not exported');
  if (typeof isKnownAsset !== 'function') throw new Error('isKnownAsset not exported (테스트 가능하도록 export 해주세요)');

  // -------- isKnownAsset 분기 --------
  test('isKnownAsset: /demo/_blank.html (캐노니컬 .html)', () => {
    eq(isKnownAsset('/demo/_blank.html'), true);
  });
  test('isKnownAsset: /demo/sku-management.html (캐노니컬 .html)', () => {
    eq(isKnownAsset('/demo/sku-management.html'), true);
  });
  test('isKnownAsset: /demo/sku-management (clean URL)', () => {
    eq(isKnownAsset('/demo/sku-management'), true);
  });
  test('isKnownAsset: /demo (clean URL → index.html)', () => {
    eq(isKnownAsset('/demo'), true);
  });
  test('isKnownAsset: /demo/ (trailing slash → index.html)', () => {
    eq(isKnownAsset('/demo/'), true);
  });
  test('isKnownAsset: /demo/voc-신규-슬러그.html (미지)', () => {
    eq(isKnownAsset('/demo/voc-new-page-123.html'), false);
  });
  test('isKnownAsset: /demo/voc-새-슬러그 (미지 clean)', () => {
    eq(isKnownAsset('/demo/voc-new-page-123'), false);
  });

  // -------- onRequest 분기: 캐노니컬 .html → next() 호출 + Cache-Control no-store --------
  test('onRequest: /demo/sku-management.html → next() 호출 + no-store 강제', async () => {
    const ctx = makeCtx({
      pathname: '/demo/sku-management.html',
      nextResponse: new Response('<html>sku</html>', { status: 200, headers: { 'content-type': 'text/html', 'cache-control': 'public, max-age=3600' } }),
    });
    const res = await onRequest(ctx);
    eq(res.status, 200);
    eq(ctx._stats().nextCalled, 1, 'next() 호출돼야');
    eq(ctx._stats().assetsCalls.length, 0, 'ASSETS.fetch 안 호출돼야');
    eq(res.headers.get('cache-control'), 'no-store', 'Cache-Control no-store 강제');
    eq(await res.text(), '<html>sku</html>');
  });

  // -------- onRequest: 캐노니컬 clean URL → next() 호출 --------
  test('onRequest: /demo/sku-management (clean) → next() 호출', async () => {
    const ctx = makeCtx({ pathname: '/demo/sku-management', nextResponse: new Response('clean-ok', { status: 200 }) });
    const res = await onRequest(ctx);
    eq(res.status, 200);
    eq(ctx._stats().nextCalled, 1);
    eq(ctx._stats().assetsCalls.length, 0);
    eq(res.headers.get('cache-control'), 'no-store');
  });

  // -------- onRequest: _blank.html 자체 → next() 호출 (재귀 차단) --------
  test('onRequest: /demo/_blank.html → next() 호출 (재귀 차단)', async () => {
    const ctx = makeCtx({ pathname: '/demo/_blank.html', nextResponse: new Response('blank-actual', { status: 200 }) });
    const res = await onRequest(ctx);
    eq(res.status, 200);
    eq(ctx._stats().nextCalled, 1);
    eq(ctx._stats().assetsCalls.length, 0);
    eq(await res.text(), 'blank-actual');
  });

  // -------- onRequest: 미지 슬러그 → next() 안 호출 + ASSETS 로 _blank fetch --------
  test('onRequest: 미지 슬러그 → ASSETS 로 _blank fetch + next() 안 호출', async () => {
    const ctx = makeCtx({
      pathname: '/demo/voc-new-page-123.html',
      assetsResponse: new Response('<html>blank shell</html>', { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }),
    });
    const res = await onRequest(ctx);
    eq(res.status, 200);
    eq(ctx._stats().nextCalled, 0, '미지 슬러그는 next() 안 타야 (워크스페이스 랜딩 회귀 방지 핵심)');
    eq(ctx._stats().assetsCalls.length, 1);
    assert(ctx._stats().assetsCalls[0].includes('/demo/_blank.html'), 'ASSETS 가 _blank.html 로 호출돼야');
    eq(res.headers.get('cache-control'), 'no-store');
    eq(await res.text(), '<html>blank shell</html>');
  });

  // -------- onRequest: 미지 슬러그 + ASSETS 가 308 (redirect leak) → 인라인 빈 HTML --------
  test('onRequest: 미지 슬러그 + ASSETS 가 308 반환 → 인라인 빈 HTML (Location leak 차단)', async () => {
    const ctx = makeCtx({
      pathname: '/demo/voc-new-page-123.html',
      assetsResponse: new Response('', { status: 308, headers: { 'location': '/demo/_blank' } }),
    });
    const res = await onRequest(ctx);
    eq(res.status, 200, '3xx 누출 차단 → 200 으로 응답');
    eq(res.headers.get('location'), null, 'Location 헤더 안 새어나가야 (무한 redirect 방지)');
    eq(res.headers.get('cache-control'), 'no-store');
    const body = await res.text();
    assert(body.includes('demo blank fallback'), '인라인 fallback HTML 이어야');
  });

  // -------- onRequest: 미지 슬러그 + ASSETS throw → 인라인 빈 HTML (catch) --------
  test('onRequest: 미지 슬러그 + ASSETS throw → 인라인 빈 HTML (catch)', async () => {
    const ctx = makeCtx({
      pathname: '/demo/voc-new-page-123.html',
      assetsThrows: true,
    });
    const res = await onRequest(ctx);
    eq(res.status, 200);
    eq(res.headers.get('cache-control'), 'no-store');
    const body = await res.text();
    assert(body.includes('demo blank fallback'), '인라인 fallback HTML');
  });

  // -------- 회귀 시나리오: Pages 의 not_found_handling 이 200 + 워크스페이스 랜딩 반환해도 새지 않아야 --------
  test('회귀 시나리오: 미지 슬러그 - Pages 가 200 워크스페이스 랜딩 반환해도 next() 안 타야', async () => {
    const ctx = makeCtx({
      pathname: '/demo/voc-new-page-123.html',
      // Pages SPA 모드 시뮬: 미존재 자산에 200 + 워크스페이스 루트 index.html 반환
      nextResponse: new Response('<html>WORKSPACE LANDING</html>', { status: 200 }),
      assetsResponse: new Response('<html>blank shell</html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    });
    const res = await onRequest(ctx);
    eq(ctx._stats().nextCalled, 0, '미지 슬러그는 절대 next() 호출 안 됨 (이게 회귀 방지의 핵심)');
    const body = await res.text();
    assert(body.includes('blank shell') && !body.includes('WORKSPACE LANDING'),
      '워크스페이스 랜딩 안 새어나가고 _blank shell 이어야');
  });

  // ---- run ----
  let passed = 0;
  let failed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      console.log('  ✅ ' + t.name);
      passed++;
    } catch (e) {
      console.error('  ❌ ' + t.name);
      console.error('     ' + e.message);
      failed++;
    }
  }
  console.log('');
  console.log('[check-demo-fn] ' + passed + ' passed, ' + failed + ' failed.');
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error('[check-demo-fn] fatal:', e);
  process.exit(1);
});
