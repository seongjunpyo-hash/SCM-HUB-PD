/**
 * scm-mini-action — React twin
 */

import { useState, useRef, useEffect } from 'react';

const ChevDown = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MiniAction({
  label,
  variant,                   // 'primary' | undefined
  items,                     // [{ key, label, current?, html? }] — 있으면 드롭다운
  disabled = false,
  onSelect,
  onClick,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!items) return;
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [items]);

  const btnCls = [
    'scm-mini-action',
    variant === 'primary' && 'scm-mini-action--primary',
  ]
    .filter(Boolean)
    .join(' ');

  if (!items) {
    return (
      <button type="button" className={[btnCls, className].filter(Boolean).join(' ')} disabled={disabled} onClick={onClick}>
        {label}
      </button>
    );
  }

  return (
    <span ref={wrapRef} className={['scm-mini-wrap', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={btnCls}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        {label}
        {ChevDown}
      </button>
      <ul className={['scm-mini-popup', open && 'is-open'].filter(Boolean).join(' ')} role="listbox">
        {items.map((it) => (
          <li
            key={it.key}
            data-key={it.key}
            className={it.current ? 'is-current' : undefined}
            onClick={() => { setOpen(false); if (onSelect) onSelect(it.key); }}
          >
            {it.html ? <span dangerouslySetInnerHTML={{ __html: it.html }} /> : it.label}
          </li>
        ))}
      </ul>
    </span>
  );
}
