/**
 * Layer Desktop — LNB Navigation
 * --------------------------------------------------------------
 * Figma nodes: 7957:422 (메인), 662:52166 (종합)
 *
 * Usage:
 *   <Nav
 *     env={{ label: 'STG', color: 'purple' }}
 *     items={[
 *       { id: 'sku', label: 'SKU 관리', icon: '📦', children: [
 *         { id: 'sku-list',   label: 'SKU 생성/관리', count: 12 },
 *         { id: 'sku-detail', label: 'SKU 상세' },
 *       ]},
 *       { id: 'inv', label: '재고 관리', icon: '📊' },
 *     ]}
 *     activeId="sku-list"
 *     onSelect={setActiveId}
 *   />
 */
import React from 'react';

export function Nav({
  items = [],
  activeId,
  onSelect,
  collapsed = false,
  dark = false,
  env,
  header,
  footer,
  className = '',
  ...rest
}) {
  const cls = ['ld-nav', collapsed ? 'ld-nav-collapsed' : '', dark ? 'ld-nav-dark' : '', className]
    .filter(Boolean).join(' ');
  return (
    <nav className={cls} {...rest}>
      {(env || header) ? (
        <div className="ld-nav-header">
          {env ? (
            <button type="button" className="ld-nav-env-selector">
              <span className="ld-nav-env-label">{env.label}</span>
              {!collapsed ? <span style={{ marginLeft: 4 }}>▾</span> : null}
            </button>
          ) : null}
          {header}
        </div>
      ) : null}

      <div className="ld-nav-section" style={{ flex: 1, overflow: 'auto' }}>
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            activeId={activeId}
            onSelect={onSelect}
            collapsed={collapsed}
          />
        ))}
      </div>

      {footer ? <div className="ld-nav-section">{footer}</div> : null}
    </nav>
  );
}

function NavItem({ item, activeId, onSelect, collapsed, depth = 0 }) {
  const isActive = item.id === activeId;
  const hasChildren = item.children && item.children.length > 0;
  const cls = [
    'ld-nav-item',
    depth === 0 ? 'ld-nav-lv1' : 'ld-nav-lv2',
    isActive ? 'ld-nav-item-active' : '',
    isActive && depth > 0 ? 'ld-nav-lv2-active' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <button
        type="button"
        className={cls}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => onSelect?.(item.id)}
        title={collapsed ? item.label : undefined}
      >
        {item.icon ? <span aria-hidden style={{ width: 20, textAlign: 'center' }}>{item.icon}</span> : null}
        {!collapsed ? <span>{item.label}</span> : null}
        {!collapsed && typeof item.count === 'number' ? (
          <span className="ld-nav-count">{item.count}</span>
        ) : null}
      </button>
      {!collapsed && hasChildren && isActive ? (
        item.children.map((c) => (
          <NavItem key={c.id} item={c} activeId={activeId} onSelect={onSelect} collapsed={collapsed} depth={depth + 1} />
        ))
      ) : null}
    </>
  );
}

export default Nav;
