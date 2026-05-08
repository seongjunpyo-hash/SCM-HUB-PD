/**
 * scm-info-banner — React twin
 */

import { useState } from 'react';

const InfoIcon = (
  <svg className="scm-info-banner__icon" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="currentColor" />
    <path d="M10 6V11" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="10" cy="14" r="0.9" fill="#fff" />
  </svg>
);

const ChevDown = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function InfoBanner({
  title,
  description,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onToggle,
  full = false,
  iconNode = InfoIcon,
  className = '',
  ...rest
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  function handleToggle() {
    const next = !collapsed;
    if (controlledCollapsed === undefined) setInternalCollapsed(next);
    if (onToggle) onToggle(next);
  }

  const cls = [
    'scm-info-banner',
    full && 'scm-info-banner--full',
    collapsed && 'is-collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {iconNode}
      <div className="scm-info-banner__body">
        {title && <div className="scm-info-banner__title">{title}</div>}
        {description && <div className="scm-info-banner__text">{description}</div>}
      </div>
      <button
        type="button"
        className="scm-info-banner__toggle"
        aria-label={collapsed ? '펼치기' : '접기'}
        onClick={handleToggle}
      >
        {ChevDown}
      </button>
    </div>
  );
}
