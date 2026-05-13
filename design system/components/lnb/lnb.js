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

  <!-- 즐겨찾기 — 사용자 localStorage 의 hidden/deleted 상태와 충돌 안 하는 신규 키.
       PROTECTED 안전망으로 무조건 노출. quick-access 보다 한 단계 더 강한 보장. -->
  <div class="scm-lnb-item is-open" data-key="shortcut">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 L14.5 9 L21 9.5 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9.5 L9.5 9 Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
      <span class="scm-lnb-label">즐겨찾기</span>
      <span class="scm-lnb-chev">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
    </button>
    <div class="scm-lnb-l2-list">
      <a class="scm-lnb-l2" href="otb-budget.html" data-key="fav-otb"><span class="scm-lnb-l2-text">OTB 예산 계획</span></a>
      <a class="scm-lnb-l2" href="product-arrival-status.html" data-key="fav-arrival"><span class="scm-lnb-l2-text">위탁 상품 입고 현황</span></a>
    </div>
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
      <a class="scm-lnb-l2" href="index.html" data-key="index"><span class="scm-lnb-l2-text">무탠 전개상품 관리</span></a>
      <a class="scm-lnb-l2" href="editshop-restock-status.html" data-key="editshop-status"><span class="scm-lnb-l2-text">편집샵 재고 보충 현황</span></a>
      <a class="scm-lnb-l2" href="editshop-restock-request.html" data-key="editshop-request"><span class="scm-lnb-l2-text">편집샵 재고 보충 요청</span></a>
      <a class="scm-lnb-l2" href="editshop-products.html" data-key="editshop-products"><span class="scm-lnb-l2-text">편집샵 전개상품 관리</span></a>
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
    </div>
  </div>

  <!-- 발주/입고 관리 -->
  <div class="scm-lnb-item is-open" data-key="order">
    <button class="scm-lnb-row" type="button" data-nav-toggle>
      <span class="scm-lnb-icon">
        <!-- ic-orderSetting — pbo-design-system 의 canonical IcOrderSetting (viewBox 0 0 20 20).
             사용자 업로드 SVG 는 24x24 viewBox 였는데 path 가 20x20 기준 좌표라 24x24 컨테이너에
             작게 박혀 깨져 보이던 회귀 차단. fill="currentColor" 로 LNB color 따라가게. -->
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path fill="currentColor" d="M16.6666 10.8334L17.1616 10.3384C16.8883 10.065 16.445 10.065 16.1717 10.3384L16.6666 10.8334ZM11.7019 15.7981L11.2069 15.3031L11.093 15.4171L11.0403 15.5694L11.7019 15.7981ZM18.4344 12.6011L18.9294 13.0961C19.0607 12.9648 19.1344 12.7868 19.1344 12.6011C19.1344 12.4155 19.0607 12.2374 18.9294 12.1062L18.4344 12.6011ZM13.4697 17.5658L13.6984 18.2274L13.8507 18.1748L13.9646 18.0608L13.4697 17.5658ZM10.7679 18.4998L10.1064 18.2711C10.0188 18.5243 10.0835 18.8053 10.273 18.9948C10.4624 19.1842 10.7434 19.2489 10.9966 19.1614L10.7679 18.4998ZM6.19046 5.55H5.49046V6.95H6.19046V5.55ZM10.4166 6.95H11.1166V5.55H10.4166V6.95ZM8.33331 18.2H9.03331V16.8H8.33331V18.2ZM15.9666 8.33333V9.03333H17.3666V8.33333H15.9666ZM6.19046 8.83125H5.49046V10.2312H6.19046V8.83125ZM13.3333 10.2312H14.0333V8.83125H13.3333V10.2312ZM16.6666 10.8334L16.1717 10.3384L11.2069 15.3031L11.7019 15.7981L12.1969 16.2931L17.1616 11.3284L16.6666 10.8334ZM16.6666 10.8334L16.1717 11.3284L17.9394 13.0961L18.4344 12.6011L18.9294 12.1062L17.1616 10.3384L16.6666 10.8334ZM18.4344 12.6011L17.9394 12.1062L12.9747 17.0709L13.4697 17.5658L13.9646 18.0608L18.9294 13.0961L18.4344 12.6011ZM13.4697 17.5658L13.241 16.9043L10.5392 17.8382L10.7679 18.4998L10.9966 19.1614L13.6984 18.2274L13.4697 17.5658ZM10.7679 18.4998L11.4295 18.7285L12.3635 16.0268L11.7019 15.7981L11.0403 15.5694L10.1064 18.2711L10.7679 18.4998ZM16.3876 2.5V1.8H3.6124V2.5V3.2H16.3876V2.5ZM3.33331 2.78125H2.63331V17.2188H3.33331H4.03331V2.78125H3.33331ZM3.33331 17.2188H2.63331C2.63331 17.771 3.08507 18.2 3.61903 18.2V17.5V16.8C3.8374 16.8 4.03331 16.9771 4.03331 17.2188H3.33331ZM3.6124 2.5V1.8C3.05693 1.8 2.63331 2.25048 2.63331 2.78125H3.33331H4.03331C4.03331 3.00136 3.85227 3.2 3.6124 3.2V2.5ZM16.6666 2.78125H17.3666C17.3666 2.25048 16.943 1.8 16.3876 1.8V2.5V3.2C16.1477 3.2 15.9666 3.00136 15.9666 2.78125H16.6666ZM6.19046 6.25V6.95H10.4166V6.25V5.55H6.19046V6.25ZM8.33331 17.5V16.8H3.61903V17.5V18.2H8.33331V17.5ZM16.6666 8.33333H17.3666V2.78125H16.6666H15.9666V8.33333H16.6666ZM6.19046 9.53125V10.2312H13.3333V9.53125V8.83125H6.19046V9.53125Z"/>
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
      <a class="scm-lnb-l2" href="otb-budget.html" data-key="otb-budget"><span class="scm-lnb-l2-text">OTB 예산 관리</span></a>
      <a class="scm-lnb-l2" href="product-arrival-status.html" data-key="product-arrival-status"><span class="scm-lnb-l2-text">위탁 상품 입고 현황</span></a>
    </div>
  </div>

  <!-- 재고 관리 — L2 는 voc 신규 탭에서 등록한 페이지가 _applyNewPagesToLnb 로
       채워짐. 캐노니컬 L2 (재고내역 조회 / 재고이동 / 불량/정상 전환) 는 모두
       작업중 placeholder 였어서 제거 (PR #155). L1 자체는 유지 — 사용자가
       이 L1 키 (stock) 로 등록한 신규 L2 페이지들이 부모를 찾을 수 있어야 함. -->
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
      <a class="scm-lnb-l2" href="stock-movement.html" data-key="stock-movement"><span class="scm-lnb-l2-text">재고이동</span></a>
    </div>
  </div>

  <!-- 운영 설정 — 위와 같은 이유로 L1 유지, L2 는 신규 페이지로만. -->
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
    <div class="scm-lnb-l2-list"></div>
  </div>

  <!-- 관리자 — 위와 같은 이유로 L1 유지, L2 는 신규 페이지로만. -->
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
    <div class="scm-lnb-l2-list"></div>
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

  // iframe 컨텍스트일 때 LNB anchor 클릭 시 /demo/* 경로에 ?_voc=1 cache buster
  // 부착. VOC 의 navigateTo 가 iframe.src 에 buster 를 붙여도, iframe 내부에서
  // LNB anchor 를 직접 클릭하면 anchor href 그대로 navigation 되므로 buster 가
  // 빠져 CDN edge 의 옛 broken 응답을 hit 할 수 있음. 같은 buster 를 붙여서
  // 일관성 유지. top-level navigation (워크스페이스 → 데모 카드) 은 영향 X.
  function wireIframeCacheBuster(el) {
    if (typeof window === 'undefined') return;
    // top-level (= 부모 없음) 이면 적용 안 함. cross-origin 부모면 접근 시 throw 라 try.
    try { if (window.parent === window) return; } catch (_) { return; }
    el.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href === '#' || href.charAt(0) === '#') return;
      // anchor 의 resolved URL 이 같은 origin 의 /demo/* 일 때만 처리.
      var u;
      try { u = new URL(a.href, document.baseURI); } catch (_) { return; }
      if (u.origin !== window.location.origin) return;
      if (!u.pathname.startsWith('/demo/')) return;
      if (u.searchParams.has('_voc')) return; // 이미 buster 있음 — noop
      // 새 탭 / modifier 키 / target 지정된 클릭은 기본 동작 유지.
      if (a.target && a.target !== '_self') return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      u.searchParams.set('_voc', '1');
      e.preventDefault();
      window.location.href = u.toString();
    });
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
  function _verEntryForPath(versions, pagePath) {
    if (!versions) return null;
    var cands = _candidatePaths(pagePath);
    for (var j = 0; j < cands.length; j++) {
      var v = versions[cands[j]];
      if (v) return v;
    }
    return null;
  }
  function _isConfirmedPage(pagePath) {
    // 단일 source of truth = versions[page].finalId 가 list 의 실제 버전을 가리킴.
    // 레거시 confirmed[page] flag 는 stale 가능성이 있어 사용 X
    // (dev-export.js isConfirmed() 도 동일 정책).
    var versions = _readJsonLs(VERSIONS_KEY);
    var v = _verEntryForPath(versions, pagePath);
    if (!v || !v.finalId) return false;
    return Array.isArray(v.list) && v.list.some(function (x) { return x && x.id === v.finalId; });
  }
  // 페이지의 active(또는 fallback) applied snapshot 의 settings.exposed 를 읽음.
  // 반환: true(공개) / false(비공개) / null(버전 없음)
  function _readActiveExposed(pagePath) {
    var versions = _readJsonLs(VERSIONS_KEY);
    var v = _verEntryForPath(versions, pagePath);
    if (!v || !Array.isArray(v.list) || !v.list.length) return null;
    var active = null;
    if (v.activeId) {
      for (var i = 0; i < v.list.length; i++) {
        if (v.list[i] && v.list[i].id === v.activeId) { active = v.list[i]; break; }
      }
    }
    if (!active) active = v.list[v.list.length - 1];
    if (!active || !active.applied) return true; // 버전은 있지만 settings 없음 → 공개 default
    var s = active.applied.settings;
    if (!s || typeof s.exposed !== 'boolean') return true;
    return s.exposed;
  }
  // LNB 페이지 상태 태그 정책:
  //   1) 최종확정 — versions[page].finalId 가 set (super 가 최종확정 누름)
  //   2) 작업중   — active version 의 applied.settings.exposed === false
  //                 (편집 탭의 [데모 공개] 토글 OFF — 비공개 데모)
  //   3) 검토중   — 버전 1개 이상, 비공개 아님
  //   4) (없음)   — 버전 자체가 없는 페이지 (손대지 않음)
  // # placeholder 메뉴는 정적 마크업의 --wip 태그 그대로 (미구현 화면).
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
      var tagText = null, tagCls = null;
      if (_isConfirmedPage(pagePath)) {
        tagText = '최종확정';
        tagCls = 'scm-lnb-tag--done';
      } else {
        var exposed = _readActiveExposed(pagePath);
        if (exposed === false) {
          tagText = '작업중';
          tagCls = 'scm-lnb-tag--wip';
        } else if (exposed === true) {
          tagText = '검토중';
          tagCls = 'scm-lnb-tag--review';
        }
        // exposed === null → 버전 없음, 태그 없음
      }
      if (!tagText) continue;
      var tag = document.createElement('span');
      tag.className = 'scm-lnb-tag is-dynamic ' + tagCls;
      tag.textContent = tagText;
      a.appendChild(tag);
    }
  }

  // VOC 의 [신규] 탭에서 등록한 신규 페이지를 LNB 에 inject.
  // localStorage 'scm:voc:newpages:v1' 의 entry 를 읽어 LNB 에 메뉴 항목 추가.
  // mode='l2' → 기존 L1 그룹의 .scm-lnb-l2-list 에 append.
  // mode='l1' → 새 L1 그룹 (.scm-lnb-item) 을 LNB 끝에 append.
  // entry.order (sortable) 우선, 없으면 entry.createdAt (오래된 것이 위).
  var NEWPAGES_KEY = 'scm:voc:newpages:v1';
  function _loadNewPages() {
    try {
      var raw = localStorage.getItem(NEWPAGES_KEY);
      var v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v : [];
    } catch (_) { return []; }
  }
  function _applyNewPagesToLnb(el) {
    if (!el) return;
    var list = _loadNewPages();
    if (!list.length) return;
    // 정렬 — order 우선, 없으면 createdAt 오래된 순.
    var sorted = list.slice().sort(function (a, b) {
      var oa = (typeof a.order === 'number') ? a.order : Infinity;
      var ob = (typeof b.order === 'number') ? b.order : Infinity;
      if (oa !== ob) return oa - ob;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
    // **2-pass 처리** — 1차로 모든 L1 그룹 생성, 2차로 L2 anchor 추가.
    // 단일 pass 면 L2 entry 가 L1 entry 보다 먼저 iterate 될 때 부모 L1 그룹이
    // 아직 없어서 L2 가 skip 됨 → "신규 1뎁스 만들고 2뎁스 넣으면 사라짐" 버그 회귀.
    // Pass 1 — 모든 L1 그룹 생성
    sorted.forEach(function (p) {
      if (!p) return;
      if (p.mode !== 'l1') return;
      // 이미 존재하면 skip
      if (el.querySelector('[data-voc-np-id="' + p.id + '"]')) return;
      if (el.querySelector('.scm-lnb-item[data-key="' + p.l1 + '"]')) return;
      // 순수 L1 그룹 entry — path/name 없는 경우
      if (!p.path || !p.name) {
        el.appendChild(_buildL1Group(p, ''));
        return;
      }
      // 옛 entry — path 도 있는 mode='l1' (하위 호환). 그룹만 먼저 만듦. L2 는 Pass 2 에서.
      var key2 = ((p.path.match(/\/([^\/]+?)(?:\.html)?$/) || [])[1]) || p.id;
      el.appendChild(_buildL1Group(p, key2));
    });
    // Pass 2 — L2 anchor 를 부모 L1 그룹 아래 append. 부모 L1 그룹이 LNB 에
    // 없으면 (예: 사용자가 hide / deleted) 신규 L2 도 같이 안 보임 — cascade
    // hide 가 자연스러운 동작 ("이 그룹 안 보이게 = 그 안의 페이지도 안 보임").
    sorted.forEach(function (p) {
      if (!p) return;
      // 이미 anchor 가 존재하면 skip (재mount)
      if (p.id && el.querySelector('.scm-lnb-l2[data-voc-np-id="' + p.id + '"]')) return;
      if (!p.path) return;  // L1-only entry skip
      var key = ((p.path.match(/\/([^\/]+?)(?:\.html)?$/) || [])[1]) || p.id;
      if (p.mode === 'l1') {
        // 옛 entry — 그룹은 이미 Pass 1 에서 만들었으니 L2 anchor 만 추가
        if (!p.name) return;
        var existing = el.querySelector('.scm-lnb-item[data-key="' + p.l1 + '"]');
        if (!existing) return;
        var l2List = existing.querySelector('.scm-lnb-l2-list');
        if (l2List) l2List.appendChild(_buildL2Anchor(p, key));
      } else {
        var group = el.querySelector('.scm-lnb-item[data-key="' + p.l1 + '"]');
        if (!group) return;
        var l2 = group.querySelector('.scm-lnb-l2-list');
        if (l2) l2.appendChild(_buildL2Anchor(p, key));
      }
    });
  }
  function _buildL2Anchor(p, key) {
    var a = document.createElement('a');
    a.className = 'scm-lnb-l2';
    a.href = p.path;
    a.dataset.key = key;
    a.dataset.vocNpId = p.id;
    var span = document.createElement('span');
    span.className = 'scm-lnb-l2-text';
    span.textContent = p.name || key;
    a.appendChild(span);
    // [신규] 라벨은 LNB 에 안 박음 — applyStatusTags 가 페이지 상태에 맞는
    // 태그 (작업중 / 검토중 / 최종확정) 를 동적으로 한 개만 부착하도록 일임.
    // 두 태그 (신규 + 작업중) 동시 노출은 시각 노이즈.
    return a;
  }
  function _buildL1Group(p, key) {
    var item = document.createElement('div');
    item.className = 'scm-lnb-item is-open';
    item.dataset.key = p.l1;
    item.dataset.vocNpId = p.id;
    var btn = document.createElement('button');
    btn.className = 'scm-lnb-row';
    btn.type = 'button';
    btn.setAttribute('data-nav-toggle', '');
    var icon = document.createElement('span');
    icon.className = 'scm-lnb-icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
    btn.appendChild(icon);
    var label = document.createElement('span');
    label.className = 'scm-lnb-label';
    label.textContent = p.l1Label || p.l1;
    btn.appendChild(label);
    var chev = document.createElement('span');
    chev.className = 'scm-lnb-chev';
    chev.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 10 L8 5 L13 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    btn.appendChild(chev);
    item.appendChild(btn);
    var l2List = document.createElement('div');
    l2List.className = 'scm-lnb-l2-list';
    // 순수 L1 그룹 (path/key 없음) 이면 L2 anchor 안 추가 — 사용자가 별도로
    // mode='l2' 로 페이지 추가해야 노출.
    if (key && p.path && p.name) {
      l2List.appendChild(_buildL2Anchor(p, key));
    }
    item.appendChild(l2List);
    return item;
  }

  // VOC 의 [신규] 탭에서 사용자가 드래그-리오더 한 결과를 LNB 에 적용.
  // localStorage 'scm:voc:menu-order:v1' = { l1Order: [], l2Order: { l1key: [] } }
  // L1 그룹 / L2 항목을 그 순서대로 재배치. 미설정 항목은 자연 위치 유지.
  var MENU_ORDER_KEY = 'scm:voc:menu-order:v1';
  function _loadMenuOrder() {
    try {
      var raw = localStorage.getItem(MENU_ORDER_KEY);
      var v = raw ? JSON.parse(raw) : {};
      return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    } catch (_) { return {}; }
  }
  // 사용자가 hide 한 캐노니컬 메뉴 항목을 LNB 에서 제거.
  // voc 의 setMenuHidden() 으로 저장된 'scm:voc:menu-hidden:v1' 키와 동기.
  // 구조: { l1: [...], l2: [...] }
  function _loadMenuHidden() {
    try {
      if (typeof localStorage === 'undefined') return { l1: [], l2: [] };
      var raw = localStorage.getItem('scm:voc:menu-hidden:v1');
      var v = raw ? JSON.parse(raw) : null;
      if (!v || typeof v !== 'object' || Array.isArray(v)) return { l1: [], l2: [] };
      return {
        l1: Array.isArray(v.l1) ? v.l1 : [],
        l2: Array.isArray(v.l2) ? v.l2 : [],
      };
    } catch (_) { return { l1: [], l2: [] }; }
  }
  // voc 의 setMenuDeleted() 로 저장된 'scm:voc:menu-deleted:v1' 키 — 영구 삭제.
  // hidden 과 별도. 캐노니컬 markup 에 있어도 LNB 에서 완전 제거. UI 토글 없음.
  function _loadMenuDeleted() {
    try {
      if (typeof localStorage === 'undefined') return { l1: [], l2: [] };
      var raw = localStorage.getItem('scm:voc:menu-deleted:v1');
      var v = raw ? JSON.parse(raw) : null;
      if (!v || typeof v !== 'object' || Array.isArray(v)) return { l1: [], l2: [] };
      return {
        l1: Array.isArray(v.l1) ? v.l1 : [],
        l2: Array.isArray(v.l2) ? v.l2 : [],
      };
    } catch (_) { return { l1: [], l2: [] }; }
  }
  // **PROTECTED L2 키** — cascade 로만 보호. 사용자가 직접 hide/delete 한 의도는
  // 존중 (= 사라진 채로). 부모 L1 이 hidden 되어 anchor 가 LNB 어디에도 없으면
  // 첫 가시 L1 에 자동 복원해 사용자가 페이지에 영구 접근 못하는 케이스 차단.
  // cross-L1 이동도 자유롭게 허용 — 사용자 컨트롤 우선.
  var PROTECTED_L2 = ['fav-otb', 'fav-arrival'];
  function _applyMenuHiddenToLnb(el) {
    if (!el) return;
    // hidden 과 deleted 를 합쳐 처리 — 둘 다 LNB 에서 제거. 차이는 voc UI
    // 토글 가능 여부 (deleted 는 voc 에서도 안 보이게 _buildMenuTree 에서 제외).
    var hidden = _loadMenuHidden();
    var deleted = _loadMenuDeleted();
    var l1All = hidden.l1.concat(deleted.l1);
    var l2All = hidden.l2.concat(deleted.l2);
    if (l1All.length) {
      l1All.forEach(function (l1key) {
        var item = el.querySelector('.scm-lnb-item[data-key="' + l1key + '"]');
        if (item && item.parentNode) item.parentNode.removeChild(item);
      });
    }
    // L2 hide / 삭제 → 해당 .scm-lnb-l2 anchor 제거.
    if (l2All.length) {
      l2All.forEach(function (l2key) {
        var a = el.querySelector('.scm-lnb-l2[data-key="' + l2key + '"]');
        if (a && a.parentNode) a.parentNode.removeChild(a);
      });
    }
  }
  function _applyMenuOrderToLnb(el) {
    if (!el) return;
    var order = _loadMenuOrder();
    // L1 그룹 reorder — l1Order 에 안 들어있는 L1 (예: 새로 캐노니컬에 추가된
    // 그룹, 또는 voc 신규 L1 가 추가됐는데 그 후 reorder 가 없었던 경우) 가 있을
    // 때, 옛 appendChild 방식은 ordered 항목들을 끝으로 보내 unordered 항목이 TOP
    // 에 남는 결과를 만듦 → VOC 메뉴관리 트리 (`_buildMenuTree`: ordered TOP +
    // unseen BOTTOM) 와 정반대로 표시되어 사용자가 "메뉴관리 순서랑 LNB 가
    // 안 맞는다" 라고 보고. L2 와 동일하게 reverse + insertBefore(firstChild)
    // prepend 패턴으로 통일 — ordered 항목은 TOP 에 의도한 순서, unordered (신규
    // 추가) 항목은 자연스럽게 BOTTOM 으로.
    if (Array.isArray(order.l1Order) && order.l1Order.length) {
      order.l1Order.slice().reverse().forEach(function (l1key) {
        var item = el.querySelector('.scm-lnb-item[data-key="' + l1key + '"]');
        if (item) el.insertBefore(item, el.firstChild);
      });
    }
    // L2 reorder per L1 — placeholder (href="#") 들은 data-key 가 없어 arr 에
    // 안 들어옴. 옛날엔 appendChild 로 ordered 항목을 끝으로 보냈는데, 그러면
    // placeholder 가 TOP 에 고정된 상태로 ordered 항목이 BOTTOM 부근으로 밀려남
    // → 사용자가 "TOP 으로 올렸는데 밑에서 2번째에 있다" 라고 보고하던 버그.
    // 해결: arr 를 reverse 해서 insertBefore(firstChild) 로 LIST TOP 에 prepend.
    // ordered 항목이 의도한 순서로 TOP 에, placeholder / unordered 항목은
    // 자연스럽게 BOTTOM 으로.
    if (order.l2Order && typeof order.l2Order === 'object') {
      Object.keys(order.l2Order).forEach(function (l1key) {
        var arr = order.l2Order[l1key];
        if (!Array.isArray(arr) || !arr.length) return;
        var group = el.querySelector('.scm-lnb-item[data-key="' + l1key + '"]');
        if (!group) return;
        var l2List = group.querySelector('.scm-lnb-l2-list');
        if (!l2List) return;
        // Cross-L1 이동 지원 — anchor 는 el 전역에서 검색 (다른 L1 의 l2List 에
        // 있더라도 옮김). prepend 방식으로 ordered 항목이 TOP 에, placeholder /
        // unordered 항목은 BOTTOM 으로.
        // **신규 페이지 anchor (data-voc-np-id 가짐) 는 cross-L1 이동 차단 —
        // newpage entry 의 p.l1 이 source of truth 이고 _applyNewPagesToLnb
        // 가 이미 그 위치에 박아둠. l2Order 의 stale 한 cross-L1 entry 따라
        // 옮기면 voc/_buildMenuTree 가 보여주는 위치와 어긋남.** 캐노니컬 L2
        // 는 p.l1 개념 없으므로 cross-L1 그대로 동작.
        arr.slice().reverse().forEach(function (l2key) {
          var anchor = el.querySelector('.scm-lnb-l2[data-key="' + l2key + '"]');
          if (!anchor) return;
          if (anchor.parentNode !== l2List) {
            // 신규 페이지면 cross-L1 이동 안 함 (p.l1 우선).
            if (anchor.dataset.vocNpId) return;
            anchor.parentNode.removeChild(anchor);
          }
          l2List.insertBefore(anchor, l2List.firstChild);
        });
      });
    }
  }

  // VOC 메뉴관리에서 사용자가 L1 그룹별 아이콘을 변경한 결과 적용.
  // localStorage 'scm:voc:menu-icons:v1' = { l1key: 'ic-XXX', ... }
  // 캐노니컬 lnb.js 의 inline SVG 를 디자인 시스템 sprite 의 <use href="#ic-XXX">
  // 로 교체. sprite (scm-icons.js) 가 같은 페이지에 로드되어 있어야 보임.
  // 신규 L1 그룹도 동일하게 적용.
  var MENU_ICONS_KEY = 'scm:voc:menu-icons:v1';
  function _loadMenuIcons() {
    try {
      if (typeof localStorage === 'undefined') return {};
      var raw = localStorage.getItem(MENU_ICONS_KEY);
      var v = raw ? JSON.parse(raw) : {};
      return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    } catch (_) { return {}; }
  }
  function _applyMenuIconsToLnb(el) {
    if (!el) return;
    var icons = _loadMenuIcons();
    var keys = Object.keys(icons);
    if (!keys.length) return;
    // 시각 stroke 두께 (px) — canonical 캐노니컬 1.4 보다 살짝 얇게 (1.3) 해
    // 사용자 요청 ("사이즈 키우고 굵기 줄여") 충족.
    var TARGET_STROKE_PX = 1.3;
    var TARGET_PX = 24;
    keys.forEach(function (l1key) {
      var iconId = icons[l1key];
      if (!iconId || typeof iconId !== 'string' || iconId.indexOf('ic-') !== 0) return;
      var item = el.querySelector('.scm-lnb-item[data-key="' + l1key + '"]');
      if (!item) return;
      var iconSpan = item.querySelector('.scm-lnb-row > .scm-lnb-icon');
      if (!iconSpan) return;
      var sym = document.getElementById(iconId);
      if (!sym) return;
      var vb = sym.getAttribute('viewBox') || '0 0 24 24';
      var parts = vb.split(/\s+/);
      var w = parseFloat(parts[2]) || 24;
      // 24x24 컨테이너로 scale 시 stroke 도 같이 scale 됨 → svg coord 의
      // stroke-width 를 보정해 시각 stroke = TARGET_STROKE_PX 가 되게.
      var scale = TARGET_PX / w;
      var newSw = (TARGET_STROKE_PX / scale).toFixed(2);
      // 심볼 inner content 를 inline (use 안 씀) + stroke-width 재설정.
      // use 는 shadow tree 라 stroke-width 직접 override 안 됨.
      var content = sym.innerHTML.replace(/stroke-width="[\d.]+"/g, 'stroke-width="' + newSw + '"');
      iconSpan.innerHTML = '<svg viewBox="' + vb + '" style="width:' + TARGET_PX + 'px;height:' + TARGET_PX + 'px;" aria-hidden="true">' + content + '</svg>';
    });
  }

  // **PROTECTED L2 cascade 안전망** — 사용자 직접 hide/delete 는 존중하되,
  // 부모 L1 cascade hide 로 anchor 가 LNB 어디에도 없어진 경우만 자동 복원.
  // 복원 위치 우선순위: (1) menu-order.l2Order 에 명시된 L1 (사용자가 마지막에
  // 옮긴 위치) (2) 즐겨찾기 (캐노니컬 위치) (3) 첫 가시 L1 (최후 fallback).
  function _ensureProtectedL2(el) {
    if (!el || !CANONICAL_LNB_HTML) return;
    var hidden = _loadMenuHidden();
    var deleted = _loadMenuDeleted();
    var explicit = hidden.l2.concat(deleted.l2);
    var order = _loadMenuOrder();
    var l2Order = (order && order.l2Order) ? order.l2Order : {};
    PROTECTED_L2.forEach(function (l2key) {
      // L2-level 명시적 hide/delete — 사용자 의도 존중, 복원 안 함.
      if (explicit.indexOf(l2key) !== -1) return;
      // anchor 가 LNB 어디든 있으면 OK.
      if (el.querySelector('.scm-lnb-l2[data-key="' + l2key + '"]')) return;
      // (1) l2Order 에서 이 키가 속한 L1 찾기
      var targetList = null;
      Object.keys(l2Order).forEach(function (l1key) {
        if (targetList) return;
        var arr = l2Order[l1key];
        if (!Array.isArray(arr) || arr.indexOf(l2key) === -1) return;
        var group = el.querySelector('.scm-lnb-item[data-key="' + l1key + '"]');
        if (group) targetList = group.querySelector('.scm-lnb-l2-list');
      });
      // (2) 캐노니컬 즐겨찾기 fallback
      if (!targetList) {
        var fav = el.querySelector('.scm-lnb-item[data-key="shortcut"] .scm-lnb-l2-list');
        if (fav) targetList = fav;
      }
      // (3) 첫 가시 L1 fallback
      if (!targetList) {
        targetList = el.querySelector('.scm-lnb-item .scm-lnb-l2-list');
      }
      if (!targetList) return;
      var tmp = document.createElement('div');
      tmp.innerHTML = CANONICAL_LNB_HTML;
      var src = tmp.querySelector('.scm-lnb-l2[data-key="' + l2key + '"]');
      if (!src) return;
      targetList.appendChild(src.cloneNode(true));
    });
  }

  function mount(el, opts) {
    if (!el) return null;
    // Empty placeholder → inject canonical LNB markup (단일 source).
    if (el.children.length === 0 && CANONICAL_LNB_HTML) {
      el.innerHTML = CANONICAL_LNB_HTML;
    }
    // **순서** — hidden(1) → newPages → order → ensureL2 → hidden(2).
    // hidden 을 두 번 호출하는 이유:
    //   (1) 캐노니컬 L1 (예: 'order') 이 deleted 면 미리 제거해야 그 후
    //       newPages 의 신규 'order' L1 그룹 생성이 충돌 없이 됨.
    //   (2) 마지막에 다시 한번 적용 — 신규 페이지 hidden / cascade 복원된
    //       PROTECTED_L2 의 hidden 처리. 사용자가 [미노출] 토글한 신규
    //       페이지가 LNB 에 보이던 회귀 차단.
    _applyMenuHiddenToLnb(el);
    // VOC 의 [신규] 탭에서 등록한 페이지를 LNB 에 추가.
    _applyNewPagesToLnb(el);
    // 사용자가 드래그-리오더 한 메뉴 순서 적용 (canonical + 신규 모두 대상).
    _applyMenuOrderToLnb(el);
    // VOC 메뉴관리에서 L1 그룹별로 아이콘을 변경한 결과 적용.
    _applyMenuIconsToLnb(el);
    // PROTECTED_L2 cascade 복원 — 부모 L1 hide 등으로 anchor 가 LNB 어디에도
    // 없어진 케이스만 l2Order 기반 위치 또는 fallback 으로 복원.
    _ensureProtectedL2(el);
    // 2차 hidden 적용 — 신규 페이지 / cascade 복원 L2 중 [미노출] 토글된 것 정리.
    _applyMenuHiddenToLnb(el);
    var options = opts || {};
    var active = options.active || el.getAttribute('data-active');
    if (active) setActive(el, active);

    wireNavToggle(el);
    wireIframeCacheBuster(el);
    applyStatusTags(el);
    // re-apply when versions / confirmed / 메뉴 hidden / order state 가 다른 탭에서 바뀌면.
    if (!root.__scmLnbStorageWired) {
      // cross-tab — localStorage storage event
      window.addEventListener('storage', function (e) {
        if (!e || !e.key) return;
        if (e.key === CONFIRMED_KEY || e.key === VERSIONS_KEY) {
          var nodes = document.querySelectorAll('.scm-lnb');
          for (var i = 0; i < nodes.length; i++) applyStatusTags(nodes[i]);
        }
        // voc 가 메뉴 hidden / deleted / order / icons 변경 시 — 다른 탭의 LNB 도 즉시 재반영.
        if (e.key === 'scm:voc:menu-hidden:v1' || e.key === 'scm:voc:menu-deleted:v1' || e.key === 'scm:voc:menu-order:v1' || e.key === 'scm:voc:newpages:v1' || e.key === MENU_ICONS_KEY) {
          var nodes = document.querySelectorAll('.scm-lnb');
          for (var i = 0; i < nodes.length; i++) {
            nodes[i].innerHTML = '';
            mount(nodes[i]);
          }
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

  // ===== Canonical menu data (for VOC dropdown / sidebar consumers) =====
  // CANONICAL_LNB_HTML 을 한 번 파싱해 구조화된 메뉴 배열 export. VOC 등
  // 다른 화면이 자체 navigation UI 를 그릴 때 이걸 single source 로 쓴다.
  // (메뉴 추가/이동은 CANONICAL_LNB_HTML 수정 한 곳만 → 자동 반영)
  function parseCanonicalMenu() {
    if (typeof document === 'undefined') return [];
    var tmp = document.createElement('div');
    tmp.innerHTML = CANONICAL_LNB_HTML;
    var out = [];
    var items = tmp.querySelectorAll('.scm-lnb-item');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var key = item.getAttribute('data-key');
      var labEl = item.querySelector('.scm-lnb-label');
      var label = labEl ? labEl.textContent.trim() : '';
      if (!key || !label) continue;
      var children = [];
      var l2s = item.querySelectorAll('.scm-lnb-l2');
      for (var j = 0; j < l2s.length; j++) {
        var a = l2s[j];
        var href = a.getAttribute('href') || '';
        if (!href || href === '#' || href.charAt(0) === '#') continue; // skip placeholder
        var txt = a.querySelector('.scm-lnb-l2-text');
        var l2Label = txt ? txt.textContent.trim() : '';
        // demo 페이지는 상대 경로(sku-management.html) 로 표기 — VOC 등이
        // 절대 경로 (/demo/...) 로 조회할 수 있게 정규화
        var path = href.charAt(0) === '/' ? href : '/demo/' + href;
        children.push({
          path: path,
          label: l2Label,
          key: a.getAttribute('data-key') || '',
        });
      }
      // L1 자체가 페이지인 케이스 (대시보드처럼 L2 없음): href 가 .scm-lnb-row 에 있음
      if (children.length === 0) {
        var row = item.querySelector('.scm-lnb-row[href]');
        if (row) {
          var hh = row.getAttribute('href');
          var pp = hh.charAt(0) === '/' ? hh : '/demo/' + hh;
          children.push({ path: pp, label: label, key: key });
        }
      }
      out.push({ l1: key, label: label, children: children });
    }
    return out;
  }

  // ===== Auto-mount =====
  // 페이지 인라인 <script>SCM.lnb.mount(...)</script> 호출 없이도 동작하도록
  // DOMContentLoaded 시 모든 .scm-lnb 빈 placeholder 를 자동 mount.
  // active 키는 data-active 속성에서 읽음.
  function autoMount() {
    var nodes = document.querySelectorAll('.scm-lnb');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length === 0) mount(el);
    }
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoMount, { once: true });
    } else {
      autoMount();
    }
  }

  root.SCM = root.SCM || {};
  root.SCM.lnb = {
    mount: mount,
    toggle: toggle,
    open: function () { setOpen(true); },
    close: function () { setOpen(false); },
    isOpen: isOpen,
    setActive: setActive,
    // 메뉴 데이터 (lazy / cached) — VOC navigation 등이 single source 로 사용
    getMenu: (function () {
      var cache = null;
      return function () {
        if (cache) return cache;
        cache = parseCanonicalMenu();
        return cache;
      };
    })(),
  };
})(typeof window !== 'undefined' ? window : globalThis);
