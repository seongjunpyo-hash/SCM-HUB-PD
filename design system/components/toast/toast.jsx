/**
 * scm-toast — React twin
 *
 * imperative API 위해 React Context + provider 패턴 사용 권장.
 * 여기선 단순 "표시 토스트 컴포넌트" 만 export. 실제 토스트 큐 관리는
 * 사용처에서 React state 로 (예: useState([])).
 */

import { useEffect, useState } from 'react';

export function Toast({
  variant = 'info',                    // 'success' | 'info' | 'critical'
  title,
  description,
  iconNode,                            // ReactNode (SVG)
  onClose,
  className = '',
  ...rest
}) {
  const [leaving, setLeaving] = useState(false);

  function handleClose() {
    setLeaving(true);
    setTimeout(() => { if (onClose) onClose(); }, 220);
  }

  const cls = [
    'scm-toast',
    `scm-toast--${variant}`,
    leaving && 'is-leaving',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {iconNode && <span className="scm-toast__icon">{iconNode}</span>}
      <div className="scm-toast__body">
        {title && <div className="scm-toast__title">{title}</div>}
        {description && <div className="scm-toast__desc">{description}</div>}
      </div>
      <button className="scm-toast__close" aria-label="닫기" onClick={handleClose}>
        <svg width="14" height="14" aria-hidden="true">
          <use href="#ic-close" />
        </svg>
      </button>
    </div>
  );
}

/**
 * 토스트 stack 컨테이너 + 자동 dismiss 관리.
 *
 * Usage:
 *   const [items, setItems] = useState([]);
 *   <ToastStack items={items} onRemove={(id) => setItems(items.filter(i => i.id !== id))} />
 *   // showToast: setItems([...items, { id: Date.now(), variant, title, desc, duration: 3000 }])
 */
export function ToastStack({ items = [], onRemove }) {
  return (
    <div className="scm-toast-stack" aria-live="polite">
      {items.map((item) => (
        <ToastItem key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ item, onRemove }) {
  useEffect(() => {
    if (item.duration > 0) {
      const t = setTimeout(() => onRemove && onRemove(item.id), item.duration);
      return () => clearTimeout(t);
    }
  }, [item.id, item.duration, onRemove]);

  return (
    <Toast
      variant={item.variant}
      title={item.title}
      description={item.desc}
      iconNode={item.iconNode}
      onClose={() => onRemove && onRemove(item.id)}
    />
  );
}

export default Toast;
