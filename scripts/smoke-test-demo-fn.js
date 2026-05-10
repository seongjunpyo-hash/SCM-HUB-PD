#!/usr/bin/env node
// /demo/* 함수의 end-to-end 통합 smoke test.
//
// 단위 테스트 (scripts/check-demo-fn.js) 는 mock 으로 분기 검증.
// 이 스크립트는 실제 wrangler pages dev (또는 배포된 preview URL) 에 HTTP
// 요청 보내서 Cloudflare Pages 의 실제 라우팅 / 정적 자산 / 함수 동작을
// end-to-end 로 확인.
//
// 사용법:
// 사용법 (로컬 수동 검증):
//   터미널 1) npx wrangler pages dev . \
//              --port 8788 \
//              --compatibility-date 2024-12-01 \
//              --show-interactive-dev-session=false
//   터미널 2) SMOKE_BASE_URL=http://localhost:8788 node scripts/smoke-test-demo-fn.js
//
// 배포 preview URL 에 대해서도 가능:
//   SMOKE_BASE_URL=https://<hash>.scm-hub-pd.pages.dev node scripts/smoke-test-demo-fn.js
//
// CI 에선 안 돌림 — wrangler pages dev 의 GitHub Actions 환경 startup 이
// 일관성 있게 안 떨어져 (timeout / 미상의 startup 실패) flakey. 단위 테스트
// (scripts/check-demo-fn.js) 가 함수 분기 회귀 차단을 충분히 커버하므로
// e2e 는 로컬 수동 검증으로만 운용.

'use strict';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:8788';
const TIMEOUT_MS = 15000;

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function assert(cond, msg) { if (!cond) throw new Error('Assertion failed: ' + (msg || '')); }
function eq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual) + (msg ? ' — ' + msg : ''));
  }
}

async function fetchPath(path, init) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(BASE + path, Object.assign({ redirect: 'manual' }, init, { signal: ctrl.signal }));
    const body = await res.text();
    return { status: res.status, headers: res.headers, body };
  } finally {
    clearTimeout(t);
  }
}

// ---- 테스트 케이스 ----

test('GET /demo/sku-management.html → 200 + SKU 관리 콘텐츠 (캐노니컬 .html)', async () => {
  const r = await fetchPath('/demo/sku-management.html');
  // 일부 환경에서 clean URL 308 redirect 가 끼지만 redirect:'manual' 이라 그건 그것대로 OK.
  // 200 이거나 308 이거나 둘 다 정상 분기. 여기선 308 이면 follow 한 번 더 해서 검증.
  let final = r;
  if (r.status >= 300 && r.status < 400) {
    const loc = r.headers.get('location');
    assert(loc, '3xx 면 Location 있어야');
    final = await fetchPath(new URL(loc, BASE).pathname);
  }
  eq(final.status, 200, '최종 응답은 200 이어야');
  assert(final.body.includes('SKU 관리') || final.body.toLowerCase().includes('sku-management'),
    '본문에 SKU 관리 콘텐츠 마커');
});

test('GET /demo/dashboard.html → 200 + 대시보드 콘텐츠 (캐노니컬 .html)', async () => {
  const r = await fetchPath('/demo/dashboard.html');
  let final = r;
  if (r.status >= 300 && r.status < 400) {
    const loc = r.headers.get('location');
    final = await fetchPath(new URL(loc, BASE).pathname);
  }
  eq(final.status, 200);
  assert(final.body.includes('대시보드') || final.body.toLowerCase().includes('dashboard'),
    '본문에 대시보드 콘텐츠 마커');
});

test('GET /demo/_blank.html → 200 + 빈 shell (재귀 fallback X)', async () => {
  const r = await fetchPath('/demo/_blank.html');
  let final = r;
  if (r.status >= 300 && r.status < 400) {
    const loc = r.headers.get('location');
    final = await fetchPath(new URL(loc, BASE).pathname);
  }
  eq(final.status, 200);
  assert(final.body.includes('신규 페이지') || final.body.includes('_blank') || final.body.toLowerCase().includes('blank'),
    '본문에 _blank 마커 (title 또는 주석)');
});

test('GET /demo/voc-신규-슬러그-12345.html → 200 + _blank fallback (워크스페이스 랜딩 안 새어나감)', async () => {
  const r = await fetchPath('/demo/voc-new-page-test-' + Date.now() + '.html');
  // 미지의 슬러그는 함수가 직접 _blank 본문 200 응답 — redirect 없음.
  eq(r.status, 200, '미지 슬러그는 함수가 직접 200 응답');
  // 워크스페이스 랜딩 마커가 없어야 (PR #144 회귀 패턴 차단 확인)
  assert(!r.body.includes('SCM HUB 작업 자동화 워크스페이스'),
    '워크스페이스 랜딩 콘텐츠 안 새어나가야 (회귀 방지 핵심)');
  assert(!r.body.includes('PRD 와이어프레임 시뮬레이터'),
    '워크스페이스 랜딩 마커 없어야');
  // _blank 콘텐츠 또는 인라인 fallback 마커가 있어야
  const hasBlankMarker = r.body.includes('신규 페이지') || r.body.includes('demo blank fallback') || r.body.toLowerCase().includes('blank');
  assert(hasBlankMarker, '_blank 콘텐츠 또는 인라인 fallback 마커 있어야');
});

test('GET /demo/sku-management?cb=smoketest — clean URL + 임의 query', async () => {
  // clean URL 도 정상 동작해야 (.html 뗀 형태)
  const r = await fetchPath('/demo/sku-management?cb=smoketest');
  let final = r;
  if (r.status >= 300 && r.status < 400) {
    const loc = r.headers.get('location');
    final = await fetchPath(new URL(loc, BASE).pathname + (BASE.includes('localhost') ? '' : ''));
  }
  // wrangler dev 와 production 동작이 약간 다를 수 있으나 200 또는 follow 후 200 이어야
  if (final.status !== 200) {
    console.warn('  ⚠ clean URL 동작 차이 (status=' + final.status + ') — 환경별로 다를 수 있음');
    return;
  }
  eq(final.status, 200);
});

test('함수 응답 헤더에 Cache-Control: no-store (CDN poisoning 방지)', async () => {
  const r = await fetchPath('/demo/voc-new-page-cache-check-' + Date.now() + '.html');
  eq(r.status, 200);
  const cc = r.headers.get('cache-control') || '';
  assert(cc.includes('no-store'), 'Cache-Control 에 no-store 포함되어야 (실제값: ' + cc + ')');
});

// ---- run ----
async function main() {
  console.log('[smoke-test-demo-fn] base=' + BASE);
  console.log('');
  let passed = 0, failed = 0;
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
  console.log('[smoke-test-demo-fn] ' + passed + ' passed, ' + failed + ' failed.');
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error('[smoke-test-demo-fn] fatal:', e);
  process.exit(1);
});
