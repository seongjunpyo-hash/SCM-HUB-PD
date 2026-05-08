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
  var ICONS = {
    success: 'ic-checkCircle-filled',
    info:    'ic-checkCircle-filled',
    critical: 'ic-alertTriangle',
  };

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
    var iconRef = options.iconRef || ICONS[variant] || ICONS.info;

    var s = ensureStack();
    var el = document.createElement('div');
    el.className = 'scm-toast scm-toast--' + variant;

    el.innerHTML =
      '<div class="scm-toast__main">' +
        '<svg class="scm-toast__icon" aria-hidden="true"><use href="#' + iconRef + '"/></svg>' +
        '<div class="scm-toast__body">' +
          '<div class="scm-toast__title"></div>' +
          (desc ? '<div class="scm-toast__desc"></div>' : '') +
        '</div>' +
      '</div>' +
      '<button class="scm-toast__close" aria-label="닫기">' +
        '<svg aria-hidden="true"><use href="#ic-close"/></svg>' +
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
