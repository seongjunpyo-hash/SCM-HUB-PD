/**
 * InfoBanner — Figma SCM Hub gray 변형 (회색 톤 안내 배너)
 *
 * 구조:
 *   <InfoBanner>
 *     <InfoBannerIcon />               (default: filled gray alertCircle)
 *     <InfoBannerBody>
 *       <InfoBannerTitle>...</InfoBannerTitle>
 *       <InfoBannerText>plain text + <br/></InfoBannerText>
 *     </InfoBannerBody>
 *     <InfoBannerToggle />
 *   </InfoBanner>
 *
 * Props:
 *   collapsible : 토글 버튼 표시 (default true)
 *   defaultCollapsed : 초기 접힘 상태
 *
 * Spec :
 *   - bg rgba(224,224,224,0.20) / border 1px #EBEBEB / padding 16 12
 *   - icon 20×20 filled gray (#8A8A8A)
 *   - title 15/500 black, body 14/400 black
 */
import React, { useState } from 'react';

export function InfoBanner({
  title,
  children,
  collapsible = true,
  defaultCollapsed = false,
  icon,
  className = '',
  ...rest
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const cls = ['ld-info-banner', collapsed && 'is-collapsed', className].filter(Boolean).join(' ');

  return (
    <div className={cls} {...rest}>
      <span className="ld-info-banner-icon">
        {icon || (
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 5.25C10.4142 5.25 10.75 5.58579 10.75 6V10.5C10.75 10.9142 10.4142 11.25 10 11.25C9.58579 11.25 9.25 10.9142 9.25 10.5V6C9.25 5.58579 9.58579 5.25 10 5.25ZM10 14.75C10.5523 14.75 11 14.3023 11 13.75C11 13.1977 10.5523 12.75 10 12.75C9.44772 12.75 9 13.1977 9 13.75C9 14.3023 9.44772 14.75 10 14.75Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
      <div className="ld-info-banner-body">
        {title && <div className="ld-info-banner-title">{title}</div>}
        <div className="ld-info-banner-text">{children}</div>
      </div>
      {collapsible && (
        <button
          type="button"
          className="ld-info-banner-toggle"
          aria-label="안내 접기/펼치기"
          onClick={() => setCollapsed(c => !c)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d={collapsed
                ? 'M4 8L10 14L16 8'
                : 'M16 13L10.2121 7.2121C10.095 7.09497 9.90503 7.09497 9.78787 7.2121L4 13'
              }
              stroke="currentColor" fill="none"
              strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default InfoBanner;
