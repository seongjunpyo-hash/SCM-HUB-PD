/**
 * scm-filter-popover — React twin
 *
 * 4 modes 모두 지원하는 단일 컴포넌트. mode 별로 sub-render.
 */

import { useState, useRef, useEffect } from 'react';

export default function FilterPopover({
  open = false,
  mode = 'list',                 // 'codeinput' | 'list' | 'list-single' | 'multi'
  position,                      // { top, left }
  // codeinput
  textValue = '',
  textMax = 100,
  onTextChange,
  // list / list-single
  items = [],                    // [{ key, label, selected? }]
  onItemToggle,
  // search
  searchQuery = '',
  onSearchChange,
  // footer
  showFooter = true,
  resetLabel = '초기화',
  applyLabel = '적용',
  applyDisabled = false,
  onReset,
  onApply,
  onClose,
  className = '',
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    }
    function onKey(e) { if (e.key === 'Escape' && onClose) onClose(); }
    setTimeout(() => document.addEventListener('click', onDoc, true), 0);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const popCls = ['scm-filter-popover', `scm-filter-popover--${mode}`, className].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className="scm-filter-popover-root is-open" data-pop-mode={mode} style={position}>
      <div className={popCls}>
        {mode === 'codeinput' && (
          <div className="scm-filter-popover__body">
            <div className="scm-filter-popover__textarea">
              <textarea
                value={textValue}
                onChange={(e) => onTextChange && onTextChange(e.target.value)}
                placeholder="코드를 한 줄에 하나씩 입력하세요"
              />
            </div>
            <div className="scm-filter-popover__counter">
              <strong>{textValue.split('\n').filter(Boolean).length}</strong>
              &nbsp;<span className="total">/ {textMax}</span>
            </div>
          </div>
        )}

        {(mode === 'list' || mode === 'list-single') && (
          <>
            {mode === 'list' && (
              <div className="scm-filter-popover__search">
                <div className="scm-filter-popover__search-row">
                  <svg className="ic-search" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" fill="none" />
                    <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="검색"
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="scm-filter-popover__list-body">
              {items.map((it) => (
                <div key={it.key} className="scm-filter-popover__item-row">
                  <div
                    className={[
                      'scm-filter-popover__item',
                      mode === 'list-single' && 'scm-filter-popover__item--single',
                    ].filter(Boolean).join(' ')}
                    data-selected={it.selected ? 'true' : 'false'}
                    onClick={() => onItemToggle && onItemToggle(it.key)}
                  >
                    {mode === 'list' && <span className="pop-cb" />}
                    <span className="label">{it.label}</span>
                    {mode === 'list-single' && it.selected && (
                      <svg className="check" viewBox="0 0 16 16">
                        <path d="M3.45 7.3l3.28 3.28L12.55 4.85" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showFooter && mode !== 'list-single' && (
          <div className="scm-filter-popover__footer">
            <button type="button" className="scm-filter-popover__reset" onClick={onReset}>{resetLabel}</button>
            <button type="button" className="scm-filter-popover__apply" disabled={applyDisabled} onClick={onApply}>{applyLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}
