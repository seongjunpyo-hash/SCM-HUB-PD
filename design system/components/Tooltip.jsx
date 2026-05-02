/**
 * Layer Desktop — Tooltip
 * --------------------------------------------------------------
 * Figma node: 5002:48 (LayerDesktop · Tooltip page)
 *
 * Spec:
 *   - container: min 24px / max 360px / padding 8px / radius 4px / shadow tooltip
 *   - content:   Pretendard 14px / 400 / line-height 1.4
 *   - arrow:     8 × 4px (placement에 따라 회전)
 *   - variant:   black (#1a1a1a / white) / white (white / #000 / 1px low border)
 *   - placement: 13종 — none + top/topStart/topEnd / bottom/bottomStart/bottomEnd
 *                       / left/leftStart/leftEnd / right/rightStart/rightEnd
 *
 * 사용:
 *   // 기본 (hover trigger)
 *   <Tooltip content="설명 텍스트">
 *     <button>?</button>
 *   </Tooltip>
 *
 *   // sticky (제목 + 링크 + 닫기)
 *   <Tooltip
 *     variant="white"
 *     placement="bottomEnd"
 *     sticky
 *     title="알아두세요"
 *     content="SKU 매핑 가이드를 확인하세요."
 *     link={{ href: '/docs/sku-mapping', label: '자세히 보기' }}
 *     defaultOpen
 *   >
 *     <InfoIcon />
 *   </Tooltip>
 *
 *   // controlled
 *   <Tooltip open={open} onOpenChange={setOpen} content="..." trigger="click">
 *     <button>클릭</button>
 *   </Tooltip>
 */
import React, { useState, useId, useRef, useCallback, useEffect } from 'react';

const PLACEMENT_CLASS = {
  none:          '',
  top:           'ld-tooltip-top',
  topStart:      'ld-tooltip-top-start',
  topEnd:        'ld-tooltip-top-end',
  bottom:        'ld-tooltip-bottom',
  bottomStart:   'ld-tooltip-bottom-start',
  bottomEnd:     'ld-tooltip-bottom-end',
  left:          'ld-tooltip-left',
  leftStart:     'ld-tooltip-left-start',
  leftEnd:       'ld-tooltip-left-end',
  right:         'ld-tooltip-right',
  rightStart:    'ld-tooltip-right-start',
  rightEnd:      'ld-tooltip-right-end',
};

const VARIANT_CLASS = {
  black: 'ld-tooltip-black',
  white: 'ld-tooltip-white',
};

/**
 * Placement별 SVG 화살표 (회전 없이 path 자체가 방향에 맞음)
 *  - top    : ▼  viewBox 8 4  M0 0 L4 4 L8 0 Z  (윗변 평평, tip 아래)
 *  - bottom : ▲  viewBox 8 4  M0 4 L4 0 L8 4 Z  (밑변 평평, tip 위)
 *  - left   : ▶  viewBox 4 8  M0 0 L4 4 L0 8 Z  (왼쪽변 평평, tip 오른쪽)
 *  - right  : ◀  viewBox 4 8  M4 0 L0 4 L4 8 Z  (오른쪽변 평평, tip 왼쪽)
 */
function ArrowSvg({ placement }) {
  if (!placement || placement === 'none') return null;
  if (placement.startsWith('top')) {
    return (
      <svg className="ld-tooltip-arrow-svg" viewBox="0 0 8 4" aria-hidden="true">
        <path d="M0 0 L4 4 L8 0 Z" />
      </svg>
    );
  }
  if (placement.startsWith('bottom')) {
    return (
      <svg className="ld-tooltip-arrow-svg" viewBox="0 0 8 4" aria-hidden="true">
        <path d="M0 4 L4 0 L8 4 Z" />
      </svg>
    );
  }
  if (placement.startsWith('left')) {
    return (
      <svg className="ld-tooltip-arrow-svg" viewBox="0 0 4 8" aria-hidden="true">
        <path d="M0 0 L4 4 L0 8 Z" />
      </svg>
    );
  }
  if (placement.startsWith('right')) {
    return (
      <svg className="ld-tooltip-arrow-svg" viewBox="0 0 4 8" aria-hidden="true">
        <path d="M4 0 L0 4 L4 8 Z" />
      </svg>
    );
  }
  return null;
}

/**
 * @param {object} props
 * @param {React.ReactNode}                                    props.children       Anchor 엘리먼트
 * @param {React.ReactNode}                                    props.content        본문 (string 또는 ReactNode)
 * @param {string}                                             [props.title]        제목 (sticky 권장)
 * @param {{ href: string, label: string, onClick?: Function }} [props.link]        외부/내부 링크
 * @param {'black'|'white'}                                    [props.variant]      기본 'black'
 * @param {keyof typeof PLACEMENT_CLASS}                       [props.placement]    기본 'top'
 * @param {boolean}                                            [props.sticky]       닫기 버튼 + 클릭 가능
 * @param {boolean}                                            [props.dismissible]  닫기 버튼 표시
 * @param {boolean}                                            [props.defaultOpen]  uncontrolled 초기값
 * @param {boolean}                                            [props.open]         controlled
 * @param {Function}                                           [props.onOpenChange] (open: boolean) => void
 * @param {'hover'|'focus'|'click'|'manual'}                   [props.trigger]      기본 'hover'. sticky인 경우 'click' 권장
 * @param {boolean}                                            [props.showArrow]    기본 true (placement === 'none' 이면 강제 false)
 * @param {string}                                             [props.className]
 */
export function Tooltip({
  children,
  content,
  title,
  link,
  variant = 'black',
  placement = 'top',
  sticky = false,
  dismissible = false,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  trigger = 'hover',
  showArrow = true,
  className = '',
  ...rest
}) {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : internalOpen;
  const tooltipId = useId();
  const closeTimer = useRef(null);

  const setOpen = useCallback(
    (next) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // hover-trigger close 지연 (sticky 시에는 close 버튼이 있어 무관)
  const handleMouseEnter = () => {
    if (trigger !== 'hover') return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    if (trigger !== 'hover') return;
    if (sticky) return;
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  };
  const handleFocus = () => trigger === 'focus' && setOpen(true);
  const handleBlur  = () => trigger === 'focus' && !sticky && setOpen(false);
  const handleClick = () => trigger === 'click' && setOpen(!open);

  useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), []);

  const placementCls = PLACEMENT_CLASS[placement] ?? PLACEMENT_CLASS.top;
  const variantCls   = VARIANT_CLASS[variant]    ?? VARIANT_CLASS.black;
  const arrowVisible = showArrow && placement !== 'none';
  const stickyCls    = (sticky || dismissible) ? 'ld-tooltip-sticky' : '';

  const cls = ['ld-tooltip', variantCls, placementCls, stickyCls, className]
    .filter(Boolean)
    .join(' ');

  // anchor 위치 계산용 inline-style (placement 그룹별 absolute 좌표)
  const anchorStyle = (() => {
    if (placement === 'none') {
      return { position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)' };
    }
    if (placement.startsWith('top')) {
      return { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)' };
    }
    if (placement.startsWith('bottom')) {
      return { position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)' };
    }
    if (placement.startsWith('left')) {
      return { position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)' };
    }
    if (placement.startsWith('right')) {
      return { position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)' };
    }
    return {};
  })();

  return (
    <span
      className="ld-tooltip-anchor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      aria-describedby={open ? tooltipId : undefined}
    >
      {children}

      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cls}
          style={anchorStyle}
          {...rest}
        >
          {title ? <span className="ld-tooltip-title">{title}</span> : null}
          <span>{content}</span>
          {link ? (
            <a
              className="ld-tooltip-link"
              href={link.href}
              onClick={link.onClick}
              target={link.href?.startsWith('http') ? '_blank' : undefined}
              rel={link.href?.startsWith('http') ? 'noreferrer noopener' : undefined}
            >
              {link.label} →
            </a>
          ) : null}
          {(sticky || dismissible) ? (
            <button
              type="button"
              className="ld-tooltip-close"
              aria-label="툴팁 닫기"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            >
              ×
            </button>
          ) : null}
          {arrowVisible ? (
            <span className="ld-tooltip-arrow">
              <ArrowSvg placement={placement} />
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

export default Tooltip;
