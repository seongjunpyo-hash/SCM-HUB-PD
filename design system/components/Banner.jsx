/**
 * Layer Desktop — Banner
 * --------------------------------------------------------------
 * Figma node: 9903:4460
 *
 * variant: info | warning | critical
 * 옵션:    title, action(button), dismissible (×), icon override
 *
 * Usage:
 *   <Banner variant="info">자동 매핑 2건 완료</Banner>
 *
 *   <Banner variant="warning" title="검수 필요"
 *           action={<Button size="sm" appearance="ghost">확인하기</Button>}
 *           onClose={...}>
 *     소비기한 정보가 누락된 SKU 1건이 있습니다.
 *   </Banner>
 *
 *   <Banner variant="critical" title="등록 실패" dismissible>
 *     필수 항목이 입력되지 않았습니다.
 *   </Banner>
 */
import React from 'react';

const VARIANT_CLASS = {
  info:     'ld-banner-info',
  warning:  'ld-banner-warning',
  critical: 'ld-banner-critical',
};

const DEFAULT_ICON = {
  info:     'i',
  warning:  '!',
  critical: '×',
};

export function Banner({
  variant = 'info',
  title,
  icon,
  action,
  onClose,
  dismissible = false,
  children,
  className = '',
  ...rest
}) {
  const cls = ['ld-banner', VARIANT_CLASS[variant] || VARIANT_CLASS.info, className]
    .filter(Boolean).join(' ');

  return (
    <div className={cls} role={variant === 'critical' ? 'alert' : 'status'} {...rest}>
      <span className="ld-banner-icon" aria-hidden>
        {icon ?? DEFAULT_ICON[variant]}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <strong style={{ display: 'block', fontWeight: 600, marginBottom: 2 }}>
            {title}
          </strong>
        ) : null}
        <div style={{ color: 'var(--ld-fg)' }}>{children}</div>
      </div>

      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}

      {(onClose || dismissible) ? (
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          style={{
            all: 'unset', cursor: 'pointer',
            color: 'var(--ld-fg-low)', padding: 4,
            flexShrink: 0,
          }}
        >×</button>
      ) : null}
    </div>
  );
}

export default Banner;
