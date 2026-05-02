/**
 * scm-code-popover — React twin
 *
 * controlled 컴포넌트. anchor 위치 계산은 호출처 책임 (또는 useFloating 등).
 */

export default function CodePopover({
  open = false,
  title,
  items = [],
  linked = true,
  copyLabel = '복사',
  onCopy,
  onClose,
  position,                  // { top, left } px
  className = '',
}) {
  if (!open) return null;
  return (
    <>
      <div className="scm-code-popover-backdrop is-open" onClick={onClose} />
      <div
        className={['scm-code-popover', 'is-open', className].filter(Boolean).join(' ')}
        role="dialog"
        style={position}
      >
        <h4>{title}</h4>
        <ul>
          {items.map((v, i) => (
            <li key={i} className={linked ? 'linked' : undefined}>{v}</li>
          ))}
        </ul>
        <div className="scm-code-popover__actions">
          <button type="button" onClick={() => { if (onCopy) onCopy(items); }}>
            {copyLabel} ({items.length})
          </button>
          <button type="button" className="primary" onClick={onClose}>닫기</button>
        </div>
      </div>
    </>
  );
}
