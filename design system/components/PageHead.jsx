/**
 * PageHead — 데이터 리스트 페이지 상단 (타이틀 + 우측 액션)
 *
 *   <PageHead>
 *     <PageTitle>SKU 관리</PageTitle>
 *     <PageActions>
 *       <ActionButton variant="primary">SKU 단건 등록</ActionButton>
 *       <ActionButton>일괄 업로드</ActionButton>
 *     </PageActions>
 *   </PageHead>
 *
 * Spec (Figma SCM Hub):
 *   - title 26/600/lh36.4 #000
 *   - action button h44, 검정 outlined / primary filled
 *   - padding 20 0 16 / gap 12
 *
 * 본 컴포넌트는 LayerDesktop 의 기존 PageHeader 와 별도로,
 * 데이터 리스트 페이지(SCM Hub) 표준 헤더 패턴 전용.
 */
import React from 'react';

export function PageHead({ children, className = '', ...rest }) {
  return (
    <div className={['ld-page-head', className].filter(Boolean).join(' ')} {...rest}>{children}</div>
  );
}

export function PageTitle({ children, ...rest }) {
  return <h1 className="ld-page-title" {...rest}>{children}</h1>;
}

export function PageActions({ children, ...rest }) {
  return <div className="ld-page-actions" {...rest}>{children}</div>;
}

export function ActionButton({ children, variant, count, prefixIcon, className = '', ...rest }) {
  // variant: undefined (default outlined) | 'primary' (filled)
  const cls = [
    'ld-action-btn',
    variant === 'primary' && 'ld-action-btn--primary',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} {...rest}>
      {prefixIcon}
      <span>{children}</span>
      {typeof count === 'number' && <span className="num">{count}</span>}
    </button>
  );
}

export default PageHead;
