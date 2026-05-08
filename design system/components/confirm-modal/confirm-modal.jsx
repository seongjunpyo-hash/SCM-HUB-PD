/**
 * scm-confirm-modal — React twin (controlled)
 */

export default function ConfirmModal({
  open = false,
  title,
  description,
  descriptionHtml,            // string — accent strong 등 inline HTML 필요시
  cancelLabel = '취소',
  confirmLabel = '확인',
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  return (
    <>
      <div className="scm-confirm-modal-backdrop is-open" onClick={onCancel} />
      <div className="scm-confirm-modal is-open" role="dialog" aria-labelledby="scm-confirm-modal-title">
        <h3 className="scm-confirm-modal__title" id="scm-confirm-modal-title">{title}</h3>
        {descriptionHtml ? (
          <p className="scm-confirm-modal__desc" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        ) : (
          <p className="scm-confirm-modal__desc">{description}</p>
        )}
        <div className="scm-confirm-modal__actions">
          <button type="button" className="scm-confirm-modal__cancel" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="scm-confirm-modal__confirm primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </>
  );
}
