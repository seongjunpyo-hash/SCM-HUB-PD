// v2.26.0 — sticky-mode 지원 (CSS .mp-stats-row sticky 룰).
//           StatsBar 가 페이지 sticky stack 의 3번째 단(GNB → filter → stats → thead)에 위치.
//           StickyScrollStack util 이 stats row offsetHeight 를 측정해
//           --scm-sticky-stats CSS 변수에 자동 셋팅 → thead-sticky 의 top 계산에 사용.
/**
 * StatsBar — 데이터 리스트 페이지 통계/액션바
 *
 * 구조 (nested flex):
 *   <StatsBar>
 *     <StatsBarLeft>
 *       <StatsCountsWrap>
 *         <StatsCounts>
 *           <Stat tone="all|accent|muted" label="전체" num={0} />
 *           <StatDivider />
 *           ...
 *         </StatsCounts>
 *       </StatsCountsWrap>
 *       <VDivider />
 *       <StatsMiniActions>
 *         <MiniAction>...</MiniAction>
 *       </StatsMiniActions>
 *     </StatsBarLeft>
 *     <StatsBarRight>
 *       <DownloadButton/>
 *       <VDivider/>
 *       <Pager .../>
 *       <PageSize .../>
 *     </StatsBarRight>
 *   </StatsBar>
 *
 * Spec : design-system/docs/data-list-page.md §4
 */
import React from 'react';

export function StatsBar({ children, className = '', ...rest }) {
  return (
    <div className={['ld-stats-bar', className].filter(Boolean).join(' ')} {...rest}>{children}</div>
  );
}

export const StatsBarLeft       = ({ children, ...r }) => <div className="ld-stats-bar-left" {...r}>{children}</div>;
export const StatsCountsWrap    = ({ children, ...r }) => <div className="ld-stats-counts-wrap" {...r}>{children}</div>;
export const StatsCounts        = ({ children, ...r }) => <div className="ld-stats-counts" {...r}>{children}</div>;
export const StatsMiniActions   = ({ children, ...r }) => <div className="ld-stats-mini-actions" {...r}>{children}</div>;
export const StatsBarRight      = ({ children, ...r }) => <div className="ld-stats-bar-right" {...r}>{children}</div>;
export const VDivider           = (props) => <span className="v-divider" {...props} />;
export const StatDivider        = (props) => <span className="ld-stat-divider" {...props} />;

export function Stat({ label, num, tone = 'all', className = '', ...rest }) {
  // tone: 'all' | 'accent' | 'muted'
  const cls = [
    'ld-stat',
    tone === 'all'    && 'ld-stat--all',
    tone === 'accent' && 'ld-stat--accent',
    tone === 'muted'  && 'ld-stat--muted',
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      <span className="label">{label}</span>
      <span className="num">{num}</span>
    </span>
  );
}

export function MiniAction({ children, disabled = false, suffixIcon, onClick, ...rest }) {
  return (
    <button type="button" className="ld-mini-action" disabled={disabled} onClick={onClick} {...rest}>
      <span>{children}</span>
      {suffixIcon}
    </button>
  );
}

/* ----- Right toolbar pieces ----- */
export function DownloadButton({ children = '전체 엑셀 다운로드', icon, onClick, ...rest }) {
  return (
    <button type="button" className="download" onClick={onClick} {...rest}>
      {icon || (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 16.5H17M10 13.5V3.5M10 13.5L14 9.5M10 13.5L6 9.5" stroke="currentColor" fill="none"/>
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}

export function Pager({ current = 0, total = 0, onPrev, onNext, prevDisabled = true, nextDisabled = true }) {
  return (
    <span className="pager">
      <strong>{current}</strong>
      <span className="num-total">/ <span>{total}</span> 페이지</span>
      <button className="pbtn" aria-label="이전 페이지" disabled={prevDisabled} onClick={onPrev}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12.5 16L6.71213 10.212C6.59497 10.0948 6.59498 9.90486 6.71213 9.7877L12.5 4" stroke="currentColor" fill="none"/>
        </svg>
      </button>
      <button className="pbtn" aria-label="다음 페이지" disabled={nextDisabled} onClick={onNext}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M7.5 16L13.2879 10.2121C13.405 10.095 13.405 9.90503 13.2879 9.78787L7.5 4" stroke="currentColor" fill="none"/>
        </svg>
      </button>
    </span>
  );
}

export function PageSize({ value = 100, label, onClick, ...rest }) {
  return (
    <button type="button" className="pgsize" onClick={onClick} {...rest}>
      <span>{label || `${value}개씩`}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 8L10 14L16 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </button>
  );
}

export default StatsBar;
