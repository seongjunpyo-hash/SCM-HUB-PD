/* ============================================================
 * scm-lnb — vanilla factory (IIFE), 2-level menu
 * ------------------------------------------------------------
 * 좌측 메뉴 + 펼침/접힘 상태 영속화 + L1 expand toggle.
 *
 * Responsibilities
 *   - active row 설정 (opts.active or el.dataset.active)
 *     active 가 L2 key 면: 해당 L2 .is-active + 부모 L1 .is-active.is-open
 *     active 가 L1 key 면: 해당 L1 .is-active
 *   - data-nav-toggle (L1 button) 클릭 → 부모 .scm-lnb-item.is-open 토글
 *     (collapsed 상태에서 클릭하면 LNB 자동 expand 후 토글)
 *   - lnb-toggle (topbar 의 .scm-topbar__menu-btn / 또는
 *     [data-scm-lnb-toggle]) 와 자동 연동되도록 SCM.lnb.toggle() 노출
 *   - localStorage 'scm-lnb-open' 영속화
 *   - Escape 키로 close
 *
 * 페이지 <head> 에 권장 (FOUC 방지):
 *   <script>
 *     try { if (localStorage.getItem('scm-lnb-open') === '1')
 *       document.documentElement.classList.add('is-lnb-open'); } catch(_) {}
 *   </script>
 *
 * Usage:
 *   SCM.lnb.mount(document.querySelector('.scm-lnb'), { active: 'sku-management' });
 * ============================================================ */

(function (root) {
  var STORAGE_KEY = 'scm-lnb-open';
  var OPEN_CLS = 'is-lnb-open';

  function isOpen() {
    return document.documentElement.classList.contains(OPEN_CLS);
  }

  function setOpen(open) {
    var html = document.documentElement;
    if (open) html.classList.add(OPEN_CLS);
    else html.classList.remove(OPEN_CLS);
    try { localStorage.setItem(STORAGE_KEY, open ? '1' : '0'); } catch (_) {}
  }

  function toggle() { setOpen(!isOpen()); }

  function clearActive(el) {
    var items = el.querySelectorAll('.scm-lnb-item');
    for (var i = 0; i < items.length; i++) items[i].classList.remove('is-active');
    var l2s = el.querySelectorAll('.scm-lnb-l2');
    for (var j = 0; j < l2s.length; j++) l2s[j].classList.remove('is-active');
  }

  function setActive(el, key) {
    if (!el || !key) return;
    clearActive(el);

    // L2 우선 매칭
    var l2 = el.querySelector('.scm-lnb-l2[data-key="' + key + '"]');
    if (l2) {
      l2.classList.add('is-active');
      var item = l2.closest('.scm-lnb-item');
      if (item) {
        item.classList.add('is-active');
        item.classList.add('is-open'); // 항상 expand
      }
      return;
    }

    // L1 매칭
    var item1 = el.querySelector('.scm-lnb-item[data-key="' + key + '"]');
    if (item1) item1.classList.add('is-active');
  }

  function wireNavToggle(el) {
    // L1 row 의 data-nav-toggle 클릭 → 부모 lnb-item.is-open 토글
    var btns = el.querySelectorAll('[data-nav-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        var item = e.currentTarget.closest('.scm-lnb-item');
        if (!item) return;
        // collapsed 상태에서 토글하면 자동 expand (legacy 동작)
        if (!isOpen()) {
          setOpen(true);
          item.classList.add('is-open');
          return;
        }
        item.classList.toggle('is-open');
      });
    }
  }

  function wireEscape() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) setOpen(false);
    });
  }

  // ---------- per-page status tags ----------
  // 작업중   — 실데모 페이지 기본 상태 (아직 최종확정 안 됨)
  // 최종확정 — versions[page].finalId 가 채워졌거나 confirmed[page] flag 가 truthy.
  // # 플레이스홀더는 동적 태그 부착 안 함. 정적 마크업 태그는 CSS 로 숨김.
  var CONFIRMED_KEY = 'scm:dev-export:confirmed:v1';
  var VERSIONS_KEY  = 'scm:voc:versions:v1';
  function _readJsonLs(key) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (_) { return null; }
  }
  function _normalizePath(p) {
    if (!p) return p;
    var n = p.replace(/\.html?$/i, '');
    if (n.endsWith('/')) n += 'index';
    return n;
  }
  function _candidatePaths(pagePath) {
    // 데이터가 다양한 형태로 저장되어 있을 수 있어 (clean URL vs .html), 후보 키들을 모두 검사
    var raw = pagePath;
    var noExt = pagePath.replace(/\.html?$/i, '');
    var norm = _normalizePath(pagePath);
    var withHtml = noExt + '.html';
    var withSlash = noExt.replace(/\/index$/, '/');
    return [raw, noExt, norm, withHtml, withSlash];
  }
  function _isConfirmedPage(pagePath) {
    var cands = _candidatePaths(pagePath);
    var conf = _readJsonLs(CONFIRMED_KEY);
    if (conf) {
      for (var i = 0; i < cands.length; i++) if (conf[cands[i]]) return true;
    }
    var versions = _readJsonLs(VERSIONS_KEY);
    if (versions) {
      for (var j = 0; j < cands.length; j++) {
        var v = versions[cands[j]];
        if (v && v.finalId) return true;
      }
    }
    return false;
  }
  function applyStatusTags(el) {
    if (!el || typeof URL === 'undefined') return;
    var l2s = el.querySelectorAll('.scm-lnb-l2');
    for (var i = 0; i < l2s.length; i++) {
      var a = l2s[i];
      // strip existing dynamic tag (idempotent — re-runs on storage change)
      var prev = a.querySelector('.scm-lnb-tag.is-dynamic');
      if (prev) prev.parentNode.removeChild(prev);
      var href = a.getAttribute('href');
      // Skip placeholder menus — their static --wip tag in markup handles "작업중".
      if (!href || href === '#' || href.charAt(0) === '#') continue;
      var pagePath;
      try { pagePath = new URL(href, document.baseURI).pathname; } catch (_) { continue; }
      var tagText, tagCls;
      if (_isConfirmedPage(pagePath)) {
        tagText = '최종확정';
        tagCls = 'scm-lnb-tag--done';
      } else {
        tagText = '작업중';
        tagCls = 'scm-lnb-tag--wip';
      }
      var tag = document.createElement('span');
      tag.className = 'scm-lnb-tag is-dynamic ' + tagCls;
      tag.textContent = tagText;
      a.appendChild(tag);
    }
  }

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    var active = options.active || el.getAttribute('data-active');
    if (active) setActive(el, active);

    wireNavToggle(el);
    applyStatusTags(el);
    // re-apply when versions / confirmed state changes from another tab
    if (!root.__scmLnbStorageWired) {
      // cross-tab — localStorage storage event
      window.addEventListener('storage', function (e) {
        if (!e || !e.key) return;
        if (e.key === CONFIRMED_KEY || e.key === VERSIONS_KEY) {
          var nodes = document.querySelectorAll('.scm-lnb');
          for (var i = 0; i < nodes.length; i++) applyStatusTags(nodes[i]);
        }
      });
      // same-tab — dev-export.js 가 confirm/unfinalize 시 dispatch
      document.addEventListener('scm:confirmed-changed', function () {
        var nodes = document.querySelectorAll('.scm-lnb');
        for (var i = 0; i < nodes.length; i++) applyStatusTags(nodes[i]);
      });
      root.__scmLnbStorageWired = true;
    }
    if (!root.__scmLnbEscapeWired) {
      wireEscape();
      root.__scmLnbEscapeWired = true;
    }

    return {
      el: el,
      setActive: function (key) { setActive(el, key); },
      open: function () { setOpen(true); },
      close: function () { setOpen(false); },
      toggle: toggle,
      isOpen: isOpen,
    };
  }

  // FOUC restore — 즉시 실행 (lnb.js 가 <head> 에 로드되면 더 좋음)
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1') {
      if (document && document.documentElement) {
        document.documentElement.classList.add(OPEN_CLS);
      }
    }
  } catch (_) {}

  root.SCM = root.SCM || {};
  root.SCM.lnb = {
    mount: mount,
    toggle: toggle,
    open: function () { setOpen(true); },
    close: function () { setOpen(false); },
    isOpen: isOpen,
    setActive: setActive,
  };
})(typeof window !== 'undefined' ? window : globalThis);
