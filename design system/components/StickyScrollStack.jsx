/**
 * StickyScrollStack — sticky 단(filter / stats) 높이 자동 측정 (v2.26.0)
 * --------------------------------------------------------------
 * GNB(64) → filter → stats → thead 가 차곡차곡 sticky 로 쌓이려면
 * 각 단의 실제 픽셀 높이를 알아야 다음 단의 `top` 을 정확히 계산할 수 있음.
 *
 * 본 유틸은 ResizeObserver 로 filter / stats 높이를 관측해서
 * `--scm-sticky-filter` / `--scm-sticky-stats` CSS 변수를 :root 에 셋팅.
 * GNB 높이는 고정이라 `--scm-sticky-gnb: 64px` (layer-desktop.css 에 정적 정의).
 *
 * Spec: layer-desktop.css §"v2.26.0 Sticky scroll stack".
 *
 * Usage:
 *   import { setupStickyScrollStack } from './design-system/components/StickyScrollStack.jsx';
 *   setupStickyScrollStack({ filterSelector: '.mp-filter-bar', statsSelector: '.mp-stats-row' });
 */
import { useEffect } from 'react';

/* ---------- Vanilla setup ---------- */
export function setupStickyScrollStack({
  filterSelector = '.mp-filter-bar',
  statsSelector  = '.mp-stats-row',
  filterVar = '--scm-sticky-filter',
  statsVar  = '--scm-sticky-stats',
} = {}) {
  const root = document.documentElement;
  const filterBar = document.querySelector(filterSelector);
  const statsRow  = document.querySelector(statsSelector);

  function update() {
    if (filterBar) root.style.setProperty(filterVar, filterBar.offsetHeight + 'px');
    if (statsRow)  root.style.setProperty(statsVar,  statsRow.offsetHeight  + 'px');
  }
  update();

  window.addEventListener('resize', update);
  let ro = null;
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(update);
    if (filterBar) ro.observe(filterBar);
    if (statsRow)  ro.observe(statsRow);
  }

  return function teardown() {
    window.removeEventListener('resize', update);
    if (ro) ro.disconnect();
  };
}

/* ---------- Optional React hook ---------- */
export function useStickyScrollStack(opts) {
  useEffect(() => {
    const teardown = setupStickyScrollStack(opts);
    return teardown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default setupStickyScrollStack;
