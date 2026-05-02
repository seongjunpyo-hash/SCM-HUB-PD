/* ============================================================
 * scm-filter-bar — vanilla helper
 * ------------------------------------------------------------
 * overflow track 의 좌우 fade gradient 와 좌/우 화살표 버튼
 * (스크롤 양 끝으로 점프) 을 스크롤 위치에 따라 표시/숨김 처리.
 *
 * Arrow pair 는 mount 시 자동 주입 (legacy mp-filter-arrow-pair 동작).
 * 한쪽 끝 도달 시 해당 화살표만 숨기고 반대 쪽이 단일 버튼처럼 보이게.
 * ============================================================ */

(function (root) {
  var ARROW_LEFT_SVG  = '<svg viewBox="0 0 20 20" fill="none"><path d="M12.5 16L6.71213 10.212C6.59497 10.0948 6.59498 9.90486 6.71213 9.7877L12.5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_RIGHT_SVG = '<svg viewBox="0 0 20 20" fill="none"><path d="M7.5 16L13.2879 10.2121C13.405 10.095 13.405 9.90503 13.2879 9.78787L7.5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function mount(el, opts) {
    if (!el) return null;
    el.classList.add('scm-filter-bar');

    var overflow = el.querySelector('.scm-filter-overflow');
    var track = el.querySelector('.scm-filter-overflow__track');
    var fadeLeft = el.querySelector('.scm-filter-overflow__fade--left');
    var fadeRight = el.querySelector('.scm-filter-overflow__fade--right');

    // ---- Arrow pair 주입 ----
    var arrowPair = null, leftArrow = null, rightArrow = null;
    if (overflow && track) {
      arrowPair = document.createElement('div');
      arrowPair.className = 'scm-filter-arrow-pair';
      arrowPair.style.display = 'none';

      leftArrow = document.createElement('button');
      leftArrow.type = 'button';
      leftArrow.className = 'scm-filter-arrow-btn';
      leftArrow.setAttribute('aria-label', '이전 필터');
      leftArrow.innerHTML = ARROW_LEFT_SVG;

      rightArrow = document.createElement('button');
      rightArrow.type = 'button';
      rightArrow.className = 'scm-filter-arrow-btn';
      rightArrow.setAttribute('aria-label', '다음 필터');
      rightArrow.innerHTML = ARROW_RIGHT_SVG;

      arrowPair.appendChild(leftArrow);
      arrowPair.appendChild(rightArrow);
      overflow.appendChild(arrowPair);

      leftArrow.addEventListener('click', function () {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      });
      rightArrow.addEventListener('click', function () {
        track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: 'smooth' });
      });
    }

    function syncFade() {
      if (!track) return;
      var canLeft = track.scrollLeft > 0;
      var canRight = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
      var hasOverflow = track.scrollWidth > track.clientWidth + 1;
      if (fadeLeft) fadeLeft.style.opacity = canLeft ? '1' : '0';
      if (fadeRight) fadeRight.style.opacity = canRight ? '1' : '0';

      if (!arrowPair) return;
      if (hasOverflow && (canLeft || canRight)) {
        arrowPair.style.display = 'inline-flex';
        // 한쪽만 보이는 경우 → 단일 버튼 형태
        if (canLeft && !canRight) {
          leftArrow.style.display = 'inline-flex';
          rightArrow.style.display = 'none';
          leftArrow.style.borderRadius = '4px';
        } else if (!canLeft && canRight) {
          leftArrow.style.display = 'none';
          rightArrow.style.display = 'inline-flex';
          rightArrow.style.borderRadius = '4px';
          rightArrow.style.borderLeftWidth = '1px';
        } else {
          leftArrow.style.display = 'inline-flex';
          rightArrow.style.display = 'inline-flex';
          leftArrow.style.borderRadius = '4px 0 0 4px';
          rightArrow.style.borderRadius = '0 4px 4px 0';
          rightArrow.style.borderLeftWidth = '0';
        }
      } else {
        arrowPair.style.display = 'none';
      }
    }

    if (track) {
      track.addEventListener('scroll', syncFade);
      window.addEventListener('resize', syncFade);
      // 초기 동기화 — 다음 frame
      requestAnimationFrame(syncFade);
    }

    return {
      el: el,
      syncFade: syncFade,
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.filterBar = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
