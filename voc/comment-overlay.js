/* ============================================================
 * SCM HUB · VOC Comment Overlay
 * ------------------------------------------------------------
 * 데모 페이지 위에 떠있는 코멘트 오버레이.
 * 우하단 플로팅 버튼 → 코멘트 모드 → 컴포넌트 클릭 → 핀 + 코멘트.
 *
 * Usage:
 *   <script src="/auth-gate.js"></script>
 *   <script src="/voc/comment-overlay.js"></script>
 *
 * Storage:  localStorage 'scm:voc:comments:v1'
 * Author:   window.SCM_USER (auth-gate)
 * ============================================================ */
(function () {
  'use strict';

  if (window.__SCM_VOC_OVERLAY__) return;
  window.__SCM_VOC_OVERLAY__ = true;

  // ============ Config ============
  const STORAGE_KEY = 'scm:voc:comments:v1';
  const Z = 2147483600;
  const PAGE = location.pathname;

  // ============ State ============
  const state = {
    comments: load(),
    mode: 'browse',          // 'browse' | 'comment'
    workerMode: false,       // true while embedded in the VOC iframe — locks LNB and blocks GNB/LNB navigation
    user: { email: 'guest@local', name: '게스트', role: null },
    activeId: null,
    pendingPin: null,        // { x, y, selector, elementText, elementTag, viewportX, viewportY }
    started: false,
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.comments)); }
    catch (e) { console.warn('[voc] save failed', e); }
    // refresh anything derived from comments
    if (state.started) injectLnbCounts();
    // notify parent VOC page (if embedded in iframe) so its sidebar can refresh live
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'voc-changed', page: PAGE }, '*');
      }
    } catch {}
  }
  function uid(p) { return p + '_' + Math.random().toString(36).slice(2, 10); }
  function now() { return Date.now(); }

  // Pin color per role — matches the role-tag colors used in topbar / index.
  // pm/dev/pd share gray (internal-tier members).
  const ROLE_COLORS = {
    super: '#F59E0B',  // amber  (warn)
    admin: '#6E6BFF',  // purple (accent)
    biz:   '#10B981',  // green  (success)
    pm:    '#9CA3AF',  // gray
    dev:   '#9CA3AF',
    pd:    '#9CA3AF',
  };
  // Legacy fallback — when a comment has no `authorRole`, hash the email
  // so distinct users still get distinct colors.
  const FALLBACK_COLORS = [
    '#6E6BFF', '#34D399', '#F59E0B', '#EC4899',
    '#3B82F6', '#A855F7', '#F43F5E', '#14B8A6',
    '#FB923C', '#22D3EE', '#84CC16', '#F97316',
  ];
  function roleColor(role, fallbackEmail) {
    if (role && ROLE_COLORS[role]) return ROLE_COLORS[role];
    const s = String(fallbackEmail || 'guest');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
    return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
  }

  // ---- version helpers (read-only) ----
  // Returns the active version id for `page` (or null = v1 origin).
  // Reads localStorage 'scm:voc:versions:v1' on every call so cross-frame
  // changes surface immediately.
  function _currentVersionIdFor(page) {
    try {
      const raw = localStorage.getItem('scm:voc:versions:v1');
      if (!raw) return null;
      const map = JSON.parse(raw);
      // Same path normalization as voc/index.html + dev-export.js — VOC
      // may have stored the version under '/demo/foo' while the demo
      // standalone reports '/demo/foo.html' (or vice versa). `/demo/`
      // (clean URL) and `/demo/index.html` collapse to `/demo/index`.
      let np = page ? page.replace(/\.html?$/i, '') : page;
      if (np && np.endsWith('/')) np = np + 'index';
      const ver = map && (map[np]
        || map[page]
        || map[page + '.html']
        || map[page + 'index']
        || map[page + 'index.html']);
      if (!ver || !ver.list || !ver.list.length) return null;
      if (!ver.activeId) return null;
      return ver.list.some((v) => v.id === ver.activeId) ? ver.activeId : null;
    } catch (_) { return null; }
  }
  function _commentMatchesActiveVersion(c, page) {
    const active = _currentVersionIdFor(page);
    // Legacy comments (no versionId) belong to the origin v1.
    const cv = c.versionId == null ? null : c.versionId;
    return cv === active;
  }

  // Comments visible to the current user — everything in worker mode
  // (VOC iframe), only the user's own comments otherwise (standalone demo).
  function visibleComments() {
    if (state.workerMode) return state.comments;
    const me = state.user.email;
    return state.comments.filter((c) => c.author === me);
  }
  function pageComments() {
    return visibleComments().filter((c) => c.page === PAGE && _commentMatchesActiveVersion(c, PAGE));
  }
  function indexOfInPage(c) {
    const sorted = pageComments().sort((a, b) => a.createdAt - b.createdAt);
    return sorted.findIndex((x) => x.id === c.id) + 1;
  }

  // ============ Inject styles ============
  function injectStyles() {
    if (document.getElementById('scm-voc-style')) return;
    const s = document.createElement('style');
    s.id = 'scm-voc-style';
    s.textContent = `
      .scm-voc-fab {
        position: fixed; right: 24px; bottom: 24px; z-index: ${Z + 1};
        display: inline-flex; align-items: center; gap: 8px;
        height: 48px; padding: 0 18px 0 16px;
        background: #6E6BFF; color: #fff;
        border: 0; border-radius: 999px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
        cursor: pointer;
        box-shadow: 0 12px 28px rgba(110, 107, 255, 0.42), 0 4px 8px rgba(0,0,0,0.12);
        transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        user-select: none;
      }
      .scm-voc-fab:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(110, 107, 255, 0.5), 0 6px 10px rgba(0,0,0,0.15); }
      .scm-voc-fab.is-active { background: #DC2626; box-shadow: 0 12px 28px rgba(220, 38, 38, 0.4), 0 4px 8px rgba(0,0,0,0.12); }
      .scm-voc-fab__icon { width: 18px; height: 18px; }
      .scm-voc-fab__count {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 18px; height: 18px; padding: 0 5px;
        background: rgba(255,255,255,0.22); color: #fff;
        border-radius: 999px;
        font-size: 11px; font-weight: 700;
        margin-left: 2px;
      }
      .scm-voc-fab.is-active .scm-voc-fab__count { background: rgba(255,255,255,0.25); }

      body.scm-voc-mode-active, body.scm-voc-mode-active * { cursor: crosshair !important; }
      body.scm-voc-mode-active .scm-voc-pin,
      body.scm-voc-mode-active .scm-voc-pin *,
      body.scm-voc-mode-active .scm-voc-fab,
      body.scm-voc-mode-active .scm-voc-fab *,
      body.scm-voc-mode-active .scm-voc-popover,
      body.scm-voc-mode-active .scm-voc-popover * { cursor: auto !important; }
      body.scm-voc-mode-active .scm-voc-pin { cursor: pointer !important; }

      .scm-voc-hover {
        outline: 2px dashed #6E6BFF !important;
        outline-offset: 2px;
        background-color: rgba(110, 107, 255, 0.06) !important;
      }

      .scm-voc-flash {
        animation: scmVocFlash 1.8s ease-out !important;
        position: relative;
        z-index: ${Z - 1};
      }
      @keyframes scmVocFlash {
        0%   { box-shadow: 0 0 0 0 rgba(110,107,255,0.0); outline: 0 solid transparent; }
        15%  { box-shadow: 0 0 0 6px rgba(110,107,255,0.65), 0 0 0 12px rgba(110,107,255,0.25); outline: 2px solid #6E6BFF; outline-offset: 4px; }
        70%  { box-shadow: 0 0 0 6px rgba(110,107,255,0.45), 0 0 0 12px rgba(110,107,255,0.15); outline: 2px solid #6E6BFF; outline-offset: 4px; }
        100% { box-shadow: 0 0 0 0 rgba(110,107,255,0.0); outline: 0 solid transparent; }
      }

      .scm-voc-pin-layer {
        position: absolute; top: 0; left: 0;
        width: 0; height: 0;
        pointer-events: none;
        z-index: ${Z};
        display: none;
      }
      .scm-voc-pin-layer.is-visible { display: block; }
      .scm-voc-pin {
        position: absolute;
        width: 28px; height: 28px;
        /* Anchor: the sharp bottom-left corner is the tip — keep it
           pinned at the saved (left, top) on hover/active too by setting
           transform-origin there so scaling pivots on the tip. */
        margin-left: 0; margin-top: -28px;
        transform-origin: 0 100%;
        --pin-c: #6E6BFF;
        background: var(--pin-c); color: #fff;
        border-radius: 999px 999px 999px 0;
        display: flex; align-items: center; justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 12px; font-weight: 700;
        cursor: pointer; pointer-events: auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28), 0 0 0 3px #fff;
        transition: transform 0.12s ease, box-shadow 0.12s ease;
        user-select: none;
      }
      .scm-voc-pin:hover { transform: scale(1.12); }
      .scm-voc-pin.is-resolved {
        background: #34D399;
        box-shadow: 0 4px 12px rgba(52, 211, 153, 0.4), 0 0 0 3px #fff;
      }
      .scm-voc-pin.is-active {
        transform: scale(1.18);
        box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--pin-c), 0 8px 20px rgba(0,0,0,0.4);
      }

      .scm-voc-popover {
        position: fixed; z-index: ${Z + 2};
        width: 340px;
        background: #fff; color: #15151D;
        border: 1px solid #E5E7EB; border-radius: 12px;
        box-shadow: 0 24px 48px rgba(0,0,0,0.24), 0 4px 12px rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 13px; line-height: 1.5; letter-spacing: -0.01em;
        display: none; flex-direction: column; overflow: hidden;
      }
      .scm-voc-popover.is-open { display: flex; }
      .scm-voc-popover__head {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid #F1F2F5;
      }
      .scm-voc-popover__num {
        width: 22px; height: 22px;
        display: inline-flex; align-items: center; justify-content: center;
        background: #6E6BFF; color: #fff;
        border-radius: 999px;
        font-size: 11px; font-weight: 700;
        flex-shrink: 0;
      }
      .scm-voc-popover__num.is-resolved { background: #34D399; }
      .scm-voc-popover__target {
        flex: 1; min-width: 0;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 11px; color: #6B7280;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .scm-voc-popover__close {
        background: transparent; color: #9CA3AF; border: 0;
        width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .scm-voc-popover__close:hover { background: #F3F4F6; color: #15151D; }
      .scm-voc-popover__thread {
        max-height: 280px; overflow-y: auto;
        padding: 4px 14px;
      }
      .scm-voc-reply {
        padding: 10px 0;
        border-bottom: 1px solid #F1F2F5;
      }
      .scm-voc-reply:last-child { border-bottom: 0; }
      .scm-voc-reply__meta {
        display: flex; align-items: center; gap: 8px;
        margin-bottom: 4px;
        font-size: 11px; color: #9CA3AF;
      }
      .scm-voc-reply__author { color: #15151D; font-weight: 600; }
      .scm-voc-reply__body {
        font-size: 13px; color: #15151D; line-height: 1.55;
        white-space: pre-wrap; word-break: break-word;
      }
      .scm-voc-reply__del {
        margin-left: auto; padding: 2px 4px;
        background: transparent; border: 0; cursor: pointer;
        font-size: 11px; color: #9CA3AF;
      }
      .scm-voc-reply__del:hover { color: #DC2626; }

      .scm-voc-popover__compose {
        padding: 10px 14px 12px;
        background: #FAFAFB;
        border-top: 1px solid #F1F2F5;
      }
      .scm-voc-popover__compose textarea {
        width: 100%;
        background: #fff; color: #15151D;
        border: 1px solid #E5E7EB; border-radius: 8px;
        padding: 9px 10px;
        font-family: inherit; font-size: 13px; line-height: 1.55;
        resize: none; min-height: 64px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.12s ease;
      }
      .scm-voc-popover__compose textarea:focus { border-color: #6E6BFF; }
      .scm-voc-popover__compose textarea::placeholder { color: #9CA3AF; }
      .scm-voc-popover__actions {
        display: flex; align-items: center; gap: 8px;
        margin-top: 8px;
      }
      .scm-voc-popover__hint { flex: 1; font-size: 11px; color: #9CA3AF; }
      .scm-voc-btn {
        height: 28px; padding: 0 12px;
        border: 0; border-radius: 4px; cursor: pointer;
        font-family: inherit; font-size: 12.5px; font-weight: 600;
        transition: all 0.12s ease;
      }
      .scm-voc-btn--ghost { background: transparent; color: #6B7280; border: 1px solid #E5E7EB; }
      .scm-voc-btn--ghost:hover { color: #15151D; background: #F3F4F6; }
      .scm-voc-btn--primary { background: #6E6BFF; color: #fff; }
      .scm-voc-btn--primary:hover { background: #5754ff; }
      .scm-voc-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }

      .scm-voc-popover__foot {
        display: flex; align-items: center; gap: 6px;
        padding: 8px 14px;
        border-top: 1px solid #F1F2F5;
        background: #FAFAFB;
        font-size: 11px;
      }
      .scm-voc-popover__foot .meta { flex: 1; color: #9CA3AF; }
      .scm-voc-popover__foot button {
        background: transparent; border: 0; cursor: pointer;
        padding: 4px 6px;
        font-size: 11px; color: #6B7280;
      }
      .scm-voc-popover__foot button:hover { color: #15151D; }
      .scm-voc-popover__foot button.danger:hover { color: #DC2626; }

      .scm-voc-toast {
        position: fixed; left: 50%; bottom: 92px;
        transform: translateX(-50%) translateY(10px);
        z-index: ${Z + 5};
        background: #15151D; color: #fff;
        border-radius: 8px; padding: 10px 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 13px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.32);
        opacity: 0; pointer-events: none;
        transition: all 0.2s ease;
      }
      .scm-voc-toast.is-on { opacity: 1; transform: translateX(-50%) translateY(0); }

      /* LNB per-page count badge */
      .scm-voc-lnb-count {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 18px; height: 18px;
        padding: 0 5px;
        margin-left: 6px;
        background: #6E6BFF; color: #fff;
        border-radius: 999px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 10px; font-weight: 700; line-height: 1;
        vertical-align: middle;
        box-shadow: 0 0 0 2px rgba(110,107,255,0.18);
      }
      .scm-voc-lnb-count.is-resolved-only { background: #34D399; }

      /* Lock LNB collapsed (a) while in comment mode and (b) always in
         worker mode — prevents the LNB width toggle from shifting <main>
         and drifting saved pin coordinates. */
      html.scm-voc-lock-lnb { --scm-lnb-width: 56px !important; }
      html.scm-voc-lock-lnb .scm-lnb { width: 56px !important; box-shadow: none !important; z-index: 15 !important; }
      html.scm-voc-lock-lnb .scm-lnb:hover { width: 56px !important; box-shadow: none !important; z-index: 15 !important; }
      html.scm-voc-lock-lnb .scm-lnb-label,
      html.scm-voc-lock-lnb .scm-lnb-chev { opacity: 0 !important; }
      html.scm-voc-lock-lnb .scm-lnb-item.is-open .scm-lnb-l2-list { display: none !important; }
      /* Worker mode (VOC iframe) — GNB/LNB are unreachable. Visual cue
         + JS handlers below also block clicks. */
      html.scm-voc-worker .scm-topbar,
      html.scm-voc-worker .scm-lnb,
      html.scm-voc-worker .scm-topbar *,
      html.scm-voc-worker .scm-lnb * {
        cursor: not-allowed !important;
      }
      /* Comment mode: same cue while the user is dropping pins */
      body.scm-voc-mode-active .scm-topbar,
      body.scm-voc-mode-active .scm-lnb,
      body.scm-voc-mode-active .scm-topbar *,
      body.scm-voc-mode-active .scm-lnb * {
        cursor: not-allowed !important;
      }
      /* Worker mode is always-commenting — the toggle FAB is redundant. */
      html.scm-voc-worker .scm-voc-fab { display: none !important; }

      /* Worker-mode click hint — a transient bubble that appears near the
         cursor when the user clicks anywhere in the demo. Helps users
         understand demo features (buttons, dropdowns) won't react in
         this view; clicks place review comments instead. */
      .scm-voc-click-hint {
        position: fixed; z-index: ${Z + 5};
        max-width: 260px; padding: 8px 12px;
        background: #15151D; color: #fff;
        border-radius: 8px;
        box-shadow: 0 12px 28px rgba(0,0,0,0.28), 0 4px 8px rgba(0,0,0,0.18);
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 12px; line-height: 1.5; font-weight: 500;
        letter-spacing: -0.01em;
        pointer-events: none;
        opacity: 0;
        transform: translate(12px, 12px) scale(0.96);
        transition: opacity 0.14s ease, transform 0.14s ease;
        white-space: normal;
      }
      .scm-voc-click-hint.is-visible {
        opacity: 1;
        transform: translate(12px, 12px) scale(1);
      }
      .scm-voc-click-hint__title {
        display: block; margin-bottom: 2px;
        font-weight: 700; font-size: 12px;
      }
      .scm-voc-click-hint__body {
        display: block;
        opacity: 0.82;
      }
    `;
    document.head.appendChild(s);
  }

  // ============ DOM build ============
  let elFab, elFabCount, elPinLayer, elPopover, elPopNum, elPopTarget,
      elPopThread, elPopInput, elPopSubmit, elPopFoot, elPopMeta,
      elPopResolve, elPopDelete, elPopClose, elPopCompose, elToast;
  let toastTimer = null;

  function buildDOM() {
    // FAB
    elFab = document.createElement('button');
    elFab.className = 'scm-voc-fab';
    elFab.type = 'button';
    elFab.title = '코멘트 모드 (ESC 종료)';
    elFab.innerHTML = `
      <svg class="scm-voc-fab__icon" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
      <span class="scm-voc-fab__label">코멘트</span>
      <span class="scm-voc-fab__count" id="scm-voc-fab-count">0</span>
    `;
    document.body.appendChild(elFab);
    elFabCount = elFab.querySelector('#scm-voc-fab-count');
    elFab.addEventListener('click', toggleMode);

    // Pin layer
    elPinLayer = document.createElement('div');
    elPinLayer.className = 'scm-voc-pin-layer';
    document.body.appendChild(elPinLayer);

    // Popover
    elPopover = document.createElement('div');
    elPopover.className = 'scm-voc-popover';
    elPopover.innerHTML = `
      <div class="scm-voc-popover__head">
        <span class="scm-voc-popover__num">+</span>
        <span class="scm-voc-popover__target">새 코멘트</span>
        <button class="scm-voc-popover__close" type="button" title="닫기">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="scm-voc-popover__thread"></div>
      <div class="scm-voc-popover__compose">
        <textarea placeholder="이 컴포넌트에 대한 의견을 남겨주세요…"></textarea>
        <div class="scm-voc-popover__actions">
          <span class="scm-voc-popover__hint">⌘/Ctrl + Enter 전송</span>
          <button class="scm-voc-btn scm-voc-btn--ghost" data-act="cancel" type="button">취소</button>
          <button class="scm-voc-btn scm-voc-btn--primary" data-act="submit" type="button">등록</button>
        </div>
      </div>
      <div class="scm-voc-popover__foot" style="display:none;">
        <span class="meta"></span>
        <button data-act="resolve" type="button">✓ 해결됨으로 표시</button>
        <button class="danger" data-act="delete" type="button">삭제</button>
      </div>
    `;
    document.body.appendChild(elPopover);
    elPopNum     = elPopover.querySelector('.scm-voc-popover__num');
    elPopTarget  = elPopover.querySelector('.scm-voc-popover__target');
    elPopThread  = elPopover.querySelector('.scm-voc-popover__thread');
    elPopInput   = elPopover.querySelector('textarea');
    elPopSubmit  = elPopover.querySelector('[data-act="submit"]');
    elPopClose   = elPopover.querySelector('.scm-voc-popover__close');
    elPopFoot    = elPopover.querySelector('.scm-voc-popover__foot');
    elPopCompose = elPopover.querySelector('.scm-voc-popover__compose');
    elPopMeta    = elPopFoot.querySelector('.meta');
    elPopResolve = elPopFoot.querySelector('[data-act="resolve"]');
    elPopDelete  = elPopFoot.querySelector('[data-act="delete"]');
    const elPopCancel = elPopover.querySelector('[data-act="cancel"]');

    elPopClose.addEventListener('click', closePopover);
    elPopCancel.addEventListener('click', closePopover);
    elPopSubmit.addEventListener('click', onSubmit);
    elPopResolve.addEventListener('click', onResolveToggle);
    elPopDelete.addEventListener('click', onDelete);
    elPopInput.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    });

    // Toast
    elToast = document.createElement('div');
    elToast.className = 'scm-voc-toast';
    document.body.appendChild(elToast);

    // Worker-mode click hint — explains why demo buttons don't react.
    // Single shared instance; positions follow the cursor on each click.
    elClickHint = document.createElement('div');
    elClickHint.className = 'scm-voc-click-hint';
    elClickHint.innerHTML =
      '<span class="scm-voc-click-hint__title">현재 화면에서는 데모 기능이 동작하지 않아요.</span>' +
      '<span class="scm-voc-click-hint__body">등록된 코멘트 핀을 클릭하면 내용을 확인할 수 있어요.</span>';
    document.body.appendChild(elClickHint);
  }

  // Show the worker-mode click hint near (clientX, clientY). Auto-hides
  // after a short delay; subsequent clicks reset the timer + reposition.
  let elClickHint = null;
  let clickHintTimer = null;
  function showClickHint(x, y) {
    if (!elClickHint) return;
    // Keep within viewport — flip to the upper-left if too close to right/bottom.
    const w = 280, h = 64;
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = x, top = y;
    if (x + w + 24 > vw) left = x - w - 24;
    if (y + h + 24 > vh) top = y - h - 24;
    elClickHint.style.left = Math.max(8, left) + 'px';
    elClickHint.style.top  = Math.max(8, top) + 'px';
    elClickHint.classList.add('is-visible');
    if (clickHintTimer) clearTimeout(clickHintTimer);
    clickHintTimer = setTimeout(() => {
      elClickHint.classList.remove('is-visible');
      clickHintTimer = null;
    }, 1800);
  }

  // ============ Mode ============
  function toggleMode() {
    setMode(state.mode === 'comment' ? 'browse' : 'comment');
  }
  function setMode(m) {
    state.mode = m;
    elFab.classList.toggle('is-active', m === 'comment');
    document.body.classList.toggle('scm-voc-mode-active', m === 'comment');
    const labelEl = elFab.querySelector('.scm-voc-fab__label');
    if (labelEl) labelEl.textContent = m === 'comment' ? '코멘트 모드 ON' : '코멘트';
    applyLnbLock();
    updatePinVisibility();
    // Layout might have just changed — reposition pins.
    schedulePinRender();
  }

  // LNB lock applies whenever we're commenting OR embedded in the VOC iframe.
  function applyLnbLock() {
    const html = document.documentElement;
    const lock = state.workerMode || state.mode === 'comment';
    if (lock) {
      html.classList.remove('is-lnb-open');
      html.classList.add('scm-voc-lock-lnb');
    } else {
      html.classList.remove('scm-voc-lock-lnb');
    }
  }

  // ============ Listeners ============
  let hoverEl = null;
  function clearHover() {
    if (hoverEl) { hoverEl.classList.remove('scm-voc-hover'); hoverEl = null; }
  }
  function isOurUI(el) {
    if (!el || !el.closest) return false;
    return !!(el.closest('.scm-voc-fab') ||
              el.closest('.scm-voc-pin') ||
              el.closest('.scm-voc-popover') ||
              el.closest('.scm-voc-toast') ||
              el.closest('.scm-voc-pin-layer'));
  }
  // GNB / LNB — out of bounds for commenting (menus, not page content).
  function isNonCommentable(el) {
    if (!el || !el.closest) return false;
    return !!(el.closest('.scm-topbar') || el.closest('.scm-lnb'));
  }
  // Inside the topbar there are a few interactive controls (version
  // selector dropdown, …) that should remain clickable even when worker
  // mode otherwise locks the topbar. This whitelist is consulted before
  // we preventDefault on a topbar click in worker mode.
  function isWorkerInteractive(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('.scm-dev-version-wrap');
  }

  function attachListeners() {
    // Click capture — intercept before page handlers
    document.addEventListener('click', (e) => {
      if (isOurUI(e.target)) return;
      // In worker mode (VOC iframe), GNB/LNB are entirely off-limits —
      // no navigation, no toggle, no comment. EXCEPT: a few interactive
      // controls (the version selector dropdown) need to keep working
      // — let those clicks fall through to the page's own handlers.
      if (state.workerMode && isNonCommentable(e.target)) {
        if (isWorkerInteractive(e.target)) return;
        // Surface the same click-hint here so the user understands the
        // GNB/LNB clicks are also non-functional, not just main area.
        showClickHint(e.clientX, e.clientY);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation && e.stopImmediatePropagation();
        return;
      }
      // Worker mode + main area click — pin will be placed below by the
      // mode === 'comment' branch (worker mode forces comment mode). Also
      // surface a transient hint so the user understands why the demo's
      // buttons / dropdowns / links didn't react to their click.
      if (state.workerMode) {
        showClickHint(e.clientX, e.clientY);
      }
      if (state.mode !== 'comment') return;
      // In comment mode, GNB/LNB clicks are suppressed too (no pin there).
      if (isNonCommentable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation && e.stopImmediatePropagation();
      onPlacePin(e);
    }, true);
    // Block drag/select start in comment mode + worker mode (GNB/LNB)
    document.addEventListener('mousedown', (e) => {
      if (isOurUI(e.target)) return;
      if (state.workerMode && isNonCommentable(e.target)) {
        if (isWorkerInteractive(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (state.mode !== 'comment') return;
      if (isNonCommentable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    }, true);
    document.addEventListener('submit', (e) => {
      if (state.mode === 'comment') { e.preventDefault(); e.stopPropagation(); }
    }, true);
    // Hover highlight — in worker mode we suppress this since clicking
    // does nothing (read-only). Highlight would mislead viewers into
    // expecting click-to-pin.
    document.addEventListener('mouseover', (e) => {
      if (state.workerMode) { clearHover(); return; }
      if (state.mode !== 'comment') { clearHover(); return; }
      if (isOurUI(e.target) || isNonCommentable(e.target)) { clearHover(); return; }
      if (hoverEl === e.target) return;
      clearHover();
      if (e.target && e.target.classList) {
        e.target.classList.add('scm-voc-hover');
        hoverEl = e.target;
      }
    }, true);
    document.addEventListener('mouseout', (e) => {
      if (e.target === hoverEl) clearHover();
    }, true);
    // ESC
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (elPopover.classList.contains('is-open')) closePopover();
      // Worker mode: stay in comment mode permanently — ESC just closes popover.
      else if (state.mode === 'comment' && !state.workerMode) setMode('browse');
    });
    // Outside click closes popover
    document.addEventListener('mousedown', (e) => {
      if (!elPopover.classList.contains('is-open')) return;
      if (elPopover.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.scm-voc-pin')) return;
      // if in comment mode, an outside click might be a new pin — let it through
      if (state.mode === 'comment') return;
      closePopover();
    });
    // Pin click (delegated)
    document.addEventListener('click', (e) => {
      const pin = e.target.closest && e.target.closest('.scm-voc-pin');
      if (!pin) return;
      e.preventDefault();
      e.stopPropagation();
      const id = pin.dataset.cmtId;
      const c = state.comments.find((x) => x.id === id);
      if (c) openThread(c, pin);
    });
    // Reposition popover on scroll
    window.addEventListener('scroll', () => {
      if (!elPopover.classList.contains('is-open')) return;
      if (state.activeId) {
        const pin = document.querySelector(`.scm-voc-pin[data-cmt-id="${state.activeId}"]`);
        if (pin) positionAt(pin);
      } else if (state.pendingPin) {
        positionAtViewport(state.pendingPin.viewportX, state.pendingPin.viewportY);
      }
    }, true);
  }

  function onPlacePin(e) {
    // VOC worker mode = view-only. Pin placement (and the "+" pending pin
    // popover that follows) is disabled — clicking the demo just does
    // nothing. Existing pins remain clickable and open the read-only
    // thread popover instead.
    if (state.workerMode) return;
    const target = e.target;
    if (target && target.classList) target.classList.remove('scm-voc-hover');
    const sx = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;
    const sy = window.scrollY || window.pageYOffset || document.documentElement.scrollTop  || 0;
    // Pin is anchored to the element's top-left corner — same place no
    // matter where the user clicks within the element.
    let docX, docY;
    try {
      const rect = target.getBoundingClientRect();
      docX = Math.round(rect.left + sx);
      docY = Math.round(rect.top  + sy);
    } catch {
      docX = Math.round(e.clientX + sx);
      docY = Math.round(e.clientY + sy);
    }
    state.pendingPin = {
      x: docX, y: docY,
      offsetX: 0, offsetY: 0,
      viewportX: e.clientX, viewportY: e.clientY,
      selector: cssPath(target),
      elementText: ((target.innerText || target.textContent || '') + '').trim().slice(0, 80),
      elementTag: target.tagName,
    };
    openCompose();
  }

  // ============ CSS path ============
  function cssEscape(s) {
    if (window.CSS && CSS.escape) return CSS.escape(s);
    return String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }
  function cssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el === document.body) return 'body';
    const path = [];
    let cur = el, depth = 0;
    while (cur && cur.nodeType === 1 && depth < 5) {
      let part = cur.nodeName.toLowerCase();
      if (cur.id) {
        path.unshift('#' + cssEscape(cur.id));
        break;
      }
      const cls = (cur.className && typeof cur.className === 'string')
        ? cur.className.trim().split(/\s+/).filter(Boolean).filter((x) => !x.startsWith('scm-voc-')).slice(0, 2)
        : [];
      if (cls.length) part += '.' + cls.map(cssEscape).join('.');
      let nth = 1, sib = cur;
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName === cur.nodeName) nth++;
      }
      if (nth > 1) part += `:nth-of-type(${nth})`;
      path.unshift(part);
      cur = cur.parentElement;
      depth++;
    }
    return path.join(' > ');
  }

  // ============ Popover ============
  function openCompose() {
    state.activeId = null;
    elPopNum.textContent = '+';
    elPopNum.classList.remove('is-resolved');
    elPopTarget.textContent = formatTarget(state.pendingPin);
    elPopThread.innerHTML = '';
    elPopInput.value = '';
    elPopInput.placeholder = '이 컴포넌트에 대한 의견을 남겨주세요…';
    elPopSubmit.textContent = '등록';
    elPopFoot.style.display = 'none';
    elPopover.classList.add('is-open');
    positionAtViewport(state.pendingPin.viewportX, state.pendingPin.viewportY);
    requestAnimationFrame(() => elPopInput.focus());
    highlightActive();
  }

  function openThread(c, pinEl) {
    state.activeId = c.id;
    state.pendingPin = null;
    const idx = indexOfInPage(c);
    elPopNum.textContent = String(idx);
    elPopNum.classList.toggle('is-resolved', c.status === 'resolved');
    elPopTarget.textContent = formatTarget(c);
    elPopThread.innerHTML = c.thread.map((r) => renderReplyHTML(r)).join('');
    elPopInput.value = '';
    elPopInput.placeholder = '답글…';
    elPopSubmit.textContent = '답글';
    // VOC worker mode = read-only popover. Hide the reply textarea + the
    // resolve / delete footer so the user can only INSPECT pin info.
    // Reply-delete buttons inside the thread are also already gated by
    // canDel (author === current user), so they won't appear for worker
    // viewers in practice.
    if (state.workerMode) {
      if (elPopCompose) elPopCompose.style.display = 'none';
      elPopFoot.style.display = 'none';
    } else {
      if (elPopCompose) elPopCompose.style.display = '';
      elPopFoot.style.display = '';
    }
    elPopMeta.textContent = c.status === 'resolved'
      ? '✓ 해결됨'
      : `${c.thread.length}개 코멘트`;
    elPopResolve.textContent = c.status === 'resolved' ? '↩ 미해결로 되돌리기' : '✓ 해결됨으로 표시';
    elPopover.classList.add('is-open');
    elPopThread.querySelectorAll('[data-del-reply]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteReply(c.id, btn.dataset.delReply);
      });
    });
    const pin = pinEl || document.querySelector(`.scm-voc-pin[data-cmt-id="${c.id}"]`);
    if (pin) positionAt(pin);
    if (!state.workerMode) requestAnimationFrame(() => elPopInput.focus());
    highlightActive();
  }

  function renderReplyHTML(r) {
    const time = relTime(r.createdAt);
    const canDel = r.author === state.user.email;
    return `
      <div class="scm-voc-reply">
        <div class="scm-voc-reply__meta">
          <span class="scm-voc-reply__author">${escapeHtml(r.author || '익명')}</span>
          <span>·</span>
          <span>${time}</span>
          ${canDel ? `<button class="scm-voc-reply__del" data-del-reply="${r.id}" type="button" title="삭제">삭제</button>` : ''}
        </div>
        <div class="scm-voc-reply__body">${escapeHtml(r.text)}</div>
      </div>
    `;
  }

  function closePopover() {
    elPopover.classList.remove('is-open');
    state.pendingPin = null;
    state.activeId = null;
    highlightActive();
  }

  function positionAt(pinEl) {
    const r = pinEl.getBoundingClientRect();
    positionAtViewport(r.left + r.width / 2, r.top + r.height / 2);
  }
  function positionAtViewport(vx, vy) {
    const w = elPopover.offsetWidth || 340;
    const h = elPopover.offsetHeight || 240;
    const margin = 12;
    let left = vx + 18;
    let top  = vy + 12;
    if (left + w + margin > window.innerWidth)  left = vx - w - 18;
    if (left < margin) left = margin;
    if (top + h + margin > window.innerHeight)  top = window.innerHeight - h - margin;
    if (top < margin) top = margin;
    elPopover.style.left = left + 'px';
    elPopover.style.top  = top  + 'px';
  }

  // ============ Submit / mutate ============
  function onSubmit() {
    const text = elPopInput.value.trim();
    if (!text) { elPopInput.focus(); return; }

    if (state.activeId) {
      const c = state.comments.find((x) => x.id === state.activeId);
      if (!c) return;
      c.thread.push({
        id: uid('r'), author: state.user.email, authorRole: state.user.role, text, createdAt: now(),
      });
      persist();
      openThread(c);
      showToast('답글 등록');
    } else if (state.pendingPin) {
      const p = state.pendingPin;
      const c = {
        id: uid('c'),
        page: PAGE,
        // Tag the comment with the currently active version so the VOC
        // sidebar can filter comments per version. `null` = origin (v1).
        versionId: _currentVersionIdFor(PAGE),
        x: p.x, y: p.y,
        selector: p.selector,
        elementText: p.elementText,
        elementTag: p.elementTag,
        status: 'open',
        createdAt: now(),
        author: state.user.email,
        authorRole: state.user.role,
        thread: [{
          id: uid('r'), author: state.user.email, authorRole: state.user.role, text, createdAt: now(),
        }],
      };
      state.comments.push(c);
      persist();
      renderPins();
      updateCount();
      closePopover();
      showToast('코멘트 등록 — 핀이 추가되었습니다');
    }
  }

  function onResolveToggle() {
    const c = state.comments.find((x) => x.id === state.activeId);
    if (!c) return;
    c.status = c.status === 'resolved' ? 'open' : 'resolved';
    persist();
    renderPins();
    openThread(c);
    showToast(c.status === 'resolved' ? '해결됨으로 표시' : '미해결로 되돌림');
  }
  function onDelete() {
    const c = state.comments.find((x) => x.id === state.activeId);
    if (!c) return;
    if (!confirm('이 핀과 모든 코멘트를 삭제할까요?')) return;
    state.comments = state.comments.filter((x) => x.id !== c.id);
    persist();
    renderPins();
    updateCount();
    closePopover();
    showToast('핀 삭제됨');
  }
  function deleteReply(commentId, replyId) {
    const c = state.comments.find((x) => x.id === commentId);
    if (!c) return;
    if (c.thread.length === 1) {
      if (!confirm('마지막 코멘트입니다. 핀 전체를 삭제할까요?')) return;
      state.comments = state.comments.filter((x) => x.id !== commentId);
      persist();
      renderPins();
      updateCount();
      closePopover();
      showToast('핀 삭제됨');
      return;
    }
    c.thread = c.thread.filter((r) => r.id !== replyId);
    persist();
    openThread(c);
  }

  // ============ Render ============
  // Pins always anchor at the element's top-left corner (offsetX/Y on
  // the comment is ignored for positioning — kept on disk only as a
  // historical record of where the user originally clicked). Falls back
  // to the stored absolute (x, y) if the element no longer exists.
  function resolvePinCoords(c) {
    if (c.selector) {
      try {
        const el = document.querySelector(c.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 || rect.height > 0) {
            const sx = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;
            const sy = window.scrollY || window.pageYOffset || document.documentElement.scrollTop  || 0;
            return {
              x: Math.round(rect.left + sx),
              y: Math.round(rect.top  + sy),
            };
          }
        }
      } catch {}
    }
    return { x: c.x, y: c.y };
  }

  function renderPins() {
    if (!elPinLayer) return;
    const pins = pageComments();
    const sorted = [...pins].sort((a, b) => a.createdAt - b.createdAt);
    const idxMap = new Map();
    sorted.forEach((c, i) => idxMap.set(c.id, i + 1));

    elPinLayer.innerHTML = pins.map((c) => {
      const cls = ['scm-voc-pin'];
      if (c.status === 'resolved') cls.push('is-resolved');
      if (c.id === state.activeId) cls.push('is-active');
      const { x, y } = resolvePinCoords(c);
      const color = roleColor(c.authorRole, c.author);
      const tip = (c.thread[0] ? c.thread[0].text.slice(0, 40) : '') + (c.author ? ' — ' + c.author : '');
      return `<div class="${cls.join(' ')}" data-cmt-id="${c.id}" style="left:${x}px;top:${y}px;--pin-c:${color};" title="${escapeHtml(tip)}">${idxMap.get(c.id)}</div>`;
    }).join('');
  }
  // Debounced render — used on resize / class mutation / mode change.
  let _renderTimer = null;
  function schedulePinRender(delay) {
    if (_renderTimer) clearTimeout(_renderTimer);
    _renderTimer = setTimeout(renderPins, delay == null ? 80 : delay);
  }
  function highlightActive() {
    document.querySelectorAll('.scm-voc-pin').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.cmtId === state.activeId);
    });
  }
  function updateCount() {
    if (elFabCount) elFabCount.textContent = String(pageComments().length);
  }

  // Pin visibility — pins are anchor markers; show only when in comment mode.
  function updatePinVisibility() {
    if (!elPinLayer) return;
    elPinLayer.classList.toggle('is-visible', state.mode === 'comment');
  }

  // LNB per-page count badge — walks anchors with hrefs that resolve to a
  // local path and tags each with the count of comments on that page.
  function injectLnbCounts() {
    const counts = new Map();
    const resolved = new Map();
    visibleComments().forEach((c) => {
      counts.set(c.page, (counts.get(c.page) || 0) + 1);
      if (c.status === 'resolved') {
        resolved.set(c.page, (resolved.get(c.page) || 0) + 1);
      }
    });
    const anchors = document.querySelectorAll(
      '.scm-lnb-l2[href], .scm-lnb-item > a.scm-lnb-row[href]'
    );
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || /^(javascript:|mailto:|tel:)/i.test(href)) {
        const ex = a.querySelector('.scm-voc-lnb-count');
        if (ex) ex.remove();
        return;
      }
      let path;
      try { path = new URL(href, location.href).pathname; }
      catch {
        const ex = a.querySelector('.scm-voc-lnb-count');
        if (ex) ex.remove();
        return;
      }
      const total = counts.get(path) || 0;
      const allResolved = total > 0 && (resolved.get(path) || 0) === total;
      let badge = a.querySelector('.scm-voc-lnb-count');
      if (total === 0) {
        if (badge) badge.remove();
        return;
      }
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'scm-voc-lnb-count';
        a.appendChild(badge);
      }
      badge.classList.toggle('is-resolved-only', !!allResolved);
      badge.textContent = String(total);
      badge.title = `이 페이지에 코멘트 ${total}개${allResolved ? ' (전부 해결됨)' : ''}`;
    });
  }

  // ============ Helpers ============
  function formatTarget(c) {
    if (!c) return '';
    const tag = (c.elementTag || '').toLowerCase();
    const txt = (c.elementText || '').replace(/\s+/g, ' ').trim();
    if (txt) return `<${tag || 'el'}> "${txt.length > 40 ? txt.slice(0, 40) + '…' : txt}"`;
    return c.selector || `<${tag}>`;
  }
  function relTime(t) {
    const d = (Date.now() - t) / 1000;
    if (d < 60)        return '방금';
    if (d < 3600)      return Math.floor(d / 60) + '분 전';
    if (d < 86400)     return Math.floor(d / 3600) + '시간 전';
    if (d < 86400 * 7) return Math.floor(d / 86400) + '일 전';
    const dt = new Date(t);
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function showToast(msg) {
    elToast.textContent = msg;
    elToast.classList.add('is-on');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elToast.classList.remove('is-on'), 1800);
  }

  // ============ URL anchor (#voc=<id>) ============
  function handleAnchor() {
    const m = location.hash.match(/^#voc=([\w-]+)/);
    if (!m) return;
    const c = state.comments.find((x) => x.id === m[1] && x.page === PAGE);
    if (!c) return;
    setTimeout(() => {
      window.scrollTo({ top: Math.max(0, c.y - window.innerHeight * 0.35), behavior: 'smooth' });
      setTimeout(() => openThread(c), 380);
    }, 60);
  }

  // ============ Postmessage API (parent VOC page → overlay) ============
  function handleParentMessage(e) {
    const d = e && e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'voc-open' && d.id) {
      const c = state.comments.find((x) => x.id === d.id && x.page === PAGE);
      if (!c) return;
      window.scrollTo({ top: Math.max(0, c.y - window.innerHeight * 0.35), behavior: 'smooth' });
      setTimeout(() => openThread(c), 320);
    } else if (d.type === 'voc-close') {
      closePopover();
    } else if (d.type === 'voc-set-mode') {
      setMode(d.mode === 'comment' ? 'comment' : 'browse');
    } else if (d.type === 'voc-worker-mode') {
      state.workerMode = !!d.on;
      document.documentElement.classList.toggle('scm-voc-worker', state.workerMode);
      // In worker mode the iframe is permanently a comment surface —
      // skip the FAB toggle and stay in comment mode.
      if (state.workerMode) setMode('comment');
      applyLnbLock();
      schedulePinRender();
    } else if (d.type === 'voc-flash') {
      // Locate + flash the element by selector. Falls back to (x, y) coords.
      flashLocate(d.selector || null, d.x, d.y);
    } else if (d.type === 'voc-sim-apply') {
      // Inject a CSS override scoped by an arbitrary id (so multiple sims can coexist).
      simApply(d.id, d.css || '');
    } else if (d.type === 'voc-sim-reset') {
      simReset(d.id);
    } else if (d.type === 'voc-sim-reset-all') {
      simResetAll();
    } else if (d.type === 'voc-ping') {
      // parent asks "are you ready?" — reply with current page
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'voc-ready', page: PAGE }, '*');
        }
      } catch {}
    }
  }

  function flashLocate(selector, fallbackX, fallbackY) {
    let el = null;
    if (selector) { try { el = document.querySelector(selector); } catch {} }
    if (el) {
      try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch {}
      el.classList.remove('scm-voc-flash');
      // force reflow so the animation restarts even when re-clicking the same target
      void el.offsetWidth;
      el.classList.add('scm-voc-flash');
      setTimeout(() => { try { el.classList.remove('scm-voc-flash'); } catch {} }, 1900);
    } else if (typeof fallbackY === 'number') {
      try { window.scrollTo({ top: Math.max(0, fallbackY - window.innerHeight * 0.35), behavior: 'smooth' }); } catch {}
    }
  }

  function simApply(id, css) {
    if (!id) return;
    const sid = 'scm-voc-sim-' + id;
    let style = document.getElementById(sid);
    if (!style) {
      style = document.createElement('style');
      style.id = sid;
      style.dataset.vocSim = '1';
      document.head.appendChild(style);
    }
    style.textContent = css || '';
  }
  function simReset(id) {
    if (!id) return;
    const style = document.getElementById('scm-voc-sim-' + id);
    if (style) style.remove();
  }
  function simResetAll() {
    document.querySelectorAll('style[data-voc-sim="1"]').forEach((s) => s.remove());
  }
  function announceReady() {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'voc-ready', page: PAGE }, '*');
      }
    } catch {}
  }

  // ============ Boot ============
  function start() {
    if (state.started) return;
    state.started = true;
    if (window.SCM_USER) {
      state.user.email = window.SCM_USER.email;
      state.user.name  = window.SCM_USER.name || window.SCM_USER.email;
      state.user.role  = window.SCM_USER.role || null;
    }
    injectStyles();
    buildDOM();
    attachListeners();
    renderPins();
    updateCount();
    updatePinVisibility();
    injectLnbCounts();
    handleAnchor();
    window.addEventListener('hashchange', handleAnchor);
    window.addEventListener('message', handleParentMessage);
    // Cross-tab/storage sync — another window/tab edits comments OR
    // switches the active version (which changes the visible-comment set).
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        state.comments = load();
        renderPins();
        updateCount();
        injectLnbCounts();
      } else if (e.key === 'scm:voc:versions:v1') {
        // active version may have changed → re-filter
        renderPins();
        updateCount();
      }
    });
    // Layout-affecting changes — re-anchor pins to their elements
    window.addEventListener('resize', () => schedulePinRender(120));
    try {
      new MutationObserver(() => schedulePinRender(180))
        .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } catch {}
    announceReady();
  }

  function bootWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootWhenAuthed, { once: true });
    } else {
      bootWhenAuthed();
    }
  }
  function bootWhenAuthed() {
    if (window.SCM_USER) { start(); return; }
    document.addEventListener('scm:auth-ready', start, { once: true });
    // dev fallback — start anyway after 3s so the FAB never disappears
    setTimeout(() => { if (!state.started) start(); }, 3000);
  }

  bootWhenReady();
})();
