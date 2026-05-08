/**
 * scm-collapsible-card — React twin
 */

import { useState } from 'react';

const MinusIcon = (
  <svg className="minus" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PlusIcon = (
  <svg className="plus" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default function CollapsibleCard({
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onToggle,
  head,                     // ReactNode
  children,
  className = '',
  ...rest
}) {
  const [internal, setInternal] = useState(defaultCollapsed);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internal;

  function handleToggle() {
    const next = !collapsed;
    if (controlledCollapsed === undefined) setInternal(next);
    if (onToggle) onToggle(next);
  }

  const cls = [
    'scm-collapsible-card',
    collapsed && 'is-collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      <div className="scm-collapsible-card__head" onClick={handleToggle}>
        <div className="scm-collapsible-card__head-left">{head}</div>
        <span className="scm-collapsible-card__toggle">
          {MinusIcon}
          {PlusIcon}
        </span>
      </div>
      <div className="scm-collapsible-card__body">
        {children}
      </div>
    </div>
  );
}
