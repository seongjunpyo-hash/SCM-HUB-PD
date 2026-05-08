/* ============================================================
 * scm-scroll-lock — body scroll 잠금 유틸
 * ------------------------------------------------------------
 * 모달 / 드로어 / 풀스크린 오버레이가 열렸을 때 배경 페이지가
 * 스크롤되지 않도록 body 의 overflow 를 hidden 으로 잠금.
 *
 * 다중 잠금을 카운터로 안전 관리 — 여러 모달이 동시에 열려도
 * 마지막 모달이 닫힐 때까지 잠금 유지.
 *
 * Usage:
 *   SCM.scrollLock.lock();    // body scroll 잠금 (counter +1)
 *   SCM.scrollLock.unlock();  // 잠금 해제 (counter -1, 0 이 되면 풀림)
 *
 * 추가 효과:
 *   - 잠금 시점의 scrollbar width 만큼 padding-right 보정
 *     → 스크롤바 사라져도 콘텐츠가 옆으로 튀는 현상 방지
 *   - body 에 .scm-scroll-locked 클래스 추가 (CSS 보조 hooks 가능)
 * ============================================================ */

(function (root) {
  var counter = 0;
  var savedOverflow = null;
  var savedPaddingRight = null;

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lock() {
    counter++;
    if (counter > 1) return;     // 이미 잠긴 상태 — 카운터만 증가
    var body = document.body;
    if (!body) return;
    savedOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;
    var sbw = getScrollbarWidth();
    body.style.overflow = 'hidden';
    if (sbw > 0) {
      // 기존 padding-right 가 있으면 더해서 보정
      var basePr = parseInt(getComputedStyle(body).paddingRight, 10) || 0;
      body.style.paddingRight = (basePr + sbw) + 'px';
    }
    body.classList.add('scm-scroll-locked');
  }

  function unlock() {
    if (counter === 0) return;
    counter--;
    if (counter > 0) return;     // 다른 모달이 아직 열려있음
    var body = document.body;
    if (!body) return;
    body.style.overflow = savedOverflow || '';
    body.style.paddingRight = savedPaddingRight || '';
    body.classList.remove('scm-scroll-locked');
    savedOverflow = null;
    savedPaddingRight = null;
  }

  function isLocked() { return counter > 0; }

  // 비상시 강제 해제
  function reset() {
    counter = 0;
    var body = document.body;
    if (body) {
      body.style.overflow = savedOverflow || '';
      body.style.paddingRight = savedPaddingRight || '';
      body.classList.remove('scm-scroll-locked');
    }
    savedOverflow = null;
    savedPaddingRight = null;
  }

  root.SCM = root.SCM || {};
  root.SCM.scrollLock = { lock: lock, unlock: unlock, isLocked: isLocked, reset: reset };
})(typeof window !== 'undefined' ? window : globalThis);
