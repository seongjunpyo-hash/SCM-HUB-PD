/**
 * scm-form-action-row — React twin
 */

export default function FormActionRow({ children, withSpacer = true, className = '', ...rest }) {
  return (
    <div className={['scm-form-action-row', className].filter(Boolean).join(' ')} {...rest}>
      {withSpacer && <span className="scm-form-action-row__spacer" />}
      {children}
    </div>
  );
}
