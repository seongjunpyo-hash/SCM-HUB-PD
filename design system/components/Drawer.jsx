/**
 * Layer Desktop — Drawer
 * --------------------------------------------------------------
 * Figma nodes:
 *   - 10119:4891  (Drawer matrix)
 *   - 10200:79952 (Drawer in-context — viewports + nested)
 *   - 10200:79952#widthMode 가이드
 *
 * 공식 정의:
 *   "기존 화면의 컨텍스트를 유지한 상태에서, 추가 정보 확인이나
 *    확장된 작업을 수행할 수 있는 컴포넌트"
 *
 * --- Props ---
 *  open            : boolean
 *  onClose         : () => void
 *  title           : string                — 헤더 제목
 *  description     : string | ReactNode    — 헤더 아래 info-알럿 영역 (선택)
 *                                            string  → 헤더 옆 ⓘ 아이콘으로만 (tooltip)
 *                                            ReactNode → banner-info와 동일한 알럿 박스로 노출
 *  banner          : ReactNode             — Banner 슬롯 (선택)
 *                                            ⚠ description ReactNode와 banner는 시각적으로
 *                                              동일하므로 같은 화면에서 같이 쓰지 말 것 (택1)
 *  stickyTop       : ReactNode             — body 위 fixed 영역 (filter/tabs/calendar) (선택)
 *  footer          : ReactNode             — 액션 버튼 영역
 *  buttonCount     : 0|1|2|3               — footer 버튼 개수 힌트 (a11y/스타일링)
 *
 *  widthMode       : 'fluid' | 'fixed'     기본 'fixed'
 *    - 'fixed' : 400~1199px 사용자 지정 (기본 560)
 *    - 'fluid' : viewport ≥ 1200 → drawer 너비 = viewport - 320 (anchor overlay 320 유지)
 *                viewport <  1200 → drawer 너비 = 100% (overlay 없음)
 *  width           : '400px'~'1199px' | preset 'sm'|'md'|'lg'|'xl' (widthMode='fixed' 만)
 *
 *  placement       : 'right' (기본) | 'left'
 *  overlay         : boolean (기본 true) — overlay 배경 표시 여부
 *  overlayClose    : boolean (기본 true) — overlay 클릭 닫기
 *  scrollable      : boolean (기본 true) — body 영역 scroll 활성화
 *  showScrollbar   : boolean (기본 true) — scrollbar 가시성
 *  showClose       : boolean (기본 true)
 *
 *  nested          : ReactNode (Drawer.Nested)
 *
 * --- Static helpers ---
 *  Drawer.AccentBlock — body 안 강조 블록 (좌측 accent border + 연한 파랑 bg)
 *  Drawer.Nested      — main drawer 우측에 붙는 sub-drawer
 */
import React, { useEffect } from 'react';

const FIXED_PRESET = {
  s:  '400px',  sm: '400px',
  md: '560px',
  l:  '720px',  lg: '720px',
  xl: '960px',
};

export function Drawer({
  open,
  onClose,
  // content slots
  title,
  description,
  banner,
  stickyTop,
  footer,
  buttonCount,
  // sizing
  widthMode = 'fixed',
  width,                     // string ('560px') 또는 preset key
  placement = 'right',
  // behavior
  overlay = true,
  overlayClose = true,
  scrollable = true,
  showScrollbar = true,
  // appearance
  showClose = true,
  // nested slot
  nested,
  className = '',
  children,
  ...rest
}) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // description (block) + banner 동시 사용 시 dev 경고 (시각 중복)
  if (process.env.NODE_ENV !== 'production' && description && typeof description !== 'string' && banner) {
    // eslint-disable-next-line no-console
    console.warn('[LD Drawer] description(ReactNode)과 banner를 같이 쓰면 시각 중복이 발생합니다. 둘 중 하나만 사용하세요.');
  }

  // width 결정
  const isFluid = widthMode === 'fluid';
  const fixedWidth =
    !isFluid && (FIXED_PRESET[width] || (typeof width === 'string' ? width : 'var(--ld-drawer-width-m)'));

  const overlayCls = [
    'ld-drawer-overlay',
    placement === 'left' ? 'ld-drawer-overlay-left' : '',
    isFluid ? 'ld-drawer-overlay-fluid' : '',
    !overlay ? 'ld-drawer-overlay-no-bg' : '',
  ].filter(Boolean).join(' ');

  const drawerCls = [
    'ld-drawer',
    isFluid ? 'ld-drawer-fluid' : 'ld-drawer-fixed',
    nested ? 'ld-drawer-with-nested' : '',
    className,
  ].filter(Boolean).join(' ');

  const headerCls = 'ld-drawer-header';

  const drawerStyle = !isFluid && fixedWidth ? { width: fixedWidth } : undefined;

  const main = (
    <div
      className={nested ? 'ld-drawer-main' : ''}
      style={
        nested
          ? undefined
          : { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }
      }
    >
      {(title || showClose) ? (
        <header className={headerCls}>
          <div className="ld-drawer-title-wrap">
            {title ? <h2 className="ld-drawer-title">{title}</h2> : null}
            {description && typeof description === 'string' ? (
              <span className="ld-drawer-title-info" title={description} aria-hidden>ⓘ</span>
            ) : null}
          </div>
          {showClose ? (
            <button type="button" className="ld-modal-close" aria-label="닫기" onClick={onClose}>×</button>
          ) : null}
        </header>
      ) : null}

      {description && typeof description !== 'string' ? (
        <div className="ld-drawer-description">
          <span className="ld-drawer-description-icon" aria-hidden>i</span>
          <span>{description}</span>
        </div>
      ) : null}

      {banner ? <div className="ld-drawer-banner">{banner}</div> : null}

      {stickyTop ? <div className="ld-drawer-sticky-top">{stickyTop}</div> : null}

      <div className="ld-drawer-body">{children}</div>

      {footer ? (
        <footer className="ld-drawer-footer" data-button-count={buttonCount ?? undefined}>
          {footer}
        </footer>
      ) : null}
    </div>
  );

  return (
    <div
      className={overlayCls}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => overlayClose && e.target === e.currentTarget && onClose?.()}
    >
      <aside
        className={drawerCls}
        style={drawerStyle}
        data-width-mode={widthMode}
        data-scrollable={scrollable ? undefined : 'false'}
        data-show-scrollbar={showScrollbar ? undefined : 'false'}
        {...rest}
      >
        {main}
        {nested}
      </aside>
    </div>
  );
}

// ============================================================
// Drawer.AccentBlock — 강조 영역 (좌측 accent border + 연한 파랑 bg)
// ============================================================
function AccentBlock({ title, children, className = '', ...rest }) {
  return (
    <div className={`ld-drawer-accent ${className}`} {...rest}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
}
Drawer.AccentBlock = AccentBlock;

// ============================================================
// Drawer.Nested — main drawer 우측에 붙는 sub-drawer
// ============================================================
function Nested({ title, children, footer, onClose, showClose = true, className = '', ...rest }) {
  return (
    <aside className={`ld-drawer-nested ${className}`} {...rest}>
      {(title || showClose) ? (
        <header className="ld-drawer-header">
          {title ? <h3 className="ld-drawer-title" style={{ fontSize: 16 }}>{title}</h3> : <span/>}
          {showClose ? (
            <button type="button" className="ld-modal-close" aria-label="닫기" onClick={onClose}>×</button>
          ) : null}
        </header>
      ) : null}
      <div className="ld-drawer-body">{children}</div>
      {footer ? <footer className="ld-drawer-footer">{footer}</footer> : null}
    </aside>
  );
}
Drawer.Nested = Nested;

// ============================================================
// Drawer.TableWrap — body 안에서 좌우 스크롤이 필요한 테이블 래퍼
// (좌우 스크롤은 테이블만 갖도록 한다는 Scroll 규칙)
// ============================================================
function TableWrap({ className = '', children, ...rest }) {
  return (
    <div className={`ld-drawer-table-wrap ${className}`} {...rest}>{children}</div>
  );
}
Drawer.TableWrap = TableWrap;

export default Drawer;
