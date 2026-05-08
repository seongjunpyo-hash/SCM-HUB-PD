/**
 * Layer Desktop — Workspace Tabs (top app tabs)
 * --------------------------------------------------------------
 * Figma node: 4849:90
 * Sub: Tab / closeButton / scrollLeftButton / scrollRightButton
 *
 * Usage:
 *   <WorkspaceTabs
 *     activeId="t1"
 *     onSelect={setActive}
 *     onClose={handleClose}
 *     tabs={[
 *       { id: 't1', label: 'SKU 등록' },
 *       { id: 't2', label: 'SKU 관리' },
 *       { id: 't3', label: '재고이동 등록', closable: true },
 *     ]}
 *   />
 */
import React, { useRef } from 'react';

export function WorkspaceTabs({
  tabs = [],
  activeId,
  onSelect,
  onClose,
  className = '',
  ...rest
}) {
  const scrollRef = useRef(null);

  const scroll = (delta) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className={`ld-wt ${className}`} {...rest} style={{ display: 'flex', alignItems: 'stretch' }}>
      <button
        type="button"
        className="ld-wt-tab-close"
        aria-label="왼쪽 스크롤"
        onClick={() => scroll(-200)}
        style={{ width: 32, height: 36, flexShrink: 0 }}
      >‹</button>
      <div ref={scrollRef} style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activeId}
            disabled={t.disabled}
            className="ld-wt-tab"
            onClick={() => onSelect?.(t.id)}
          >
            {t.icon ? <span aria-hidden>{t.icon}</span> : null}
            <span className="ld-wt-tab-label">{t.label}</span>
            {t.closable !== false ? (
              <button
                type="button"
                className="ld-wt-tab-close"
                aria-label={`${t.label} 탭 닫기`}
                onClick={(e) => { e.stopPropagation(); onClose?.(t.id); }}
              >×</button>
            ) : null}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ld-wt-tab-close"
        aria-label="오른쪽 스크롤"
        onClick={() => scroll(200)}
        style={{ width: 32, height: 36, flexShrink: 0 }}
      >›</button>
    </div>
  );
}

export default WorkspaceTabs;
