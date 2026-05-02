/**
 * scm-pgsize-select — React twin
 */

import { useState, useRef, useEffect } from 'react';

const ChevDown = (
  <svg className="scm-pgsize__chev" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PgsizeSelect({
  value = 100,
  options = [20, 50, 100, 200],
  formatter = (n) => `${n}개씩`,
  onChange,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  function pick(v) {
    setOpen(false);
    if (onChange && v !== value) onChange(v);
  }

  return (
    <span ref={wrapRef} className={['scm-pgsize-wrap', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="scm-pgsize"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <span className="scm-pgsize__label">{formatter(value)}</span>
        {ChevDown}
      </button>
      <ul className={['scm-pgsize-popup', open && 'is-open'].filter(Boolean).join(' ')} role="listbox" aria-label="페이지당 행 수">
        {options.map((v) => (
          <li
            key={v}
            role="option"
            aria-selected={v === value}
            onClick={() => pick(v)}
          >
            {formatter(v)}
          </li>
        ))}
      </ul>
    </span>
  );
}
