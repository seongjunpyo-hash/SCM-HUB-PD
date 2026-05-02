/**
 * scm-deploy-popover — React twin (controlled)
 */

export default function DeployPopover({
  open = false,
  options = [
    { state: 'deployed', label: '전개중' },
    { state: 'undeployed', label: '미전개' },
  ],
  current,
  onSelect,
  position,                 // { top, left, minWidth }
  className = '',
}) {
  if (!open) return null;
  return (
    <div
      className={['scm-deploy-popover', 'is-open', className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="전개 여부 변경"
      style={position}
    >
      <ul>
        {options.map((o) => (
          <li
            key={o.state}
            data-deploy-opt={o.state}
            data-current={o.state === current ? 'true' : 'false'}
            onClick={() => { if (onSelect) onSelect(o.state); }}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
