/**
 * EmptyState — standalone 빈 상태 (테이블 외부에서도 사용)
 *
 * Spec (Figma SCM Hub):
 *   - 상하 #EBEBEB 보더 + padding 80 24
 *   - icon 64×64 노란 삼각형 (#FFA12A)
 *   - title 16/600/lh21.76 black
 *   - desc 15/400/lh20.4 #666
 *
 * 테이블 안에서 사용 시: <DataTableEmpty colSpan={N}/> 사용
 */
import React from 'react';

export function EmptyState({
  icon,
  title = '검색 조건을 설정해 주세요.',
  desc = '조회하실 조건을 입력하고 검색을 시작해 주세요.',
  className = '',
  ...rest
}) {
  return (
    <div className={['ld-empty-state', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ld-empty-state-icon">
        {icon || (
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              d="M32 42V37M32 35V21M5 53H59C60 53 60.5 52 60 51L33 7C32.5 6 31.5 6 31 7L4 51C3.5 52 4 53 5 53Z"
              stroke="currentColor" strokeWidth="5" strokeLinejoin="round" fill="none"
            />
          </svg>
        )}
      </div>
      <div className="ld-empty-state-text">
        <div className="ld-empty-state-title">{title}</div>
        <div className="ld-empty-state-desc">{desc}</div>
      </div>
    </div>
  );
}

export default EmptyState;
