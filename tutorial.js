/* ============================================================
 * SCM HUB · 신규 사용자 튜토리얼
 * ------------------------------------------------------------
 * 첫 로그인 사용자에게만 데모 페이지 진입 시 노출되는 onboarding
 * 코치마크. 영속:
 *   localStorage scm:tutorial:seen:<userId>:v1
 *
 * auth-gate.js 가 demo 경로에서 동적으로 로드. tutorial.js 자체에서도
 * 한 번 더 조건 검사 — 다른 경로/이미 본 사용자에서 실행 X.
 * ============================================================ */
(function () {
  if (window.__scmTutorialBooted) return;
  window.__scmTutorialBooted = true;

  var STEPS = [
    {
      target: '.scm-voc-fab',
      title: '코멘트 기능',
      desc: '우측 하단 코멘트 FAB 을 누르면 페이지의 어떤 컴포넌트든 클릭해 코멘트를 남길 수 있어요. 등록된 코멘트는 핀으로 같은 위치에 떠 있습니다.',
      placement: 'left',
    },
    {
      target: '.scm-dev-export-btn',
      title: 'Handoff 파일 다운로드',
      desc: '최종확정된 페이지의 변경 사항을 개발자 핸드오프 파일로 받을 수 있습니다. (super / admin 권한에서만 활성)',
      placement: 'bottom',
    },
    {
      target: '.scm-dev-version-wrap',
      title: '버전 선택',
      desc: '저장된 작업 버전을 드롭다운으로 미리보기 할 수 있어요. \'최종확정\' 버튼으로 베이스라인 버전을 지정합니다.',
      placement: 'bottom',
    },
    {
      target: '.scm-lnb',
      title: '메뉴별로 이동',
      desc: '좌측 메뉴에서 모든 데모 페이지로 이동할 수 있어요. 메뉴에 \'작업중\' / \'최종확정\' 태그로 진행 상태가 표시됩니다.',
      placement: 'right',
    },
    {
      target: 'main, .scm-page, .scm-app-content',
      title: '전체 기능 동작',
      desc: '데모는 실제 화면 동작을 그대로 시연합니다. 정렬 / 필터 / 입력 / 체크박스 / 모달 등 모든 인터랙션을 자유롭게 시도해보세요.',
      placement: 'center',
    },
  ];

  function getUser() { return window.SCM_USER || null; }

  function seenKey() {
    var u = getUser();
    return u && u.id ? 'scm:tutorial:seen:' + u.id + ':v1' : null;
  }

  function shouldShow() {
    var u = getUser();
    if (!u || !u.id) return false;
    if (location.pathname.indexOf('/demo/') !== 0) return false;
    try { if (localStorage.getItem(seenKey())) return false; } catch (_) {}
    return true;
  }

  function markSeen() {
    var k = seenKey();
    if (!k) return;
    try { localStorage.setItem(k, '1'); } catch (_) {}
  }

  function injectStyles() {
    if (document.getElementById('scm-tutorial-styles')) return;
    var st = document.createElement('style');
    st.id = 'scm-tutorial-styles';
    st.textContent = [
      '.scm-tut-backdrop { position: fixed; inset: 0; z-index: 99998; background: rgba(0,0,0,0.5); }',
      '.scm-tut-highlight {',
      '  position: fixed; z-index: 99999;',
      '  border-radius: 8px;',
      '  box-shadow: 0 0 0 4px rgba(110, 107, 255, 0.55), 0 0 0 9999px rgba(0, 0, 0, 0.55);',
      '  pointer-events: none;',
      '  transition: top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease;',
      '}',
      '.scm-tut-tip {',
      '  position: fixed; z-index: 100000;',
      '  width: 360px; max-width: calc(100vw - 32px);',
      '  background: #fff; color: #111;',
      '  border-radius: 12px;',
      '  padding: 22px 24px;',
      '  box-shadow: 0 24px 48px rgba(0,0,0,0.30), 0 4px 12px rgba(0,0,0,0.15);',
      '  font-family: inherit;',
      '}',
      '.scm-tut-tip__step { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #6E6BFF; text-transform: uppercase; margin-bottom: 8px; }',
      '.scm-tut-tip__title { font-size: 18px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.2px; }',
      '.scm-tut-tip__desc  { font-size: 14px; line-height: 1.55; color: #444; margin: 0 0 18px; }',
      '.scm-tut-tip__nav   { display: flex; align-items: center; justify-content: space-between; gap: 8px; }',
      '.scm-tut-tip__nav-right { display: flex; gap: 8px; }',
      '.scm-tut-btn {',
      '  height: 36px; padding: 0 14px;',
      '  border-radius: 6px; border: 1px solid #E0E0E0;',
      '  background: #fff; color: #111;',
      '  font-family: inherit; font-size: 13px; font-weight: 500;',
      '  cursor: pointer; line-height: 1;',
      '}',
      '.scm-tut-btn:hover { background: #F8F8F8; }',
      '.scm-tut-btn--primary { background: #6E6BFF; color: #fff; border-color: #6E6BFF; }',
      '.scm-tut-btn--primary:hover { background: #5856E0; border-color: #5856E0; }',
      '.scm-tut-btn--ghost { border-color: transparent; color: #888; }',
      '.scm-tut-btn--ghost:hover { background: #F8F8F8; color: #111; }',
    ].join('\n');
    document.head.appendChild(st);
  }

  function findTarget(selector) {
    var sels = selector.split(',').map(function (s) { return s.trim(); });
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el) {
        var r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return el;
      }
    }
    return null;
  }

  function placeTip(tip, rect, placement) {
    var pad = 16;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var top, left;
    if (placement === 'center' || !rect) {
      top = (window.innerHeight - h) / 2;
      left = (window.innerWidth - w) / 2;
    } else if (placement === 'bottom') {
      top = rect.bottom + pad;
      left = rect.left + rect.width / 2 - w / 2;
    } else if (placement === 'top') {
      top = rect.top - h - pad;
      left = rect.left + rect.width / 2 - w / 2;
    } else if (placement === 'left') {
      top = rect.top + rect.height / 2 - h / 2;
      left = rect.left - w - pad;
    } else if (placement === 'right') {
      top = rect.top + rect.height / 2 - h / 2;
      left = rect.right + pad;
    }
    top = Math.max(16, Math.min(window.innerHeight - h - 16, top));
    left = Math.max(16, Math.min(window.innerWidth - w - 16, left));
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }

  function start() {
    injectStyles();

    var backdrop = document.createElement('div');
    backdrop.className = 'scm-tut-backdrop';
    var highlight = document.createElement('div');
    highlight.className = 'scm-tut-highlight';
    highlight.style.display = 'none';
    var tip = document.createElement('div');
    tip.className = 'scm-tut-tip';

    document.body.appendChild(backdrop);
    document.body.appendChild(highlight);
    document.body.appendChild(tip);

    var idx = 0;

    function done(persist) {
      try { backdrop.remove(); highlight.remove(); tip.remove(); } catch (_) {}
      window.removeEventListener('resize', render);
      if (persist) markSeen();
    }

    function render() {
      // 대상 못 찾으면 (페이지에 없는 컴포넌트) 자동으로 다음 스텝으로
      while (idx < STEPS.length) {
        var s = STEPS[idx];
        if (s.placement === 'center') break;
        if (findTarget(s.target)) break;
        idx++;
      }
      if (idx >= STEPS.length) { done(true); return; }

      var step = STEPS[idx];
      var target = step.placement === 'center' ? null : findTarget(step.target);
      var rect = target ? target.getBoundingClientRect() : null;

      if (rect) {
        var pad = 6;
        highlight.style.display = 'block';
        highlight.style.top = (rect.top - pad) + 'px';
        highlight.style.left = (rect.left - pad) + 'px';
        highlight.style.width = (rect.width + pad * 2) + 'px';
        highlight.style.height = (rect.height + pad * 2) + 'px';
        backdrop.style.display = 'none'; // highlight 의 box-shadow 가 dim 처리
      } else {
        highlight.style.display = 'none';
        backdrop.style.display = 'block';
      }

      var prevBtn = idx > 0 ? '<button class="scm-tut-btn" data-tut-prev>이전</button>' : '';
      var nextLabel = idx === STEPS.length - 1 ? '시작하기' : '다음';
      tip.innerHTML =
        '<div class="scm-tut-tip__step">' + (idx + 1) + ' / ' + STEPS.length + '</div>' +
        '<h3 class="scm-tut-tip__title">' + step.title + '</h3>' +
        '<p class="scm-tut-tip__desc">' + step.desc + '</p>' +
        '<div class="scm-tut-tip__nav">' +
        '  <button class="scm-tut-btn scm-tut-btn--ghost" data-tut-skip>건너뛰기</button>' +
        '  <div class="scm-tut-tip__nav-right">' +
        '    ' + prevBtn +
        '    <button class="scm-tut-btn scm-tut-btn--primary" data-tut-next>' + nextLabel + '</button>' +
        '  </div>' +
        '</div>';
      placeTip(tip, rect, step.placement);

      tip.querySelector('[data-tut-skip]').onclick = function () { done(true); };
      tip.querySelector('[data-tut-next]').onclick = function () {
        if (idx === STEPS.length - 1) { done(true); }
        else { idx++; render(); }
      };
      var pb = tip.querySelector('[data-tut-prev]');
      if (pb) pb.onclick = function () { idx--; render(); };
    }

    render();
    window.addEventListener('resize', render);
  }

  function boot() {
    if (!shouldShow()) return;
    // FAB / version button 등이 마운트될 시간 확보
    setTimeout(start, 800);
  }

  if (window.SCM_USER) boot();
  else document.addEventListener('scm:auth-ready', boot, { once: true });
})();
