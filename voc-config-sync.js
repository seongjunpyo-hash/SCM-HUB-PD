/* ============================================================
 * scm:voc-config-sync — VOC 메뉴/페이지 설정 D1 ↔ localStorage 동기화
 * ------------------------------------------------------------
 * 목적: localStorage 가 휘발성이라 사고 (Clear site data / 시크릿창 종료 /
 * 다른 기기) 시 super 가 등록한 메뉴 / 페이지 편집 데이터가 사라지던 회귀
 * 차단. D1 (`menu_config` 테이블) 을 진실원천으로, localStorage 는 캐시.
 *
 * 동작:
 *   1) 페이지 로드 직후 SCM_CONFIG_SYNC.bootstrap() 호출 →
 *      GET /api/voc/menu-config 로 D1 의 모든 key/value 를 받아 localStorage
 *      에 mirror. 완료 시 'scm:config-synced' 이벤트 발생.
 *   2) localStorage 에 변경이 발생할 때 (각 voc 모듈이 persist* 직후 호출)
 *      SCM_CONFIG_SYNC.push(key, value) → 해당 key 만 debounced PUT.
 *      네트워크 실패 시 retry (최대 3회, 지수 backoff).
 *   3) PUT 은 super 만 허용 (서버에서 검사). 비-super 는 GET 만 가능.
 *
 * 동기 대상 key (값은 LS_KEY → API_KEY 매핑):
 *   scm:voc:newpages:v1       ↔ newpages
 *   scm:voc:menu-order:v1     ↔ menu-order
 *   scm:voc:menu-hidden:v1    ↔ menu-hidden
 *   scm:voc:menu-deleted:v1   ↔ menu-deleted
 *   scm:voc:versions:v1       ↔ versions
 *   scm:voc:edit:v2           ↔ edit
 *
 * 사용 (각 페이지 head 에서 sync 후 mount):
 *   <script src="/voc-config-sync.js"></script>
 *   <script>
 *     SCM_CONFIG_SYNC.bootstrap().then(() => {
 *       // localStorage 가 이제 D1 최신본과 동기화됨. 여기서 lnb.mount 등.
 *     });
 *   </script>
 *
 * VOC index.html 처럼 init 이 DOMContentLoaded 후라면 init() 안에서
 * await SCM_CONFIG_SYNC.bootstrap() 한 번 await 한 후 진행.
 * ============================================================ */

(function (root) {
  'use strict';

  // LS key ↔ API config key 매핑.
  var KEY_MAP = {
    'scm:voc:newpages:v1':     'newpages',
    'scm:voc:menu-order:v1':   'menu-order',
    'scm:voc:menu-hidden:v1':  'menu-hidden',
    'scm:voc:menu-deleted:v1': 'menu-deleted',
    'scm:voc:versions:v1':     'versions',
    'scm:voc:edits:v1':        'edits',
  };
  // 역매핑 — push(lsKey) 가 들어오면 apiKey 로 변환.
  var REVERSE_KEY_MAP = (function () {
    var m = {};
    Object.keys(KEY_MAP).forEach(function (lsKey) { m[KEY_MAP[lsKey]] = lsKey; });
    return m;
  })();

  var API_URL = '/api/voc/menu-config';
  var DEBOUNCE_MS = 600;          // persist 후 PUT 까지 디바운스
  var MAX_RETRIES = 3;            // PUT 실패 시 재시도 횟수
  var RETRY_BASE_MS = 1500;       // 지수 backoff base

  var _bootstrapPromise = null;
  var _pendingPuts = {};          // key -> { value, timer, retries, inflight }
  var _booted = false;

  function _toLs(lsKey, value) {
    try {
      if (value == null) {
        localStorage.removeItem(lsKey);
      } else if (typeof value === 'string') {
        localStorage.setItem(lsKey, value);
      } else {
        localStorage.setItem(lsKey, JSON.stringify(value));
      }
    } catch (_) {}
  }

  function _fromLs(lsKey) {
    try { return localStorage.getItem(lsKey); } catch (_) { return null; }
  }

  // 서버 fetch — credentials 포함 (auth cookie). 실패 시 throw.
  function _apiGet() {
    return fetch(API_URL, { method: 'GET', credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('GET ' + API_URL + ' status=' + r.status);
        return r.json();
      });
  }

  function _apiPut(key, value) {
    return fetch(API_URL, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: key, value: value }),
    }).then(function (r) {
      if (r.status === 403) {
        // super 가 아닌 사용자는 write 불가 — 조용히 reject (로컬은 유지).
        var e = new Error('forbidden');
        e.code = 'forbidden';
        throw e;
      }
      if (!r.ok) throw new Error('PUT status=' + r.status);
      return r.json();
    });
  }

  // bootstrap — D1 의 모든 key 를 localStorage 에 mirror. 한 번만 실행.
  function bootstrap() {
    if (_bootstrapPromise) return _bootstrapPromise;
    _bootstrapPromise = _apiGet()
      .then(function (data) {
        var cfg = (data && data.config) || {};
        Object.keys(KEY_MAP).forEach(function (lsKey) {
          var apiKey = KEY_MAP[lsKey];
          if (Object.prototype.hasOwnProperty.call(cfg, apiKey)) {
            _toLs(lsKey, cfg[apiKey]);
          }
        });
        _booted = true;
        try {
          document.dispatchEvent(new CustomEvent('scm:config-synced', { detail: { source: 'd1' } }));
        } catch (_) {}
      })
      .catch(function (e) {
        // 네트워크 / 인증 실패 — localStorage 가 fallback 으로 그대로 사용됨.
        // bootstrapPromise 는 reject 안 함 (UI 는 계속 진행).
        _booted = true;
        try {
          document.dispatchEvent(new CustomEvent('scm:config-synced', { detail: { source: 'local-fallback', error: String(e) } }));
        } catch (_) {}
      });
    return _bootstrapPromise;
  }

  // push — 단일 lsKey 의 현재 값을 D1 으로 반영. debounced.
  // value 인자 안 넘기면 localStorage 에서 다시 읽음.
  function push(lsKey, value) {
    var apiKey = KEY_MAP[lsKey] || lsKey;
    if (!REVERSE_KEY_MAP[apiKey] && !KEY_MAP[lsKey]) return; // 모르는 key 는 sync 안 함
    var raw = (value === undefined) ? _fromLs(lsKey) : value;
    var entry = _pendingPuts[apiKey] || { retries: 0, inflight: false };
    entry.value = raw;
    if (entry.timer) clearTimeout(entry.timer);
    entry.timer = setTimeout(function () { _flush(apiKey); }, DEBOUNCE_MS);
    _pendingPuts[apiKey] = entry;
  }

  function _flush(apiKey) {
    var entry = _pendingPuts[apiKey];
    if (!entry) return;
    if (entry.inflight) {
      // 진행 중인 PUT 끝난 후 다시 schedule (최신 값 보장)
      entry.timer = setTimeout(function () { _flush(apiKey); }, DEBOUNCE_MS);
      return;
    }
    entry.inflight = true;
    entry.timer = null;
    // value 가 string 이면 그대로, JSON string 이면 parse 해서 보냄 (서버가
    // object 받으면 다시 stringify — 이중 인코딩 방지).
    var v = entry.value;
    if (typeof v === 'string') {
      try { v = JSON.parse(v); } catch (_) { /* string 그대로 */ }
    }
    _apiPut(apiKey, v).then(function () {
      entry.inflight = false;
      entry.retries = 0;
    }).catch(function (e) {
      entry.inflight = false;
      if (e && e.code === 'forbidden') {
        // super 가 아닌 사용자 — 더 이상 시도 안 함. 로컬에만 살아있음.
        return;
      }
      entry.retries = (entry.retries || 0) + 1;
      if (entry.retries <= MAX_RETRIES) {
        var delay = RETRY_BASE_MS * Math.pow(2, entry.retries - 1);
        entry.timer = setTimeout(function () { _flush(apiKey); }, delay);
      }
      // MAX_RETRIES 초과 시 그냥 포기. 다음 push 때 새 시도.
    });
  }

  // refetch — 다른 탭의 변경 알림 (BroadcastChannel) 받았을 때 D1 의 현재
  // 상태를 다시 받아 localStorage 갱신. bootstrapPromise 캐시 무효화 후 재실행.
  function _refetch() {
    _bootstrapPromise = null;
    return bootstrap();
  }

  // pushAll — 현재 localStorage 의 모든 sync 대상 key 를 D1 으로 즉시 PUT.
  // 평소 push() 는 600ms 디바운스 + 사용자 액션 트리거 — 페이지를 빨리 닫거나
  // 네트워크가 잠시 끊겨 retry 다 실패하면 D1 이 로컬보다 뒤처질 수 있음.
  // pushAll() 은 디바운스 무시하고 모든 key 를 한 번에 강제 PUT — 결과를
  // Promise<{ ok: string[], skipped: string[], failed: { key, error }[] }> 로
  // 반환. super 가 아닌 사용자가 호출하면 모두 forbidden → skipped 로 분류.
  // 사용처: super 가 일반모드 콘솔에서 한 번 실행해 D1 을 로컬과 강제 일치.
  function pushAll() {
    var lsKeys = Object.keys(KEY_MAP);
    var results = { ok: [], skipped: [], failed: [] };
    var promises = lsKeys.map(function (lsKey) {
      var apiKey = KEY_MAP[lsKey];
      var raw = _fromLs(lsKey);
      if (raw == null) {
        results.skipped.push(apiKey);
        return Promise.resolve();
      }
      var v = raw;
      try { v = JSON.parse(raw); } catch (_) { /* string 그대로 */ }
      // 진행 중인 디바운스 PUT 이 있으면 취소 — pushAll 결과가 덮어써질 수 있음.
      var pending = _pendingPuts[apiKey];
      if (pending && pending.timer) { clearTimeout(pending.timer); pending.timer = null; }
      return _apiPut(apiKey, v).then(function () {
        results.ok.push(apiKey);
      }).catch(function (e) {
        if (e && e.code === 'forbidden') results.skipped.push(apiKey);
        else results.failed.push({ key: apiKey, error: String(e && e.message || e) });
      });
    });
    return Promise.all(promises).then(function () { return results; });
  }

  root.SCM_CONFIG_SYNC = {
    bootstrap: bootstrap,
    push: push,
    pushAll: pushAll,
    isBooted: function () { return _booted; },
    KEYS: Object.assign({}, KEY_MAP),  // for inspection
    _refetch: _refetch,
  };
})(typeof window !== 'undefined' ? window : globalThis);
