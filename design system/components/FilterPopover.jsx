// v2.26.0 — Multi-select 2-col 레이아웃(목록선택/직접입력 모드 토글, opt-row--sel light-blue,
//           textarea cursor-preserving enforceMax) 추가. 기존 List/CodeInput variant 는 그대로 유지.
/**
 * FilterPopover — 필터 셀렉트 클릭 시 펼쳐지는 팝오버 (Figma SCM Hub)
 *
 * 4 variants:
 *   1) <FilterPopoverCodeInput>   280×292 — 멀티라인 코드 입력 (UID/SKU/바코드 bulk paste, 200/200 카운터)
 *   2) <FilterPopoverList>        260w   — 검색 + 체크박스 리스트
 *   3) <FilterPopoverList> + selected items — 선택됨 섹션 (data-selected="true")
 *   4) <FilterPopoverMulti>       (v2.26) 모드 토글(목록선택/직접입력) + 좌우 2단(검색결과 / 선택됨)
 *      - 선택됨 컬럼: light-blue bg #F0F7FF / hover #E2F1FF / 체크박스 없이 ✓ 마크
 *      - "전체" auto-select: 선택 0 일 때 자동 활성화
 *      - 직접입력 모드: textarea 에 ta.value 직접 셋팅 + setSelectionRange 로 cursor 점프 방지
 *
 * 모두 footer 에 "초기화" 버튼 포함.
 *
 * Spec : design-system/layer-desktop.css §"Filter Popover" + §"v2.26.0 Multi-select 필터 팝오버"
 */
import React, { useState, useRef, useEffect } from 'react';
import { DataTableCheckbox } from './DataTable.jsx';

/* ---------- 1. CodeInput (멀티라인 코드 입력) ---------- */
export function FilterPopoverCodeInput({
  value = '',
  onChange,
  maxLength = 200,
  placeholder = '',
  onReset,
  className = '',
  ...rest
}) {
  const [val, setVal] = useState(value);
  const isControlled = onChange !== undefined;
  const current = isControlled ? value : val;

  const handleChange = (e) => {
    const next = e.target.value.slice(0, maxLength);
    if (isControlled) onChange(next);
    else setVal(next);
  };
  const handleReset = () => {
    if (isControlled) onChange('');
    else setVal('');
    onReset && onReset();
  };

  return (
    <div className={['ld-filter-popover ld-filter-popover--codeinput', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ld-filter-popover-body">
        <div className="ld-filter-popover-textarea">
          <textarea
            value={current}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        </div>
        <div className="ld-filter-popover-counter">
          <span>{current.length}</span>
          <span className="total">/{maxLength}</span>
        </div>
      </div>
      <div className="ld-filter-popover-footer">
        <button type="button" className="ld-filter-popover-reset" onClick={handleReset}>초기화</button>
      </div>
    </div>
  );
}

/* ---------- 2/3. List (검색 + 체크박스 리스트) ---------- */
export function FilterPopoverList({
  items = [],            // [{ id, label, selected }]
  searchValue = '',
  onSearchChange,
  searchPlaceholder = '검색',
  selectedSectionLabel = '선택됨',
  onItemToggle,
  onReset,
  className = '',
  ...rest
}) {
  const selected = items.filter(i => i.selected);
  const others = items.filter(i => !i.selected);
  const hasSelection = selected.length > 0;

  return (
    <div className={['ld-filter-popover ld-filter-popover--list', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ld-filter-popover-search">
        <div className="ld-filter-popover-search-row">
          <svg className="ic-search" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12 12L16.5 16.5M13.5 8.5C13.5 11.2614 11.2614 13.5 8.5 13.5C5.73858 13.5 3.5 11.2614 3.5 8.5C3.5 5.73858 5.73858 3.5 8.5 3.5C11.2614 3.5 13.5 5.73858 13.5 8.5Z"
              stroke="currentColor" fill="none"/>
          </svg>
          <input
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          {searchValue && (
            <svg className="ic-clear" viewBox="0 0 20 20" aria-hidden="true"
                 onClick={() => onSearchChange && onSearchChange('')}>
              <path d="M5 5L10 10M10 10L15 15M10 10L5 15M10 10L15 5" stroke="currentColor" fill="none"/>
            </svg>
          )}
        </div>
      </div>

      <div className="ld-filter-popover-list-body">
        {hasSelection && (
          <div className="ld-filter-popover-section-label">{selectedSectionLabel}</div>
        )}
        {selected.map(it => (
          <div key={it.id} className="ld-filter-popover-item-row">
            <div className="ld-filter-popover-item" data-selected="true"
                 onClick={() => onItemToggle && onItemToggle(it.id, false)}>
              <DataTableCheckbox checked={true}/>
              <span className="label">{it.label}</span>
            </div>
          </div>
        ))}
        {others.map(it => (
          <div key={it.id} className="ld-filter-popover-item-row">
            <div className="ld-filter-popover-item"
                 onClick={() => onItemToggle && onItemToggle(it.id, true)}>
              <DataTableCheckbox checked={false}/>
              <span className="label">{it.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ld-filter-popover-footer">
        <button type="button" className="ld-filter-popover-reset" onClick={onReset}>초기화</button>
      </div>
    </div>
  );
}

/* ---------- 4. Multi-select (v2.26) — 모드 토글 + 좌우 2단 ---------- */
/**
 * <FilterPopoverMulti>
 *   items                : [{ id, label, selected }]
 *   mode                 : 'list' | 'code'  (controlled, default 'list')
 *   onModeChange         : (next) => void
 *   searchValue / onSearchChange
 *   onItemToggle(id, nextSel)
 *   codeValue / onCodeChange  (직접입력 모드)
 *   maxLines             : 1000  (기본)
 *   onReset              : () => void
 *
 * "전체" auto-select 룰: 선택된 항목이 0 일 때 onAutoSelectAll() 호출 (옵션).
 */
export function FilterPopoverMulti({
  items = [],
  mode = 'list',
  onModeChange,
  searchValue = '',
  onSearchChange,
  onItemToggle,
  codeValue = '',
  onCodeChange,
  maxLines = 1000,
  onReset,
  className = '',
  ...rest
}) {
  const taRef = useRef(null);

  // cursor-preserving enforceMax — 초과 시에만 자르고 setSelectionRange 로 cursor 유지
  const enforceMax = (val, prevSelStart) => {
    const lines = val.split('\n');
    if (lines.length <= maxLines) return val;
    return lines.slice(0, maxLines).join('\n');
  };

  const handleCodeInput = (e) => {
    const ta = e.target;
    const selStart = ta.selectionStart;
    const next = enforceMax(ta.value, selStart);
    if (next !== ta.value) {
      ta.value = next; // value 직접 셋팅 (paste/delete 시 cursor 점프 방지)
      try { ta.setSelectionRange(Math.min(selStart, next.length), Math.min(selStart, next.length)); } catch {}
    }
    onCodeChange && onCodeChange(next);
  };

  const selected = items.filter(i => i.selected);
  const filtered = searchValue
    ? items.filter(i => i.label.toLowerCase().includes(searchValue.toLowerCase()))
    : items;
  const codeLines = (codeValue || '').split('\n').filter(l => l.trim()).length;

  return (
    <div
      className={['ld-filter-popover ld-filter-popover--multi', className].filter(Boolean).join(' ')}
      data-pop-mode={mode === 'code' ? 'code' : undefined}
      {...rest}
    >
      <div className="mp-af-mode-row" data-pop-mode-row>
        <label>
          <input type="radio" name="ld-pop-mode" checked={mode === 'list'} onChange={() => onModeChange && onModeChange('list')} />
          목록 선택
        </label>
        <label>
          <input type="radio" name="ld-pop-mode" checked={mode === 'code'} onChange={() => onModeChange && onModeChange('code')} />
          직접입력
        </label>
      </div>

      {mode === 'list' ? (
        <>
          <div className="mp-af-search-bar">
            <div className="row">
              <svg className="ic-search" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M12 12L16.5 16.5M13.5 8.5C13.5 11.2614 11.2614 13.5 8.5 13.5C5.73858 13.5 3.5 11.2614 3.5 8.5C3.5 5.73858 5.73858 3.5 8.5 3.5C11.2614 3.5 13.5 5.73858 13.5 8.5Z"
                  stroke="currentColor" fill="none"/>
              </svg>
              <input value={searchValue} placeholder="검색"
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)} />
              {searchValue && (
                <svg className="ic-clear" viewBox="0 0 20 20" aria-hidden="true"
                     onClick={() => onSearchChange && onSearchChange('')}>
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" fill="none"/>
                </svg>
              )}
            </div>
          </div>

          <div className="mp-af-2col">
            <div className="col">
              <div className="col-label">검색결과 ({filtered.length})</div>
              <div className="col-inner">
                {filtered.length === 0 ? (
                  <div className="col-empty">검색 결과 없음</div>
                ) : filtered.map(it => (
                  <div key={it.id} className="opt-row" data-selected={it.selected ? 'true' : 'false'}
                       onClick={() => onItemToggle && onItemToggle(it.id, !it.selected)}>
                    <span className="pop-cb"/>
                    <span className="label">{it.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {selected.length > 0 && (
              <>
                <div className="col-divider"/>
                <div className="col">
                  <div className="col-label">선택됨 ({selected.length})</div>
                  <div className="col-inner">
                    {selected.map(it => (
                      <div key={it.id} className="opt-row opt-row--sel"
                           onClick={() => onItemToggle && onItemToggle(it.id, false)}>
                        <span className="label">{it.label}</span>
                        <svg className="ic-check" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M4 10L8.5 14.5L16 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="mp-af-codeinput-pane">
          <div className="ta-wrap">
            <textarea
              ref={taRef}
              defaultValue={codeValue}
              onInput={handleCodeInput}
              onChange={handleCodeInput}
              placeholder="값을 줄바꿈으로 구분해 입력"
            />
          </div>
          <div className="counter">
            <span>{codeLines}</span><span className="total">/{maxLines}</span>
          </div>
        </div>
      )}

      <div className="ld-filter-popover-footer">
        <button type="button" className="ld-filter-popover-reset" onClick={onReset}>초기화</button>
      </div>
    </div>
  );
}

export default FilterPopoverList;
