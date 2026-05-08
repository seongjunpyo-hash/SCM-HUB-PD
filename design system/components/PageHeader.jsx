/**
 * Layer Desktop — Page Header
 * --------------------------------------------------------------
 * Figma node: 8096:4360 (pageHeader, pageHeader sub: actions)
 *
 * Usage:
 *   <PageHeader
 *     title="SKU 생성/관리"
 *     meta={['홈', 'SCM HUB', 'SKU 관리']}
 *     actions={<><Button variant="secondary">취소</Button><Button>등록</Button></>}
 *   />
 */
import React from 'react';

export function PageHeader({ title, meta, actions, collapsed = false, className = '', ...rest }) {
  if (collapsed) {
    return (
      <div className={`ld-page-header ld-page-header-collapsed ${className}`} {...rest}>
        <h1 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>{actions}</div>
      </div>
    );
  }
  return (
    <header className={`ld-page-header ${className}`} {...rest}>
      <div className="ld-page-header-row">
        <div style={{ minWidth: 0 }}>
          {meta && meta.length ? (
            <div className="ld-page-header-meta">
              {meta.map((m, i) => (
                <React.Fragment key={i}>
                  <span>{m}</span>
                  {i < meta.length - 1 ? <span aria-hidden>›</span> : null}
                </React.Fragment>
              ))}
            </div>
          ) : null}
          <h1>{title}</h1>
        </div>
        {actions ? <div className="ld-page-header-actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export default PageHeader;
