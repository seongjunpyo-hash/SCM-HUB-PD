/**
 * Toast — 우측 상단 슬라이드 인/아웃 토스트
 *
 * 사용 패턴:
 *   1) <ToastStack/> 을 페이지 한 번 마운트
 *   2) 어디서든 toast.show({ variant, title, desc }) 호출
 *
 * 또는 외부 상태 관리 시:
 *   const [toasts, setToasts] = useState([]);
 *   <ToastStack toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
 *
 * Variants: 'info' | 'success' | 'critical'
 *
 * Spec : design-system/layer-desktop.css §"Toast"
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

const VARIANT_PATH = {
  success: 'M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM13.71 8.21L9.41 12.5L6.29 9.38L7.71 7.96L9.41 9.67L12.29 6.79L13.71 8.21Z',
  info:    'M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 5.25C10.41 5.25 10.75 5.59 10.75 6V10.5C10.75 10.91 10.41 11.25 10 11.25C9.59 11.25 9.25 10.91 9.25 10.5V6C9.25 5.59 9.59 5.25 10 5.25ZM10 14.75C10.55 14.75 11 14.30 11 13.75C11 13.20 10.55 12.75 10 12.75C9.45 12.75 9 13.20 9 13.75C9 14.30 9.45 14.75 10 14.75Z',
  critical:'M10 14.75V12.88M10 11.95V7.28M2.31 16.5H17.69C17.93 16.5 18.07 16.24 17.95 16.04L10.26 3.42C10.14 3.23 9.86 3.23 9.74 3.42L2.05 16.04C1.93 16.24 2.07 16.5 2.31 16.5Z',
};

/* ===================== ToastStack (controlled) ===================== */
export function ToastStack({ toasts = [], onDismiss }) {
  return (
    <div className="ld-toast-stack" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onDismiss={() => onDismiss && onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ id, variant = 'info', title = '', desc = '', duration = 3000, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const ref = useRef(null);
  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss && onDismiss(), 250);
  }, [onDismiss]);

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [duration, dismiss]);

  const path = VARIANT_PATH[variant] || VARIANT_PATH.info;
  const fillRule = variant === 'critical' ? null : 'evenodd';

  return (
    <div ref={ref} className={`ld-toast ld-toast--${variant}${leaving ? ' is-leaving' : ''}`}>
      <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
        {variant === 'critical'
          ? <path d={path} stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d={path} fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
        }
      </svg>
      <div className="body">
        <div className="title">{title}</div>
        {desc && <div className="desc">{desc}</div>}
      </div>
      <button className="close" type="button" aria-label="닫기" onClick={dismiss}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        </svg>
      </button>
    </div>
  );
}

/* ===================== useToast (간단한 훅) ===================== */
let _id = 0;
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((opts) => {
    const id = ++_id;
    setToasts(t => [...t, { id, ...opts }]);
    return id;
  }, []);
  const dismiss = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);
  const clear   = useCallback(() => setToasts([]), []);
  return { toasts, show, dismiss, clear };
}

export default ToastStack;
