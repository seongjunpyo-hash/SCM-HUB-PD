// v2.26.0 — Confirm modal infra (openConfirmModal/closeConfirmModal) 추가.
//           descHtml 지원 + Escape/backdrop 자동 닫힘 + onConfirm 콜백.
/**
 * Layer Desktop — Modal / Dialog
 * --------------------------------------------------------------
 * Figma nodes:
 *   - 9949:395 (Modal/Dialog 변형 매트릭스)
 *   - 10007:14268 (Modal/Drawer/Dialog 종합)
 *
 * Modal: 320–720px, 헤더 56 / 본문 flex / 푸터 64
 * Dialog (Alert): 480px max, 본문에 모든 콘텐츠
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="제목"
 *          footer={<><Button variant="secondary">취소</Button><Button>확인</Button></>}>
 *     본문 내용
 *   </Modal>
 *
 *   <Dialog open={open} onClose={...} title="확인" message="이 작업을 진행하시겠습니까?"
 *           confirmLabel="삭제" confirmVariant="negative" onConfirm={handleDelete} />
 */
import React, { useEffect } from 'react';

export function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  className = '',
  size = 'md',
  closeOnOverlayClick = true,
  showClose = true,
  ...rest
}) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeStyle = {
    s:  { maxWidth: 480 },
    md: { maxWidth: 720 },
    lg: { maxWidth: 960 },
  }[size];

  return (
    <div
      className="ld-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onMouseDown={(e) => closeOnOverlayClick && e.target === e.currentTarget && onClose?.()}
    >
      <div className={`ld-modal ${className}`} style={sizeStyle} {...rest}>
        {(title || showClose) ? (
          <div className="ld-modal-header">
            {title ? <h2 id="modal-title" className="ld-modal-title">{title}</h2> : <span/>}
            {showClose ? (
              <button type="button" className="ld-modal-close" aria-label="닫기" onClick={onClose}>×</button>
            ) : null}
          </div>
        ) : null}
        <div className="ld-modal-body">{children}</div>
        {footer ? <div className="ld-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  confirmVariant = 'primary',
  showCancel = true,
}) {
  if (!open) return null;
  return (
    <div className="ld-modal-overlay" role="alertdialog" aria-modal="true">
      <div className="ld-modal ld-dialog">
        <div className="ld-modal-body">
          {title ? <h2 className="ld-modal-title" style={{ marginBottom: 8 }}>{title}</h2> : null}
          {message ? <p style={{ margin: 0, color: 'var(--ld-fg-low)', fontSize: 14, lineHeight: 1.5 }}>{message}</p> : null}
        </div>
        <div className="ld-modal-footer">
          {showCancel ? (
            <button type="button" className="ld-btn ld-btn-md ld-btn-secondary-outlined" onClick={onClose}>{cancelLabel}</button>
          ) : null}
          <button
            type="button"
            className={`ld-btn ld-btn-md ld-btn-${confirmVariant}`}
            onClick={() => { onConfirm?.(); onClose?.(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* v2.26.0 — Confirm modal infra (vanilla DOM API)               */
/* ------------------------------------------------------------- */
/* React state 없이도 호출 가능한 confirm 모달.                   */
/* HTML 에 다음 마크업이 미리 있어야 함:                          */
/*                                                              */
/*   <div class="mp-modal-backdrop" id="mp-modal-backdrop"></div> */
/*   <div class="mp-modal" id="mp-modal" role="dialog" aria-modal="true" */
/*        aria-labelledby="mp-modal-title">                      */
/*     <h3 id="mp-modal-title"></h3>                             */
/*     <p class="desc" id="mp-modal-desc"></p>                   */
/*     <div class="actions">                                     */
/*       <button id="mp-modal-cancel">취소</button>              */
/*       <button class="primary" id="mp-modal-confirm">진행</button> */
/*     </div>                                                    */
/*   </div>                                                      */
/*                                                              */
/* JS:                                                          */
/*   import { openConfirmModal, closeConfirmModal } from '@/design-system/components'; */
/*   openConfirmModal({                                         */
/*     title: '상품 매핑',                                      */
/*     descHtml: '선택하신 <strong class="accent">5건</strong>...', */
/*     confirmLabel: '매핑',                                    */
/*     onConfirm: () => { ... }                                 */
/*   });                                                        */
/* ============================================================ */
let _confirmModalWired = false;
let _confirmHandler = null;

function _wireConfirmModal() {
  if (_confirmModalWired) return;
  if (typeof document === 'undefined') return;
  const modalEl = document.getElementById('mp-modal');
  const backdrop = document.getElementById('mp-modal-backdrop');
  const cancel = document.getElementById('mp-modal-cancel');
  const confirm = document.getElementById('mp-modal-confirm');
  if (!modalEl || !backdrop || !cancel || !confirm) return; // 마크업이 아직 없으면 다음 호출에 재시도
  cancel.addEventListener('click', closeConfirmModal);
  backdrop.addEventListener('click', closeConfirmModal);
  confirm.addEventListener('click', () => {
    const fn = _confirmHandler;
    closeConfirmModal();
    if (typeof fn === 'function') fn();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl.classList.contains('is-open')) closeConfirmModal();
  });
  _confirmModalWired = true;
}

export function openConfirmModal({ title, descHtml, onConfirm, confirmLabel = '진행' } = {}) {
  _wireConfirmModal();
  const modalEl = document.getElementById('mp-modal');
  const backdrop = document.getElementById('mp-modal-backdrop');
  const titleEl = document.getElementById('mp-modal-title');
  const descEl  = document.getElementById('mp-modal-desc');
  const confirmBtn = document.getElementById('mp-modal-confirm');
  if (!modalEl) return;
  if (titleEl)   titleEl.textContent = title || '';
  if (descEl)    descEl.innerHTML = descHtml || '';
  if (confirmBtn) confirmBtn.textContent = confirmLabel;
  modalEl.classList.add('is-open');
  if (backdrop) backdrop.classList.add('is-open');
  _confirmHandler = onConfirm;
}

export function closeConfirmModal() {
  const modalEl = document.getElementById('mp-modal');
  const backdrop = document.getElementById('mp-modal-backdrop');
  if (modalEl) modalEl.classList.remove('is-open');
  if (backdrop) backdrop.classList.remove('is-open');
  _confirmHandler = null;
}

export default Modal;
