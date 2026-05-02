/**
 * SCM Hub PRD 검증 — Anthropic Claude API 프록시 (Cloudflare Workers)
 *
 * 배포 단계:
 *   1) npm install -g wrangler
 *   2) wrangler login
 *   3) wrangler kv:namespace create "RL"
 *      → 출력된 id 를 wrangler.toml 의 kv_namespaces.id 에 채워 넣기
 *   4) wrangler secret put ANTHROPIC_API_KEY
 *      → sk-ant-... 키 입력
 *   5) cd cloudflare-worker && wrangler deploy
 *      → 배포된 URL 을 prd-validate.html / simulator.html 의 PROXY_URL 변수
 *        또는 localStorage 의 'scm-proxy-url' 에 한 번 저장하면 끝.
 */

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  // 'https://your-domain.com',
];

const DAILY_LIMIT_PER_IP = 60;
const MAX_TOKENS_CAP = 8000;
const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001', 'claude-opus-4-6'];
const DEFAULT_MODEL = 'claude-sonnet-4-6';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }
    if (request.method !== 'POST') {
      return jsonError(405, 'Method not allowed', request);
    }

    const origin = request.headers.get('Origin') || '';
    if (!isAllowedOrigin(origin)) {
      return jsonError(403, 'Origin not allowed: ' + origin, request);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    const rlKey = 'rl:' + ip + ':' + todayKey();
    if (env.RL) {
      const usedStr = await env.RL.get(rlKey);
      const used = parseInt(usedStr || '0', 10);
      if (used >= DAILY_LIMIT_PER_IP) {
        return jsonError(429, 'Daily limit reached (' + DAILY_LIMIT_PER_IP + '/day)', request);
      }
      await env.RL.put(rlKey, String(used + 1), { expirationTtl: 86400 });
    }

    let body;
    try { body = await request.json(); }
    catch (_) { return jsonError(400, 'Invalid JSON', request); }

    if (!body || !Array.isArray(body.messages)) {
      return jsonError(400, 'messages array required', request);
    }
    if (!body.model || !ALLOWED_MODELS.includes(body.model)) body.model = DEFAULT_MODEL;
    if (!body.max_tokens || body.max_tokens > MAX_TOKENS_CAP) body.max_tokens = MAX_TOKENS_CAP;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'content-type': 'application/json', ...corsHeaders(request) },
    });
  },
};

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some(function (o) { return origin === o || origin.startsWith(o); });
}

function corsHeaders(req) {
  const origin = req.headers.get('Origin') || '';
  const allowOrigin = isAllowedOrigin(origin) ? (origin || '*') : ALLOWED_ORIGINS[0] || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonError(status, msg, req) {
  return new Response(JSON.stringify({ error: msg }), {
    status: status,
    headers: { 'content-type': 'application/json', ...corsHeaders(req) },
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
