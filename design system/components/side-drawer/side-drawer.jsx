/**
 * scm-side-drawer — React twin
 */

import { useEffect, useState } from 'react';

const CloseIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function SideDrawer({
  open = false,
  onClose,
  size = 'lg',                  // 'sm' | 'md' | 'lg'
  ariaLabel,
  headMeta,                     // ReactNode (좌측 메타)
  footer,                       // ReactNode (footer 슬롯)
  children,
  className = '',
}) {
  // 애니메이션을 위해 두 상태 관리: rendered (DOM) + isOpen (slide)
  const [rendered, setRendered] = useState(open);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      requestAnimationFrame(() => setIsOpen(true));
      document.body.style.overflow = 'hidden';
    } else if (rendered) {
      setIsOpen(false);
      const t = setTimeout(() => {
        setRendered(false);
        document.body.style.overflow = '';
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open, rendered]);

  if (!rendered) return null;

  const cls = [
    'scm-side-drawer',
    `scm-side-drawer--${size}`,
    isOpen && 'is-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className="scm-side-drawer-backdrop" onClick={onClose} />
      <aside className={cls} role="dialog" aria-label={ariaLabel}>
        <header className="scm-side-drawer__head">
          {headMeta && <span className="scm-side-drawer__head-meta">{headMeta}</span>}
          <button type="button" className="scm-side-drawer__close" aria-label="닫기" onClick={onClose}>
            {CloseIcon}
          </button>
        </header>
        <div className="scm-side-drawer__body">{children}</div>
        {footer && <footer className="scm-side-drawer__footer">{footer}</footer>}
      </aside>
    </>
  );
}
