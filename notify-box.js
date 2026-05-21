/* ============================================================
 * notify-box.js — 공통 GNB 알림함 (드롭다운 팝오버)
 * ------------------------------------------------------------
 * topbar.js 의 캐노니컬 마크업에 들어있는 .scm-topbar__notify-btn
 * (벨 아이콘) 을 클릭하면 벨 바로 아래에 드롭다운 팝오버로 알림
 * 타임라인을 노출한다.
 *
 * 설계:
 *   - scm-shell.js 가 모든 데모 페이지에 일괄 로드 → 모든 GNB 에서 동작.
 *   - 딤(backdrop) 없음. 바깥 클릭 / Esc 로 닫힘.
 *   - 벨 클릭은 document 위임으로 잡으므로 topbar mount 타이밍과 무관.
 *   - 팝오버 마크업/스타일은 본 파일이 1회 주입 (단일 source).
 *
 * 페이지별 알림 데이터를 다르게 주고 싶으면:
 *   window.SCM_NOTIFY_ITEMS = [...]; (본 스크립트 로드 전/후 무관)
 * 미지정 시 아래 DEFAULT_ITEMS 사용.
 * ============================================================ */
(function (root) {
  'use strict';
  if (root.__scmNotifyBooted) return;
  root.__scmNotifyBooted = true;

  var POP_WIDTH = 400;
  var POP_GAP = 6; // 벨 하단과 팝오버 사이 간격
  var VIEWPORT_MARGIN = 8;

  // ── 기본 데모 알림 데이터 (Figma 타임라인) ──────────────────
  var DEFAULT_ITEMS = [
    { time: '26.03.16. 12:00', unread: true, dot: 'active', entries: [
      { title: 'MFS 물류중앙화 출고 취소', status: '성공', ref: 'TX-INB2603050000018' },
      { title: 'MFS 물류중앙화 출고 취소', status: '실패', ref: 'TX-INB2603050000018', reason: '이미 취소 처리된 요청입니다.' },
    ]},
    { time: '26.03.16. 12:00', unread: true, entries: [
      { title: 'MFS 재고보충 출고 취소', status: '성공', ref: 'OB94825-3850837NWH02' },
    ]},
    { time: '26.03.16. 12:00', unread: true, entries: [
      { title: 'MFS 물류중앙화 출고 취소', status: '실패', ref: 'TX-INB2603050000018', reason: '이미 취소 처리된 요청입니다.' },
    ]},
    { time: '26.03.16. 12:00', unread: true, entries: [
      { title: 'MFS 재고보충 출고 취소', status: '실패', ref: 'TX-INB2603050000018', reason: '이미 취소 처리된 요청입니다.' },
    ]},
    { time: '26.03.16. 12:00', unread: true, entries: [
      { title: '2건 입고 취소', status: '성공', ref: 'TX-INB2603050000018' },
    ]},
  ];

  var STYLE_ID = 'scm-notify-pop-style';
  var CSS = [
    '.scm-notify-pop{position:fixed;z-index:1200;width:' + POP_WIDTH + 'px;max-width:calc(100vw - 16px);',
      'background:#fff;border-radius:6px;box-shadow:0 10px 15px 8px rgba(0,0,0,0.05);',
      'display:flex;flex-direction:column;max-height:calc(100vh - 80px);overflow:hidden;',
      "font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;}",
    '.scm-notify-pop[hidden]{display:none;}',
    '.scm-notify-pop__head{position:relative;padding:24px 24px 16px;display:flex;flex-direction:column;gap:8px;}',
    '.scm-notify-pop__title{margin:0;color:#000;font-size:18px;font-weight:600;line-height:24.48px;}',
    '.scm-notify-pop__sub{color:#666;font-size:14px;font-weight:400;line-height:19.6px;}',
    '.scm-notify-pop__clear{position:absolute;top:20px;right:20px;width:24px;height:24px;padding:0;',
      'background:transparent;border:0;border-radius:4px;cursor:pointer;color:#666;',
      'display:flex;align-items:center;justify-content:center;}',
    '.scm-notify-pop__clear:hover{background:rgba(138,138,138,0.10);}',
    '.scm-notify-pop__clear svg{width:18px;height:18px;}',
    '.scm-notify-pop__body{flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 24px 8px;}',
    '.scm-notify-pop__empty{padding:40px 0 48px;text-align:center;color:#8A8A8A;font-size:14px;line-height:19.6px;}',
    '.scm-notify-row{display:flex;gap:20px;}',
    '.scm-notify-row__rail{flex:0 0 auto;padding-left:3px;display:flex;flex-direction:column;align-items:center;}',
    '.scm-notify-row__dot{width:10px;height:10px;border-radius:9999px;background:#fff;border:2px solid #CCCCCC;flex:0 0 auto;}',
    '.scm-notify-row--active .scm-notify-row__dot{border-color:#245EFF;}',
    '.scm-notify-row__line{flex:1 1 auto;width:0;border-left:1px solid #EBEBEB;margin-top:2px;}',
    '.scm-notify-row:last-child .scm-notify-row__line{display:none;}',
    '.scm-notify-row__content{flex:1 1 0;min-width:0;padding-bottom:28px;display:flex;flex-direction:column;gap:8px;}',
    '.scm-notify-row__date{display:flex;align-items:center;gap:4px;color:#8A8A8A;font-size:14px;font-weight:400;line-height:19.6px;}',
    '.scm-notify-row__unread{width:5px;height:5px;border-radius:9999px;background:#245EFF;flex:0 0 auto;align-self:center;}',
    '.scm-notify-entry{display:flex;flex-direction:column;gap:4px;}',
    '.scm-notify-entry + .scm-notify-entry{margin-top:8px;}',
    '.scm-notify-entry__title{display:flex;align-items:center;flex-wrap:wrap;gap:4px;color:#000;font-size:15px;font-weight:500;line-height:20.4px;}',
    '.scm-notify-entry__arrow{color:#000;font-weight:400;}',
    '.scm-notify-entry__status{font-size:15px;font-weight:600;line-height:20.4px;}',
    '.scm-notify-entry__status--ok{color:#245EFF;}',
    '.scm-notify-entry__status--fail{color:#F31110;}',
    '.scm-notify-entry__ref{display:flex;align-items:center;gap:2px;min-height:24px;color:rgba(0,0,0,0.88);font-size:14px;font-weight:400;line-height:19.6px;}',
    '.scm-notify-entry__copy{width:16px;height:16px;padding:0;background:transparent;border:0;cursor:pointer;color:#000;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;}',
    '.scm-notify-entry__copy:hover{color:#245EFF;}',
    '.scm-notify-entry__copy svg{width:16px;height:16px;}',
    '.scm-notify-entry__reason{color:#8A8A8A;font-size:14px;font-weight:400;line-height:19.6px;}',
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var COPY_SVG =
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<rect x="5" y="5" width="8.5" height="8.5" rx="1.6" stroke="currentColor" stroke-width="1.1"/>' +
    '<path d="M3 10.5H2.6A1.6 1.6 0 0 1 1 8.9V2.6A1.6 1.6 0 0 1 2.6 1H8.9A1.6 1.6 0 0 1 10.5 2.6V3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  function entryHtml(e) {
    var ok = e.status === '성공';
    var statusCls = ok ? 'scm-notify-entry__status--ok' : 'scm-notify-entry__status--fail';
    var refHtml = e.ref
      ? ('<div class="scm-notify-entry__ref">' +
           '<span>' + escapeHtml(e.ref) + '</span>' +
           '<button type="button" class="scm-notify-entry__copy" data-copy="' + escapeHtml(e.ref) + '" aria-label="복사">' + COPY_SVG + '</button>' +
         '</div>')
      : '';
    var reasonHtml = e.reason
      ? ('<div class="scm-notify-entry__reason">' + escapeHtml(e.reason) + '</div>')
      : '';
    return (
      '<div class="scm-notify-entry">' +
        '<div class="scm-notify-entry__title">' +
          '<span>' + escapeHtml(e.title) + '</span>' +
          '<span class="scm-notify-entry__arrow">→</span>' +
          '<span class="scm-notify-entry__status ' + statusCls + '">' + escapeHtml(e.status) + '</span>' +
        '</div>' +
        refHtml +
        reasonHtml +
      '</div>'
    );
  }

  function rowHtml(row) {
    var activeCls = row.dot === 'active' ? ' scm-notify-row--active' : '';
    var unread = row.unread ? '<span class="scm-notify-row__unread" aria-hidden="true"></span>' : '';
    return (
      '<div class="scm-notify-row' + activeCls + '">' +
        '<div class="scm-notify-row__rail">' +
          '<span class="scm-notify-row__dot"></span>' +
          '<span class="scm-notify-row__line"></span>' +
        '</div>' +
        '<div class="scm-notify-row__content">' +
          '<div class="scm-notify-row__date"><span>' + escapeHtml(row.time) + '</span>' + unread + '</div>' +
          row.entries.map(entryHtml).join('') +
        '</div>' +
      '</div>'
    );
  }

  var popEl = null;

  function getItems() {
    var custom = root.SCM_NOTIFY_ITEMS;
    return (custom && custom.length) ? custom : DEFAULT_ITEMS;
  }

  function buildPop() {
    if (popEl) return popEl;
    injectStyle();
    popEl = document.createElement('div');
    popEl.className = 'scm-notify-pop';
    popEl.setAttribute('role', 'dialog');
    popEl.setAttribute('aria-label', '알림함');
    popEl.hidden = true;
    render();
    document.body.appendChild(popEl);
    return popEl;
  }

  function render() {
    if (!popEl) return;
    var items = getItems();
    var bodyHtml = items.length
      ? items.map(rowHtml).join('')
      : '<div class="scm-notify-pop__empty">새로운 알림이 없습니다.</div>';
    popEl.innerHTML =
      '<div class="scm-notify-pop__head">' +
        '<h2 class="scm-notify-pop__title">알림함</h2>' +
        '<button type="button" class="scm-notify-pop__clear" aria-label="알림 비우기">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<div class="scm-notify-pop__sub">최근 7일간의 알림만 확인 가능합니다.</div>' +
      '</div>' +
      '<div class="scm-notify-pop__body">' + bodyHtml + '</div>';
  }

  function getBellBtn() {
    return document.querySelector('.scm-topbar__notify-btn');
  }

  function position() {
    if (!popEl || popEl.hidden) return;
    var bell = getBellBtn();
    if (!bell) return;
    var r = bell.getBoundingClientRect();
    var top = r.bottom + POP_GAP;
    var width = Math.min(POP_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
    // 팝오버 우측 끝을 벨 우측보다 약간 오른쪽(프로필 영역 쪽)으로 맞춤
    var left = r.right - width + 20;
    if (left + width > window.innerWidth - VIEWPORT_MARGIN) {
      left = window.innerWidth - VIEWPORT_MARGIN - width;
    }
    if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
    popEl.style.top = top + 'px';
    popEl.style.left = left + 'px';
  }

  function isOpen() {
    return popEl && !popEl.hidden;
  }

  function open() {
    buildPop();
    render();
    popEl.hidden = false;
    position();
    var bell = getBellBtn();
    if (bell) bell.setAttribute('aria-expanded', 'true');
  }

  function close() {
    if (!popEl || popEl.hidden) return;
    popEl.hidden = true;
    var bell = getBellBtn();
    if (bell) bell.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    if (isOpen()) close(); else open();
  }

  function copyRef(text) {
    var done = function () {
      if (root.SCM && root.SCM.toast) {
        root.SCM.toast.show({ variant: 'info', title: '복사됨', desc: text });
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    }
  }

  // ── 이벤트 위임 ─────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var bellBtn = e.target.closest('.scm-topbar__notify-btn');
    if (bellBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
      return;
    }
    if (!isOpen()) return;
    // 팝오버 내부 클릭 처리
    var copyBtn = e.target.closest('.scm-notify-entry__copy');
    if (copyBtn && popEl.contains(copyBtn)) {
      copyRef(copyBtn.getAttribute('data-copy') || '');
      return;
    }
    var clearBtn = e.target.closest('.scm-notify-pop__clear');
    if (clearBtn && popEl.contains(clearBtn)) {
      root.SCM_NOTIFY_ITEMS = [];
      render();
      var badge = document.querySelector('.scm-topbar__notify-badge');
      if (badge) badge.hidden = true;
      return;
    }
    // 팝오버 바깥 클릭 → 닫기
    if (!popEl.contains(e.target)) close();
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) close();
  });
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);

  root.SCM = root.SCM || {};
  root.SCM.notifyBox = { open: open, close: close, toggle: toggle, render: render };
})(typeof window !== 'undefined' ? window : globalThis);
