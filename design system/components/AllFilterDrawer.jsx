/**
 * AllFilterDrawer — "전체 필터" chip 클릭 시 펼쳐지는 좌측 슬라이드 드로어
 *
 * 모든 필터(single/multi/codeinput)를 한눈에 보고 편집.
 * GNB(64) 아래 + LNB(56) 뒤에서 슬라이드 — 딤드 X, 그림자로만 깊이감.
 * 다중 선택 섹션은 옵션 많을 때 검색 + 체크박스 리스트 (max-height 240, 스크롤).
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <AllFilterDrawer
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     sections={[
 *       { key:'season', label:'시즌', mode:'single', required:true,
 *         options:[{id:'all',label:'전체',selected:true}, {id:'s1',label:'24SS'}, ...] },
 *       { key:'brand',  label:'브랜드', mode:'multi',
 *         options:[{id:'b1',label:'브랜드 A'}, ...] },
 *       { key:'uid',    label:'UID', mode:'codeinput', value:'', maxLines:200 },
 *     ]}
 *     onChange={(key, value) => /* value = item|items|lines */ }
 *     onApply={() => /* 검색 적용 */ }
 *     onReset={() => /* 전체 초기화 */ }
 *   />
 *
 * Spec : design-system/layer-desktop.css §"All-Filter Drawer"
 */
import React, { useState, useMemo, useEffect } from 'react';

export function AllFilterDrawer({
  open = false,
  sections = [],
  onClose,
  onChange,
  onApply,
  onReset,
  title = '전체 필터',
  applyText = '검색 적용',
  resetText = '전체 초기화',
}) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(open);
  // search query per section (multi 만)
  const [searches, setSearches] = useState({});

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setActive(true));
    } else if (mounted) {
      setActive(false);
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <>
      <div className="ld-af-backdrop" onClick={onClose} />
      <aside className={`ld-af-drawer${active ? ' is-open' : ''}`} role="dialog" aria-label={title}>
        <header className="ld-af-header">
          <h2>{title}</h2>
          <button type="button" className="ld-af-close" aria-label="닫기" onClick={onClose}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
            </svg>
          </button>
        </header>

        <div className="ld-af-body">
          {sections.map(sec => (
            <Section
              key={sec.key}
              section={sec}
              search={searches[sec.key] || ''}
              onSearchChange={(q) => setSearches(s => ({ ...s, [sec.key]: q }))}
              onChange={onChange}
            />
          ))}
        </div>

        <footer className="ld-af-footer">
          <button type="button" className="reset-btn" onClick={onReset}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4V8H8M16 16V12H12M4 8C4.5 6 7 3 10 3C13 3 16 5 16 9M16 12C15.5 14 13 17 10 17C7 17 4 15 4 11"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span>{resetText}</span>
          </button>
          <button type="button" className="apply-btn" onClick={onApply}>{applyText}</button>
        </footer>
      </aside>
    </>
  );
}

function Section({ section, search, onSearchChange, onChange }) {
  const { key, label, mode = 'multi', required, options = [], value, maxLines = 200 } = section;

  // Codeinput
  if (mode === 'codeinput') {
    const lines = (value || '').split('\n').map(l => l.trim()).filter(Boolean);
    const handleInput = (e) => {
      // enforce maxLines
      const all = e.target.value.split('\n');
      let kept = []; let n = 0;
      for (const ln of all) { if (ln.trim()) { if (n >= maxLines) break; n++; } kept.push(ln); }
      const next = kept.join('\n');
      onChange && onChange(key, next.split('\n').map(l => l.trim()).filter(Boolean));
      e.target.value = next;
    };
    return (
      <section className="ld-af-section">
        <h3>{label}{required && <span className="req-dot" aria-label="필수"/>}</h3>
        <textarea
          className="ld-af-textarea"
          placeholder={`값을 줄바꿈으로 구분해 입력 (최대 ${maxLines}건)`}
          defaultValue={value}
          onInput={handleInput}
        />
        <div className="ld-af-counter"><strong>{lines.length}</strong>/{maxLines}</div>
      </section>
    );
  }

  // Single — chip 토글
  if (mode === 'single') {
    const handleToggle = (id) => {
      const next = options.map(it => ({ ...it, selected: it.id === id ? !it.selected : false }));
      onChange && onChange(key, next.find(i => i.selected) || null);
    };
    return (
      <section className="ld-af-section">
        <h3>{label}{required && <span className="req-dot" aria-label="필수"/>}</h3>
        <div className="ld-af-options">
          {options.map(it => (
            <button
              key={it.id}
              type="button"
              className="ld-af-chip"
              data-selected={it.selected ? 'true' : 'false'}
              onClick={() => handleToggle(it.id)}
            >{it.label}</button>
          ))}
        </div>
      </section>
    );
  }

  // Multi — 검색 + 체크박스 리스트
  const q = (search || '').toLowerCase();
  const filtered = q ? options.filter(it => it.label.toLowerCase().includes(q)) : options;
  const selected = filtered.filter(i => i.selected);
  const others = filtered.filter(i => !i.selected);

  const handleToggle = (id) => {
    const next = options.map(it => it.id === id ? { ...it, selected: !it.selected } : it);
    onChange && onChange(key, next.filter(i => i.selected));
  };

  return (
    <section className="ld-af-section">
      <h3>{label}{required && <span className="req-dot" aria-label="필수"/>}</h3>
      <div className={`ld-af-search${search ? ' has-q' : ''}`}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12 12L16.5 16.5M13.5 8.5C13.5 11.2614 11.2614 13.5 8.5 13.5C5.73858 13.5 3.5 11.2614 3.5 8.5C3.5 5.73858 5.73858 3.5 8.5 3.5C11.2614 3.5 13.5 5.73858 13.5 8.5Z"
            stroke="currentColor" strokeWidth="1.4" fill="none"/>
        </svg>
        <input
          value={search}
          placeholder={`${label} 검색`}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button type="button" className="clear" aria-label="검색어 지우기" onClick={() => onSearchChange('')}>
            <svg viewBox="0 0 20 20"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/></svg>
          </button>
        )}
      </div>
      <div className="ld-af-list">
        {filtered.length === 0
          ? <div className="ld-af-empty">검색 결과가 없습니다.</div>
          : <>
              {selected.length > 0 && <div className="ld-af-section-label">선택됨</div>}
              {selected.map(it => <Row key={it.id} item={it} onToggle={handleToggle} />)}
              {others.map(it => <Row key={it.id} item={it} onToggle={handleToggle} />)}
            </>
        }
      </div>
    </section>
  );
}

function Row({ item, onToggle }) {
  return (
    <div className="ld-af-row" data-selected={item.selected ? 'true' : 'false'} onClick={() => onToggle(item.id)}>
      <span className="pop-cb"/>
      <span className="label">{item.label}</span>
    </div>
  );
}

export default AllFilterDrawer;
