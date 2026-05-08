/**
 * scm-filter-drawer — React twin (controlled)
 *
 * 본 컴포넌트는 frame 만 제공. 안의 section 들은 props.children 으로.
 */

import { useEffect, useState } from 'react';

const CloseIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function FilterDrawer({
  open = false,
  onClose,
  title = '전체 필터',
  children,
  footer,
  className = '',
}) {
  const [rendered, setRendered] = useState(open);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      requestAnimationFrame(() => setIsOpen(true));
    } else if (rendered) {
      setIsOpen(false);
      const t = setTimeout(() => setRendered(false), 250);
      return () => clearTimeout(t);
    }
  }, [open, rendered]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && open && onClose) onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!rendered) return null;

  return (
    <>
      <div className="scm-filter-drawer-backdrop" onClick={onClose} />
      <aside
        className={['scm-filter-drawer', isOpen && 'is-open', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-label={title}
      >
        <header className="scm-filter-drawer__header">
          <h2>{title}</h2>
          <button type="button" className="scm-filter-drawer__close" aria-label="닫기" onClick={onClose}>
            {CloseIcon}
          </button>
        </header>
        <div className="scm-filter-drawer__body">{children}</div>
        {footer && <footer className="scm-filter-drawer__footer">{footer}</footer>}
      </aside>
    </>
  );
}

export function FilterDrawerSection({ title, required = false, children, ...rest }) {
  return (
    <section className="scm-filter-drawer__section" {...rest}>
      <h3>
        {title}
        {required && <span className="req-dot" />}
      </h3>
      {children}
    </section>
  );
}
