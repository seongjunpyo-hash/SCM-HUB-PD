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
  // ===== Canonical LNB markup =====
  // 모든 데모 페이지의 LNB 마크업이 동일해야 하므로 단일 source 로 여기 박음.
  // 페이지는 빈 <nav class="scm-lnb" data-active="..." aria-label="주메뉴"></nav>
  // 만 두면 mount() 가 자동으로 inject. (수정 시 이 변수 한 곳만 갱신.)
  var CANONICAL_LNB_HTML = `
  <!-- 대시보드 (L1만, sub 없음) -->
  <div class="scm-lnb-item" data-key="dashboard">
    <a class="scm-lnb-row" href="dashboard.html">
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.6" y="3.6" width="7.2" height="7.2" rx="1" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <rect x="13.2" y="3.6" width="7.2" height="4.8" rx="1" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <rect x="3.6" y="13.2" width="7.2" height="7.2" rx="1" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <rect x="13.2" y="10.8" width="7.2" height="9.6" rx="1" stroke="currentColor" stroke-width="1.4" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">대시보드</span>
    </a>
  </div>

  <!-- 스토어 -->
  <div class="scm-lnb-item is-open" data-key="store">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.5 13.0864V19.5C4.5 19.6989 4.57902 19.8897 4.71967 20.0303C4.86032 20.171 5.05109 20.25 5.25 20.25H18.75C18.9489 20.25 19.1397 20.171 19.2803 20.0303C19.421 19.8897 19.5 19.6989 19.5 19.5V13.0865M5.06573 3.75H18.9343C19.0973 3.75 19.2558 3.80309 19.3859 3.90124C19.516 3.99939 19.6106 4.13725 19.6554 4.29396L21 9H3L4.34458 4.29396C4.38936 4.13725 4.48396 3.99939 4.61408 3.90124C4.7442 3.80309 4.90274 3.75 5.06573 3.75ZM9 9V10.5C9 11.2956 8.68393 12.0587 8.12132 12.6213C7.55871 13.1839 6.79565 13.5 6 13.5C5.20435 13.5 4.44129 13.1839 3.87868 12.6213C3.31607 12.0587 3 11.2956 3 10.5V9M15 9V10.5C15 11.2956 14.6839 12.0587 14.1213 12.6213C13.5587 13.1839 12.7956 13.5 12 13.5C11.2044 13.5 10.4413 13.1839 9.87868 12.6213C9.31607 12.0587 9 11.2956 9 10.5V9M21 9V10.5C21 11.2956 20.6839 12.0587 20.1213 12.6213C19.5587 13.1839 18.7956 13.5 18 13.5C17.2044 13.5 16.4413 13.1839 15.8787 12.6213C15.3161 12.0587 15 11.2956 15 10.5V9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">스토어</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">무탠 재고 보충 현황</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">무탠 재고 보충 요청</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="index.html" data-key="index"><span class="scm-lnb-l2-text">무탠 전개상품 관리</span></a>
      <a class="scm-lnb-l2" href="editshop-restock-status.html" data-key="editshop-status"><span class="scm-lnb-l2-text">편집샵 재고 보충 현황</span></a>
      <a class="scm-lnb-l2" href="editshop-restock-request.html" data-key="editshop-request"><span class="scm-lnb-l2-text">편집샵 재고 보충 요청</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">편집샵 전개상품 관리</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
    </div>
  </div>

  <!-- 상품 관리 -->
  <div class="scm-lnb-item is-open" data-key="hanger">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6.5V7.1C9 8.75685 10.3431 10.1 12 10.1C13.6569 10.1 15 8.75685 15 7.1V6.5M9 6.5H8.51537C8.44034 6.5 8.36718 6.52344 8.30613 6.56706L4.27987 9.44295C4.22758 9.4803 4.18624 9.53097 4.16014 9.58969L1.94818 14.5666C1.86666 14.75 1.95087 14.9647 2.13534 15.0437L6 16.7M9 6.5H15M15 6.5H15.4846C15.5597 6.5 15.6328 6.52344 15.6939 6.56706L19.7201 9.44295C19.7724 9.4803 19.8138 9.53097 19.8399 9.58969L22.0518 14.5666C22.1333 14.75 22.0491 14.9647 21.8647 15.0437L18 16.7M18 12.8V16.7M18 16.7V21.74C18 21.9388 17.8388 22.1 17.64 22.1H6.36C6.16118 22.1 6 21.9388 6 21.74V16.7M6 16.7V12.8M10.4 3.18C10.4 2.25216 11.1522 1.5 12.08 1.5C13.0079 1.5 13.76 2.25216 13.76 3.18C13.76 4.10784 13.0079 4.86 12.08 4.86V6.5" stroke="currentColor" stroke-width="1.4" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">상품 관리</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="sku-management.html" data-key="sku-management"><span class="scm-lnb-l2-text">SKU 관리</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">위탁 상품 미매핑 관리</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
    </div>
  </div>

  <!-- 발주/입고 관리 -->
  <div class="scm-lnb-item is-open" data-key="order">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="5" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <rect x="9" y="3" width="6" height="3" rx="1" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <path d="M9 13l2.2 2.2L15 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">발주/입고 관리</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">위탁 상품 입고 승인</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">위탁 상품 입고 현황</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">PB 상품 입고 검토</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">PB 상품 ASN 등록/확정</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="otb-budget.html" data-key="otb-budget"><span class="scm-lnb-l2-text">OTB 예산 관리</span></a>
    </div>
  </div>

  <!-- 재고 관리 -->
  <div class="scm-lnb-item is-open" data-key="stock">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.4 7.4769L17.2661 3.71622C17.2047 3.64256 17.1138 3.59998 17.0179 3.59998H12M20.4 7.4769V20.0769C20.4 20.2553 20.2553 20.4 20.0769 20.4H3.92305C3.74462 20.4 3.59998 20.2553 3.59998 20.0769V7.4769M20.4 7.4769H12M3.59998 7.4769L6.73387 3.71622C6.79525 3.64256 6.88618 3.59998 6.98207 3.59998H12M3.59998 7.4769H12M12 3.59998V7.4769" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">재고 관리</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">재고내역 조회</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">재고이동</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">불량/정상 전환</span><span class="scm-lnb-tag scm-lnb-tag--wip">작업중</span></a>
    </div>
  </div>

  <!-- 운영 설정 -->
  <div class="scm-lnb-item is-open" data-key="control">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.39998 5.99998V12M8.39998 12C7.40586 12 6.59998 12.8059 6.59998 13.8C6.59998 14.7941 7.40586 15.6 8.39998 15.6M8.39998 12C9.39409 12 10.2 12.8059 10.2 13.8C10.2 14.7941 9.39409 15.6 8.39998 15.6M8.39998 15.6V18M15.6 12V18M15.6 12C16.5941 12 17.4 11.1941 17.4 10.2C17.4 9.20586 16.5941 8.39998 15.6 8.39998M15.6 12C14.6059 12 13.8 11.1941 13.8 10.2C13.8 9.20586 14.6059 8.39998 15.6 8.39998M15.6 5.99998V8.39998M3.89998 20.4H20.1C20.2657 20.4 20.4 20.2657 20.4 20.1V3.89998C20.4 3.73429 20.2657 3.59998 20.1 3.59998H3.89998C3.73429 3.59998 3.59998 3.73429 3.59998 3.89998V20.1C3.59998 20.2657 3.73429 20.4 3.89998 20.4Z" stroke="currentColor" stroke-width="1.4" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">운영 설정</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">수기 재고 조정</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">운영 정책 설정</span></a>
    </div>
  </div>

  <!-- 관리자 -->
  <div class="scm-lnb-item is-open" data-key="setting">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.7206 3.59998H13.2795C13.3327 3.59998 13.3796 3.63508 13.3946 3.68619L14.0781 6.01563C14.0888 6.05203 14.1161 6.08117 14.1516 6.09468C14.8012 6.34221 15.3991 6.6986 15.9238 7.14216C15.9533 7.16713 15.993 7.17678 16.0306 7.1677L18.3426 6.60887C18.3947 6.59627 18.4489 6.6198 18.4753 6.66651L19.7571 8.93636C19.7827 8.98171 19.7761 9.0384 19.7408 9.07669L18.1072 10.8491C18.0819 10.8765 18.0709 10.9141 18.0769 10.951C18.1328 11.2921 18.1619 11.6426 18.1619 12C18.1619 12.3574 18.1328 12.7078 18.0769 13.049C18.0709 13.0858 18.0819 13.1234 18.1072 13.1509L19.7408 14.9233C19.7761 14.9615 19.7827 15.0182 19.7571 15.0636L18.4753 17.3334C18.4489 17.3802 18.3947 17.4037 18.3426 17.3911L16.0306 16.8323C15.993 16.8232 15.9533 16.8328 15.9238 16.8578C15.3991 17.3013 14.8013 17.6577 14.1516 17.9053C14.1161 17.9188 14.0888 17.9479 14.0781 17.9843L13.3946 20.3138C13.3796 20.3649 13.3327 20.4 13.2795 20.4H10.7206C10.6673 20.4 10.6204 20.3649 10.6054 20.3138L9.9219 17.9843C9.91122 17.9479 9.88392 17.9188 9.84846 17.9053C9.1988 17.6577 8.60099 17.3013 8.07625 16.8578C8.04671 16.8328 8.00709 16.8232 7.96949 16.8323L5.65745 17.3911C5.60531 17.4037 5.55114 17.3802 5.52476 17.3334L4.24299 15.0636C4.21738 15.0182 4.22395 14.9616 4.25924 14.9233L5.89289 13.1509C5.91817 13.1234 5.92919 13.0858 5.92315 13.049C5.86723 12.7078 5.83812 12.3574 5.83812 12C5.83812 11.6426 5.86723 11.2921 5.92315 10.951C5.92919 10.9141 5.91817 10.8765 5.89289 10.8491L4.25924 9.07669C4.22395 9.0384 4.21738 8.98171 4.24299 8.93636L5.52476 6.66651C5.55114 6.6198 5.60531 6.59627 5.65745 6.60887L7.96949 7.1677C8.00709 7.17678 8.04671 7.16713 8.07625 7.14216C8.60099 6.6986 9.1988 6.34221 9.84846 6.09468C9.88392 6.08117 9.91122 6.05203 9.9219 6.01563L10.6054 3.68619C10.6204 3.63508 10.6673 3.59998 10.7206 3.59998Z" stroke="currentColor" stroke-width="1.4" fill="none"/>
          <path d="M14.4 12C14.4 13.3255 13.3255 14.4 12 14.4C10.6745 14.4 9.60002 13.3255 9.60002 12C9.60002 10.6745 10.6745 9.59998 12 9.59998C13.3255 9.59998 14.4 10.6745 14.4 12Z" stroke="currentColor" stroke-width="1.4" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">관리자</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">계정 관리</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">권한 관리</span></a>
      <a class="scm-lnb-l2" href="#"><span class="scm-lnb-l2-text">로그 조회</span></a>
    </div>
  </div>

`;

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
    // 단일 source of truth = versions[page].finalId.
    // 레거시 confirmed[page] flag 는 stale 가능성이 있어 사용 X
    // (dev-export.js isConfirmed() 도 동일 정책).
    var versions = _readJsonLs(VERSIONS_KEY);
    if (!versions) return false;
    var cands = _candidatePaths(pagePath);
    for (var j = 0; j < cands.length; j++) {
      var v = versions[cands[j]];
      if (!v || !v.finalId) continue;
      // finalId 가 list 안의 실제 버전을 가리키는지 확인 (삭제 후 잔존 방지)
      if (Array.isArray(v.list) && v.list.some(function (x) { return x && x.id === v.finalId; })) {
        return true;
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
    // Empty placeholder → inject canonical LNB markup (단일 source).
    if (el.children.length === 0 && CANONICAL_LNB_HTML) {
      el.innerHTML = CANONICAL_LNB_HTML;
    }
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
