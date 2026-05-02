// v2.26.0 — multi-select popover 가 새 2-col 레이아웃(목록선택/직접입력 모드 토글)
//           으로 리디자인됨. 본 통합 컴포넌트의 mode='multi' 도 FilterPopoverMulti 와
//           호환되도록 prop signature 유지. resetBtn show 조건은
//             resetBtn.hidden = count === 0 && _lastAppliedJSON === '{}'
//           로 통일 (전체 필터 0 chip 과 동일).
/**
 * FilterField — 데이터 리스트 페이지 필터의 통합 컴포넌트 (셀렉트 버튼 + 팝오버 + 모든 동작)
 *
 * 데모(scm hub/index.html, sku-management.html) 에서 확정된 모든 필터 동작을 한 컴포넌트로 정리:
 *   1) Floating-label 모션 (placeholder ↔ filled)
 *   2) 단일/다중/코드입력 3가지 mode
 *   3) "전체"(id='all') 자동 처리 → placeholder 상태로 매핑 (라벨 숨김 + 필터 타이틀 회색)
 *   4) 단일 선택: 검색바/초기화 버튼 미노출, 항목 우측 ✓, 선택 시 자동 닫힘
 *   5) 다중 선택: 검색바 + "선택됨" 섹션 + 초기화, 선택 후 팝오버 유지
 *   6) 코드입력: 멀티라인 textarea (엑셀 paste 지원), N/200 카운터, "[첫값] 외 N-1" 표시
 *   7) Joined-group 활성 시 우측 보더 검정 (FilterFieldGroup 사용 시)
 *   8) 외부 클릭 / Esc / 다른 필터 클릭 → 닫힘
 *   9) 단일 선택 popover min-width = 필터 버튼 가로 (긴 라벨 필터 잘림 방지)
 *
 * Usage:
 *   <FilterField mode="single" label="매입형태" required
 *     options={[{ id:'p1', label:'매입' }, { id:'p2', label:'사입' }]}  // 전체 자동 prepend
 *     onChange={(item) => …} />
 *
 *   <FilterField mode="multi" label="브랜드"
 *     options={[{ id:'b1', label:'브랜드 A' }, …]}
 *     onChange={(items) => …} />
 *
 *   <FilterField mode="codeinput" label="UID" maxLines={200}
 *     onChange={(lines) => …} />
 *
 *   <FilterFieldGroup>
 *     <FilterField mode="single" label="매입형태" required … />
 *     <FilterField mode="single" label="제조구분" … />
 *   </FilterFieldGroup>
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const ALL_OPTION = { id: 'all', label: '전체' };

/* ---------- 인접 필터를 한 덩어리로 묶는 그룹 ---------- */
export function FilterFieldGroup({ children, className = '', ...rest }) {
  return (
    <div className={['ld-filter-group', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

/* ---------- 메인 컴포넌트 ---------- */
export function FilterField({
  mode = 'multi',                 // 'single' | 'multi' | 'codeinput'
  label,                          // floating label / placeholder text (= 필터 타이틀명)
  required = false,               // 필수 표시 (파란 점)
  options = [],                   // single/multi: [{id, label, selected?}] (전체는 single 일 때 자동 prepend)
  initialValue,                   // codeinput: 초기 텍스트
  maxLines = 200,                 // codeinput: 최대 코드 줄 수
  placeholder,                    // codeinput: textarea placeholder
  disabledChev = false,           // chev 비활성 톤
  onChange,                       // (selected | items | lines) => void
  className = '',
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ left: 0, top: 0, minWidth: 0 });
  const [items, setItems] = useState(() => {
    if (mode === 'codeinput') return [];
    const withAll = mode === 'single'
      ? [{ ...ALL_OPTION, selected: true }, ...options.map(o => ({ ...o, selected: false }))]
      : options.map(o => ({ ...o, selected: !!o.selected }));
    return withAll;
  });
  const [codeText, setCodeText] = useState(initialValue || '');
  const [search, setSearch] = useState('');
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  /* ----- 표시 텍스트 결정 (셀렉트 버튼 value) ----- */
  const display = useMemo(() => {
    if (mode === 'codeinput') {
      const lines = codeText.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return { state: 'placeholder', text: label };
      if (lines.length === 1) return { state: 'filled', text: lines[0] };
      return { state: 'filled', text: lines[0] + ' 외 ' + (lines.length - 1) };
    }
    const sel = items.filter(i => i.selected);
    if (sel.length === 0 || (mode === 'single' && sel[0]?.id === 'all')) {
      return { state: 'placeholder', text: label };
    }
    if (sel.length === 1) return { state: 'filled', text: sel[0].label };
    return { state: 'filled', text: sel[0].label + ' 외 ' + (sel.length - 1) };
  }, [mode, items, codeText, label]);

  /* ----- 위치 계산 ----- */
  const positionPopover = useCallback(() => {
    const btn = buttonRef.current;
    const pop = popoverRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const isSingleList = mode === 'single';
    const minWidth = isSingleList ? rect.width : 0;
    let left = rect.left;
    const popoverWidth = pop?.offsetWidth || (mode === 'codeinput' ? 280 : 260);
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }
    setPopoverPos({ left, top: rect.bottom + 4, minWidth });
  }, [mode]);

  /* ----- 외부 클릭 / Esc / 스크롤 처리 ----- */
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(positionPopover);
    const onDoc = (e) => {
      if (popoverRef.current?.contains(e.target)) return;
      if (buttonRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onScroll = () => positionPopover();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, positionPopover]);

  /* ----- 토글 핸들러 ----- */
  const handleToggleItem = (id) => {
    setItems(prev => {
      let next;
      if (mode === 'single') {
        const target = prev.find(i => i.id === id);
        const wasSel = target?.selected;
        next = prev.map(i => ({ ...i, selected: i.id === id ? !wasSel : false }));
      } else {
        next = prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i);
      }
      // emit
      const selected = next.filter(i => i.selected);
      onChange && onChange(mode === 'single' ? (selected[0] || null) : selected);
      // 단일 선택은 항목 클릭 후 자동 닫힘
      if (mode === 'single') {
        const newlySel = next.find(i => i.id === id)?.selected;
        if (newlySel) setTimeout(() => setOpen(false), 0);
      }
      return next;
    });
  };

  const handleReset = () => {
    setItems(prev => prev.map(i => ({ ...i, selected: false })));
    onChange && onChange(mode === 'single' ? null : []);
  };

  const handleCodeChange = (val) => {
    // 200줄 초과 시 잘라냄
    const lines = val.split('\n');
    let kept = []; let codeCount = 0;
    for (const ln of lines) {
      if (ln.trim()) { if (codeCount >= maxLines) break; codeCount++; }
      kept.push(ln);
    }
    const next = kept.join('\n');
    setCodeText(next);
    const validLines = next.split('\n').map(l => l.trim()).filter(Boolean);
    onChange && onChange(validLines);
  };

  const handleCodeReset = () => {
    setCodeText('');
    onChange && onChange([]);
  };

  /* ----- 렌더 ----- */
  const filtered = useMemo(() => {
    if (mode === 'codeinput') return [];
    const q = search.trim().toLowerCase();
    return q ? items.filter(it => it.label.toLowerCase().includes(q)) : items;
  }, [items, search, mode]);

  const codeLines = codeText.split('\n').map(l => l.trim()).filter(Boolean).length;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={['ld-filter-select', className].filter(Boolean).join(' ')}
        data-state={display.state}
        data-chev={disabledChev ? 'disabled' : undefined}
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        {...rest}
      >
        <span className="label">
          {label}
          {required && <span className="req-dot" aria-label="필수" />}
        </span>
        <span className="value">{display.text}</span>
        <svg className="chev" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 8L10 14L16 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="ld-filter-popover-root is-open"
          style={{ position: 'fixed', left: popoverPos.left, top: popoverPos.top, zIndex: 200 }}
        >
          {mode === 'codeinput' ? (
            <PopoverCodeInput
              value={codeText} maxLines={maxLines}
              placeholder={placeholder || '값을 줄바꿈으로 구분해 입력'}
              count={codeLines}
              onChange={handleCodeChange}
              onReset={handleCodeReset}
            />
          ) : (
            <PopoverList
              mode={mode}
              items={filtered} allItems={items}
              search={search} onSearchChange={setSearch}
              onToggle={handleToggleItem}
              onReset={handleReset}
              minWidth={popoverPos.minWidth}
            />
          )}
        </div>
      )}
    </>
  );
}

/* ---------- 내부 팝오버 — Code input ---------- */
function PopoverCodeInput({ value, maxLines, placeholder, count, onChange, onReset }) {
  const taRef = useRef(null);
  useEffect(() => { setTimeout(() => taRef.current?.focus(), 0); }, []);
  return (
    <div className="ld-filter-popover ld-filter-popover--codeinput">
      <div className="ld-filter-popover-body">
        <div className="ld-filter-popover-textarea">
          <textarea ref={taRef} value={value} placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)} />
        </div>
        <div className="ld-filter-popover-counter">
          <span>{count}</span><span className="total">/{maxLines}</span>
        </div>
      </div>
      <div className="ld-filter-popover-footer">
        <button type="button" className="ld-filter-popover-reset" onClick={onReset}>초기화</button>
      </div>
    </div>
  );
}

/* ---------- 내부 팝오버 — List (single / multi) ---------- */
function PopoverList({ mode, items, allItems, search, onSearchChange, onToggle, onReset, minWidth }) {
  const isSingle = mode === 'single';
  const inpRef = useRef(null);
  useEffect(() => { if (!isSingle) setTimeout(() => inpRef.current?.focus(), 0); }, [isSingle]);

  const selected = items.filter(i => i.selected);
  const others = items.filter(i => !i.selected);

  return (
    <div
      className={['ld-filter-popover', 'ld-filter-popover--list', isSingle && 'ld-filter-popover--list-single'].filter(Boolean).join(' ')}
      style={isSingle && minWidth ? { minWidth } : undefined}
    >
      {!isSingle && (
        <div className="ld-filter-popover-search">
          <div className="ld-filter-popover-search-row">
            <svg className="ic-search" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12 12L16.5 16.5M13.5 8.5C13.5 11.2614 11.2614 13.5 8.5 13.5C5.73858 13.5 3.5 11.2614 3.5 8.5C3.5 5.73858 5.73858 3.5 8.5 3.5C11.2614 3.5 13.5 5.73858 13.5 8.5Z"
                stroke="currentColor" strokeWidth="1.4" fill="none"/>
            </svg>
            <input ref={inpRef} value={search} placeholder="검색"
              onChange={(e) => onSearchChange(e.target.value)} />
            {search && (
              <svg className="ic-clear" viewBox="0 0 20 20" aria-hidden="true"
                onClick={() => onSearchChange('')}>
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              </svg>
            )}
          </div>
        </div>
      )}

      <div className="ld-filter-popover-list-body">
        {isSingle ? (
          items.map(it => (
            <div key={it.id} className="ld-filter-popover-item-row">
              <div
                className="ld-filter-popover-item ld-filter-popover-item--single"
                data-selected={it.selected ? 'true' : 'false'}
                onClick={(e) => { e.stopPropagation(); onToggle(it.id); }}
              >
                <span className="label">{it.label}</span>
                {it.selected && (
                  <svg className="check" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8L7 12L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            {selected.length > 0 && <div className="ld-filter-popover-section-label">선택됨</div>}
            {selected.map(it => (
              <ListItem key={it.id} item={it} onToggle={onToggle} />
            ))}
            {others.map(it => (
              <ListItem key={it.id} item={it} onToggle={onToggle} />
            ))}
          </>
        )}
      </div>

      {!isSingle && (
        <div className="ld-filter-popover-footer">
          <button type="button" className="ld-filter-popover-reset" onClick={onReset}>초기화</button>
        </div>
      )}
    </div>
  );
}

function ListItem({ item, onToggle }) {
  return (
    <div className="ld-filter-popover-item-row">
      <div
        className="ld-filter-popover-item"
        data-selected={item.selected ? 'true' : 'false'}
        onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
      >
        <span className="ld-data-table-cb" aria-checked={item.selected ? 'true' : 'false'} role="checkbox" />
        <span className="label">{item.label}</span>
      </div>
    </div>
  );
}

export default FilterField;
