/**
 * Layer Desktop — Tabs
 * --------------------------------------------------------------
 * Figma node: 6914:446
 *
 * type:
 *   - "line"  (기본) — 활성 탭 = 파란 텍스트 + 파란 underline
 *   - "box"   — 각 탭이 독립 bordered 박스, 활성 = 검은 border
 *   - "text"  — 탭 사이에 | divider, 활성 = 굵은 검정
 *
 * size: 's' | 'm' | 'l'
 *
 * 끝에 `>` overflow 버튼: overflow={true|onClick} 또는 자동 (스크롤 가능 시)
 *
 * Usage:
 *   <Tabs type="line" value={tab} onChange={setTab}>
 *     <Tab value="all">전체</Tab>
 *     <Tab value="mapped" count={12}>매핑됨</Tab>
 *   </Tabs>
 *
 *   <Tabs type="box" items={[
 *     { value:'a', label:'label', count:0 },
 *     ...
 *   ]} value={v} onChange={setV} overflow />
 */
import React from 'react';

const TYPE_CLASS = {
  line: 'ld-tabs-line',
  box:  'ld-tabs-box',
  text: 'ld-tabs-text',
};
const SIZE_CLASS = {
  s: 'ld-tab-s',
  m: '',
  l: 'ld-tab-l',
};

export function Tabs({
  type = 'line',
  size = 'm',
  value,
  onChange,
  items,
  overflow = false,
  onOverflowClick,
  className = '',
  children,
  ...rest
}) {
  const cls = ['ld-tabs', TYPE_CLASS[type] || TYPE_CLASS.line, className]
    .filter(Boolean).join(' ');

  const tabsContent = items
    ? items.map((it) => (
        <Tab
          key={it.value}
          value={it.value}
          count={it.count}
          disabled={it.disabled}
          icon={it.icon}
          size={size}
        >
          {it.label}
        </Tab>
      ))
    : React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { size }) : child
      );

  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cls} {...rest}>
        <div role="tablist" className="ld-tabs-list">
          {tabsContent}
        </div>
        {overflow ? (
          <span className="ld-tabs-scrolldim" aria-hidden>
            <button
              type="button"
              className="ld-tabs-overflow"
              aria-label="더 보기"
              onClick={onOverflowClick}
            >›</button>
          </span>
        ) : null}
      </div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext({ value: undefined, onChange: () => {} });

export function Tab({
  value: tabValue,
  size = 'm',
  count,
  icon,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const { value, onChange } = React.useContext(TabsContext);
  const selected = value === tabValue;
  const cls = ['ld-tab', SIZE_CLASS[size] || '', className]
    .filter(Boolean).join(' ');

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      className={cls}
      onClick={() => onChange?.(tabValue)}
      {...rest}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span>{children}</span>
      {typeof count === 'number' ? (
        <span className="ld-tab-count">{count}</span>
      ) : null}
    </button>
  );
}

export default Tabs;
