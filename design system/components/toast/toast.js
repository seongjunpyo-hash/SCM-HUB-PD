/* ============================================================
 * scm-toast — vanilla factory
 * ------------------------------------------------------------
 * 글로벌 호출:
 *   SCM.toast.show({ variant: 'success', title: '...', desc: '...' });
 *
 * stack 컨테이너는 자동으로 body 끝에 1개 생성 ('scm-toast-stack').
 * 명시적으로 다른 위치를 쓰려면:
 *   SCM.toast.setContainer(myStackEl);
 * ============================================================ */

(function (root) {
  var stack = null;
  // Inline SVG path data — self-contained (외부 sprite 의존 X). 이전엔 <use href="#ic-..."> 로
  //   scm-icons.js sprite 참조했는데, sprite 미로드 시 아이콘 깨짐(빈 사각형) 회귀가 있어
  //   변종별 path 를 컴포넌트 안에 박음.
  // viewBox 는 toast.css 의 ::after radial-gradient (cutout 흰 원) 위치 기준 (0 0 20 20).
  var ICON_SVG = {
    // checkCircle-filled (success / info 공통 — color 만 .scm-toast--{variant} 룰로 분기)
    success:
      '<svg class="scm-toast__icon" viewBox="0 0 20 20" aria-hidden="true">' +
        '<path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM13.7071 8.20711L9.41421 12.5L6.29289 9.37868L7.70711 7.96447L9.41421 9.67157L12.2929 6.79289L13.7071 8.20711Z" fill="currentColor"/>' +
      '</svg>',
    info:
      '<svg class="scm-toast__icon" viewBox="0 0 20 20" aria-hidden="true">' +
        '<path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM13.7071 8.20711L9.41421 12.5L6.29289 9.37868L7.70711 7.96447L9.41421 9.67157L12.2929 6.79289L13.7071 8.20711Z" fill="currentColor"/>' +
      '</svg>',
    // alertTriangle — 경고 (critical)
    critical:
      '<svg class="scm-toast__icon" viewBox="0 0 20 20" aria-hidden="true">' +
        '<path d="M10 14.75V12.88M10 11.95V7.28M2.31 16.5H17.69C17.93 16.5 18.07 16.24 17.95 16.04L10.26 3.42C10.14 3.23 9.86 3.23 9.74 3.42L2.05 16.04C1.93 16.24 2.07 16.5 2.31 16.5Z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',
  };
  // 닫기 X — 작은 12x12 사이즈 (toast.css 룰)
  var CLOSE_SVG =
    '<svg viewBox="0 0 20 20" aria-hidden="true">' +
      '<path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    '</svg>';

  function ensureStack() {
    if (stack && document.body.contains(stack)) return stack;
    stack = document.createElement('div');
    stack.className = 'scm-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
    return stack;
  }

  function setContainer(el) {
    stack = el;
  }

  function show(opts) {
    var options = opts || {};
    var variant = options.variant || 'info';
    var title = options.title || '';
    var desc = options.desc || '';
    var duration = options.duration != null ? options.duration : 3000;
    var iconHtml = ICON_SVG[variant] || ICON_SVG.info;

    var s = ensureStack();
    var el = document.createElement('div');
    el.className = 'scm-toast scm-toast--' + variant;

    el.innerHTML =
      '<div class="scm-toast__main">' +
        iconHtml +
        '<div class="scm-toast__body">' +
          '<div class="scm-toast__title"></div>' +
          (desc ? '<div class="scm-toast__desc"></div>' : '') +
        '</div>' +
      '</div>' +
      '<button class="scm-toast__close" aria-label="닫기">' +
        CLOSE_SVG +
      '</button>';

    el.querySelector('.scm-toast__title').textContent = title;
    if (desc) el.querySelector('.scm-toast__desc').textContent = desc;

    var closed = false;
    function remove() {
      if (closed) return;
      closed = true;
      el.classList.add('is-leaving');
      setTimeout(function () { if (el.parentNode) el.remove(); }, 220);
    }

    el.querySelector('.scm-toast__close').addEventListener('click', remove);
    s.appendChild(el);

    if (duration > 0) {
      setTimeout(remove, duration);
    }

    return { el: el, dismiss: remove };
  }

  function clear() {
    if (!stack) return;
    Array.from(stack.children).forEach(function (c) { c.remove(); });
  }

  root.SCM = root.SCM || {};
  root.SCM.toast = {
    show: show,
    setContainer: setContainer,
    clear: clear,
  };
})(typeof window !== 'undefined' ? window : globalThis);
