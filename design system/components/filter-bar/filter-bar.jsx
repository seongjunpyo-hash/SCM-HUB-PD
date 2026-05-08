/**
 * scm-filter-bar — React twin
 *
 * 자식 컴포넌트는 props 로 받음 (FilterChip / FilterSelect 들 / actions).
 */

import { useEffect, useRef } from 'react';

export default function FilterBar({
  filterChip,                  // ReactNode
  selects,                     // ReactNode (개별 filter selects)
  actions,                     // ReactNode (검색/초기화 버튼)
  className = '',
}) {
  const trackRef = useRef(null);
  const fadeLeftRef = useRef(null);
  const fadeRightRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function sync() {
      const leftHas = track.scrollLeft > 0;
      const rightHas = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
      if (fadeLeftRef.current) fadeLeftRef.current.style.opacity = leftHas ? '1' : '0';
      if (fadeRightRef.current) fadeRightRef.current.style.opacity = rightHas ? '1' : '0';
    }
    track.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    sync();
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return (
    <div className={['scm-filter-bar', className].filter(Boolean).join(' ')}>
      {filterChip}
      <div className="scm-filter-overflow">
        <div ref={trackRef} className="scm-filter-overflow__track">
          {selects}
        </div>
        <div ref={fadeLeftRef} className="scm-filter-overflow__fade scm-filter-overflow__fade--left" style={{ opacity: 0 }} />
        <div ref={fadeRightRef} className="scm-filter-overflow__fade scm-filter-overflow__fade--right" style={{ opacity: 0 }} />
      </div>
      {actions && <div className="scm-filter-actions">{actions}</div>}
    </div>
  );
}
