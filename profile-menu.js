/* ============================================================
 * SCM HUB · Profile Menu
 * ------------------------------------------------------------
 * 데모 페이지 우측 상단 사용자 프로필 영역에:
 *   1) 실제 로그인 사용자 이름·아바타로 동적 업데이트
 *   2) 클릭 시 프로필 모달 열기 (계정정보 + 비밀번호 재설정 + 로그아웃)
 *
 * 의존: /auth-gate.js (window.SCM_USER + scm:auth-ready event)
 * 적용: <script src="/profile-menu.js" defer></script>
 * ============================================================ */
(function () {
  'use strict';

  var ROLE_LABEL_KO = {
    super: '최고 어드민',
    admin: '어드민',
    biz: '현업',
    pm: 'PM',
    dev: '개발팀',
    pd: 'PD',
  };

  var Z = 99999;

  function init(user) {
    if (!user) return;

    // 1) 토픽바 사용자 영역 동적 업데이트 ----------------------------
    var rightEl  = document.querySelector('.scm-topbar__right');
    var avatarEl = document.querySelector('.scm-topbar__avatar');
    var nameEl   = document.querySelector('.scm-topbar__name-first');
    if (!rightEl || !avatarEl || !nameEl) return;

    var displayName = (user.name || user.email || '사용자').trim();
    var firstChar   = displayName ? displayName.charAt(0) : '?';
    avatarEl.textContent = firstChar;
    nameEl.textContent   = displayName;

    // 클릭 시 프로필 dropdown 토글
    rightEl.style.cursor = 'pointer';
    rightEl.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (modalEl) closeModal();
      else openProfileModal(user, rightEl);
    });

    // 2) 모달 마크업 + 스타일 한 번만 inject ------------------------
    if (!document.getElementById('scm-profile-style')) {
      var s = document.createElement('style');
      s.id = 'scm-profile-style';
      s.textContent = STYLE_CSS;
      document.head.appendChild(s);
    }
  }

  // -------- dropdown popover API (no backdrop, anchored to profile) --------
  var modalEl = null;
  var anchorEl = null;
  function openProfileModal(user, anchor) {
    closeModal();
    anchorEl = anchor;
    var displayName = (user.name || user.email || '사용자').trim();
    var firstChar   = displayName ? displayName.charAt(0) : '?';
    var roleLabel   = ROLE_LABEL_KO[user.role] || user.role || '';
    var roleClass   = user.role ? ('scm-profile__role--' + user.role) : '';

    modalEl = document.createElement('div');
    modalEl.className = 'scm-profile-popover';
    modalEl.innerHTML =
      '<div class="scm-profile-card">' +
        '<span class="scm-profile-avatar">' + escapeHtml(firstChar) + '</span>' +
        '<div class="scm-profile-card__meta">' +
          '<div class="scm-profile-card__name">' + escapeHtml(displayName) +
            (roleLabel ? ' <span class="scm-profile__role ' + roleClass + '">' + escapeHtml(roleLabel) + '</span>' : '') +
          '</div>' +
          '<div class="scm-profile-card__email">' + escapeHtml(user.email || '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="scm-profile-actions">' +
        '<button type="button" class="scm-profile-btn" data-act="change-pw">' +
          '<svg viewBox="0 0 20 20" fill="none"><path d="M10 11.5v3M6.5 8V6a3.5 3.5 0 0 1 7 0v2M5 8h10v8H5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>' +
          '<span>비밀번호 재설정</span>' +
        '</button>' +
        '<button type="button" class="scm-profile-btn scm-profile-btn--danger" data-act="logout">' +
          '<svg viewBox="0 0 20 20" fill="none"><path d="M11 14v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2M9 10h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span>로그아웃</span>' +
        '</button>' +
      '</div>';
    document.body.appendChild(modalEl);
    positionPopover();
    if (anchor) anchor.classList.add('is-open');

    modalEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      if (act === 'change-pw') openPasswordModal();
      else if (act === 'logout') doLogout();
    });
    setTimeout(function () {
      document.addEventListener('click', onOutsideClick, true);
    }, 0);
    document.addEventListener('keydown', onEsc);
    window.addEventListener('resize', positionPopover);
    window.addEventListener('scroll', positionPopover, true);
  }
  function positionPopover() {
    if (!modalEl || !anchorEl) return;
    var r = anchorEl.getBoundingClientRect();
    var w = modalEl.offsetWidth || 320;
    var top  = r.bottom + 6;
    var left = Math.max(8, r.right - w);   // 오른쪽 정렬 (anchor 의 우측 가장자리 기준)
    if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
    modalEl.style.top  = top  + 'px';
    modalEl.style.left = left + 'px';
  }
  function onOutsideClick(e) {
    if (!modalEl) return;
    if (modalEl.contains(e.target)) return;
    if (anchorEl && anchorEl.contains(e.target)) return;
    closeModal();
  }
  function closeModal() {
    if (modalEl) { modalEl.remove(); modalEl = null; }
    if (anchorEl) { anchorEl.classList.remove('is-open'); anchorEl = null; }
    document.removeEventListener('click', onOutsideClick, true);
    document.removeEventListener('keydown', onEsc);
    window.removeEventListener('resize', positionPopover);
    window.removeEventListener('scroll', positionPopover, true);
    closePasswordModal();
  }
  function onEsc(e) { if (e.key === 'Escape') closeModal(); }

  function doLogout() {
    if (window.SCM && typeof window.SCM.logout === 'function') {
      window.SCM.logout();
    } else {
      // fallback
      fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
        .catch(function () {})
        .then(function () { location.replace('/login.html'); });
    }
  }

  // -------- password modal --------
  var pwModal = null;
  function openPasswordModal() {
    closePasswordModal();
    pwModal = document.createElement('div');
    pwModal.className = 'scm-profile-backdrop scm-profile-backdrop--pw';
    pwModal.innerHTML =
      '<div class="scm-profile-modal" role="dialog" aria-label="비밀번호 변경">' +
        '<header class="scm-profile-modal__head">' +
          '<strong>비밀번호 재설정</strong>' +
          '<button type="button" class="scm-profile-modal__close" aria-label="닫기">×</button>' +
        '</header>' +
        '<div class="scm-profile-modal__body">' +
          '<p class="scm-profile-pw__hint">변경하면 다른 기기/세션은 자동 로그아웃되고, 현재 세션만 유지됩니다.</p>' +
          '<form class="scm-profile-pw__form" autocomplete="off">' +
            '<label class="scm-profile-pw__field">' +
              '<span>현재 비밀번호</span>' +
              '<input type="password" name="cur" required autocomplete="current-password" />' +
            '</label>' +
            '<label class="scm-profile-pw__field">' +
              '<span>새 비밀번호</span>' +
              '<input type="password" name="new1" required minlength="8" placeholder="8자 이상" autocomplete="new-password" />' +
            '</label>' +
            '<label class="scm-profile-pw__field">' +
              '<span>새 비밀번호 확인</span>' +
              '<input type="password" name="new2" required minlength="8" autocomplete="new-password" />' +
            '</label>' +
            '<div class="scm-profile-pw__msg" data-msg></div>' +
            '<div class="scm-profile-pw__foot">' +
              '<button type="button" class="scm-profile-pw__cancel">취소</button>' +
              '<button type="submit" class="scm-profile-pw__submit">변경</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';
    document.body.appendChild(pwModal);

    var form  = pwModal.querySelector('form');
    var msgEl = pwModal.querySelector('[data-msg]');
    var subBtn = pwModal.querySelector('.scm-profile-pw__submit');

    pwModal.addEventListener('click', function (e) {
      if (e.target === pwModal) return closePasswordModal();
      if (e.target.closest('.scm-profile-modal__close')) return closePasswordModal();
      if (e.target.closest('.scm-profile-pw__cancel')) return closePasswordModal();
    });
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      msgEl.className = 'scm-profile-pw__msg';
      msgEl.textContent = '';
      var data = new FormData(form);
      var cur  = data.get('cur');
      var n1   = data.get('new1');
      var n2   = data.get('new2');
      if (n1.length < 8)  return showMsg(msgEl, 'err', '새 비밀번호는 8자 이상이어야 합니다.');
      if (n1 !== n2)      return showMsg(msgEl, 'err', '새 비밀번호가 일치하지 않습니다.');
      if (cur === n1)     return showMsg(msgEl, 'err', '현재 비밀번호와 다른 새 비밀번호를 입력하세요.');

      subBtn.disabled = true;
      subBtn.textContent = '변경 중…';
      try {
        var res = await fetch('/api/auth/change-password', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ currentPassword: cur, newPassword: n1 }),
        });
        var d = {};
        try { d = await res.json(); } catch (_) {}
        if (res.ok) {
          showMsg(msgEl, 'ok', '비밀번호가 변경되었습니다.');
          form.reset();
          subBtn.disabled = false;
          subBtn.textContent = '변경';
          setTimeout(closePasswordModal, 1200);
        } else {
          var em = d && d.error;
          var hint =
            em === 'invalid_current'    ? '현재 비밀번호가 올바르지 않습니다.' :
            em === 'password_too_short' ? '새 비밀번호는 8자 이상이어야 합니다.' :
            em === 'same_password'      ? '현재 비밀번호와 다른 새 비밀번호를 입력하세요.' :
            em === 'unauthorized'       ? '로그인 세션이 만료되었습니다.' :
                                          '변경 실패: ' + (em || res.status);
          showMsg(msgEl, 'err', hint);
          subBtn.disabled = false;
          subBtn.textContent = '변경';
        }
      } catch (err) {
        showMsg(msgEl, 'err', '네트워크 오류 — 잠시 후 다시 시도하세요.');
        subBtn.disabled = false;
        subBtn.textContent = '변경';
      }
    });
    setTimeout(function () { var f = pwModal.querySelector('input[name="cur"]'); if (f) f.focus(); }, 50);
  }
  function closePasswordModal() {
    if (pwModal) { pwModal.remove(); pwModal = null; }
  }
  function showMsg(el, kind, text) {
    el.className = 'scm-profile-pw__msg scm-profile-pw__msg--' + kind;
    el.textContent = text;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  // -------- styles --------
  var STYLE_CSS = '\n' +
    /* popover (드롭다운 — 딤드 없음, 토픽바 우측 프로필 아래 위치) */
    '.scm-profile-popover {\n' +
    '  position: fixed; z-index: ' + Z + ';\n' +
    '  width: 320px; max-width: calc(100vw - 16px);\n' +
    '  background: #fff; color: #1A1A1A;\n' +
    '  border: 1px solid #E5E7EB; border-radius: 12px;\n' +
    '  box-shadow: 0 12px 28px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);\n' +
    '  padding: 14px;\n' +
    '  font-family: Pretendard, notokr, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n' +
    '}\n' +
    /* anchor (.scm-topbar__right) 의 chevron 회전 (open 시) */
    '.scm-topbar__right.is-open .scm-topbar__chev svg { transform: rotate(180deg); transition: transform 0.15s ease; }\n' +
    '.scm-topbar__chev svg { transition: transform 0.15s ease; }\n' +
    /* 비밀번호 변경 모달 (서브 모달 — 중앙 + dim 그대로) */
    '.scm-profile-backdrop {\n' +
    '  position: fixed; inset: 0; z-index: ' + (Z + 1) + ';\n' +
    '  background: rgba(15, 17, 22, 0.5); backdrop-filter: blur(2px);\n' +
    '  display: flex; align-items: center; justify-content: center;\n' +
    '}\n' +
    '.scm-profile-backdrop--pw { z-index: ' + (Z + 1) + '; }\n' +
    '.scm-profile-modal {\n' +
    '  background: #fff; color: #1A1A1A;\n' +
    '  width: 420px; max-width: calc(100vw - 32px);\n' +
    '  border-radius: 12px; box-shadow: 0 24px 48px rgba(0,0,0,0.32);\n' +
    '  overflow: hidden;\n' +
    '  font-family: Pretendard, notokr, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n' +
    '}\n' +
    '.scm-profile-modal__head {\n' +
    '  position: relative;\n' +
    '  display: flex; align-items: center; justify-content: center;\n' +
    '  padding: 18px 56px; border-bottom: 1px solid #F0F0F0;\n' +
    '}\n' +
    '.scm-profile-modal__head strong { font-size: 15px; font-weight: 700; }\n' +
    '.scm-profile-modal__close {\n' +
    '  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);\n' +
    '  background: transparent; border: 0; cursor: pointer;\n' +
    '  font-size: 22px; line-height: 1; color: #9CA3AF;\n' +
    '  width: 28px; height: 28px; border-radius: 6px;\n' +
    '  display: inline-flex; align-items: center; justify-content: center;\n' +
    '}\n' +
    '.scm-profile-modal__close:hover { background: #F3F4F6; color: #1A1A1A; }\n' +
    '.scm-profile-modal__body { padding: 20px; }\n' +
    /* card (popover + modal 공용) */
    '.scm-profile-card {\n' +
    '  display: flex; align-items: center; gap: 12px;\n' +
    '  padding: 10px 12px; background: #F8F9FB;\n' +
    '  border: 1px solid #E5E7EB; border-radius: 10px;\n' +
    '  margin-bottom: 10px;\n' +
    '}\n' +
    '.scm-profile-avatar {\n' +
    '  width: 40px; height: 40px; flex-shrink: 0;\n' +
    '  border-radius: 50%; background: #1F1F26; color: #fff;\n' +
    '  display: inline-flex; align-items: center; justify-content: center;\n' +
    '  font-size: 16px; font-weight: 600;\n' +
    '}\n' +
    '.scm-profile-card__meta { flex: 1; min-width: 0; }\n' +
    '.scm-profile-card__name { font-size: 14px; font-weight: 700; color: #1A1A1A; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }\n' +
    '.scm-profile-card__email { font-size: 12.5px; color: #6B7280; margin-top: 2px; word-break: break-all; }\n' +
    '.scm-profile__role {\n' +
    '  display: inline-flex; align-items: center; height: 18px; padding: 0 7px;\n' +
    '  border-radius: 4px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px;\n' +
    '  background: #F3F4F6; color: #4B5563;\n' +
    '}\n' +
    '.scm-profile__role--super { background: #FEF3C7; color: #B45309; }\n' +
    '.scm-profile__role--admin { background: rgba(110,107,255,0.14); color: #4F46E5; }\n' +
    '.scm-profile__role--biz   { background: #D1FAE5; color: #047857; }\n' +
    /* actions — 한 줄 (가로) */
    '.scm-profile-actions { display: flex; flex-direction: row; gap: 6px; }\n' +
    '.scm-profile-btn {\n' +
    '  display: flex; align-items: center; justify-content: center; gap: 6px;\n' +
    '  flex: 1; min-width: 0; padding: 10px 12px;\n' +
    '  background: #fff; color: #1A1A1A; border: 1px solid #E5E7EB; border-radius: 8px;\n' +
    '  font-family: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer;\n' +
    '  white-space: nowrap;\n' +
    '  transition: background 0.12s, border-color 0.12s;\n' +
    '}\n' +
    '.scm-profile-btn:hover { background: #F8F9FB; border-color: #D1D5DB; }\n' +
    '.scm-profile-btn svg { width: 16px; height: 16px; flex-shrink: 0; color: #6B7280; }\n' +
    '.scm-profile-btn--danger { color: #DC2626; }\n' +
    '.scm-profile-btn--danger:hover { background: #FEF2F2; border-color: #FCA5A5; }\n' +
    '.scm-profile-btn--danger svg { color: #DC2626; }\n' +
    /* password modal form */
    '.scm-profile-pw__hint { font-size: 12.5px; color: #6B7280; line-height: 1.6; margin: 0 0 16px; }\n' +
    '.scm-profile-pw__form { display: flex; flex-direction: column; gap: 12px; }\n' +
    '.scm-profile-pw__field { display: flex; flex-direction: column; gap: 6px; }\n' +
    '.scm-profile-pw__field span { font-size: 12px; color: #4B5563; font-weight: 600; }\n' +
    '.scm-profile-pw__field input {\n' +
    '  height: 40px; padding: 0 12px;\n' +
    '  background: #fff; color: #1A1A1A;\n' +
    '  border: 1px solid #E5E7EB; border-radius: 6px;\n' +
    '  font-family: inherit; font-size: 13.5px;\n' +
    '}\n' +
    '.scm-profile-pw__field input:focus { outline: none; border-color: #4F46E5; }\n' +
    '.scm-profile-pw__msg { display: none; padding: 10px 12px; border-radius: 6px; font-size: 12.5px; line-height: 1.5; }\n' +
    '.scm-profile-pw__msg--err { display: block; background: #FEF2F2; color: #DC2626; border: 1px solid #FEE2E2; }\n' +
    '.scm-profile-pw__msg--ok  { display: block; background: #ECFDF5; color: #16A34A; border: 1px solid #D1FAE5; }\n' +
    '.scm-profile-pw__foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }\n' +
    '.scm-profile-pw__cancel,\n' +
    '.scm-profile-pw__submit {\n' +
    '  height: 36px; padding: 0 16px;\n' +
    '  border-radius: 6px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer;\n' +
    '}\n' +
    '.scm-profile-pw__cancel { background: #fff; color: #6B7280; border: 1px solid #E5E7EB; }\n' +
    '.scm-profile-pw__cancel:hover { background: #F8F9FB; color: #1A1A1A; }\n' +
    '.scm-profile-pw__submit { background: #1F1F26; color: #fff; border: 0; }\n' +
    '.scm-profile-pw__submit:hover:not(:disabled) { background: #000; }\n' +
    '.scm-profile-pw__submit:disabled { opacity: 0.5; cursor: not-allowed; }\n' +
    '';

  // -------- bootstrap --------
  if (window.SCM_USER) {
    init(window.SCM_USER);
  } else {
    document.addEventListener('scm:auth-ready', function (e) {
      if (e.detail && e.detail.user) init(e.detail.user);
    }, { once: true });
  }
})();
