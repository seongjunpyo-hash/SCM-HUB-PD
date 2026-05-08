/**
 * scm-detail-stack — React twin
 */
export default function DetailStack({ primary, secondary, className = '', ...rest }) {
  return (
    <span className={['scm-detail-stack', className].filter(Boolean).join(' ')} {...rest}>
      {primary && <span className="scm-detail-stack__primary">{primary}</span>}
      {secondary && <span className="scm-detail-stack__secondary">{secondary}</span>}
    </span>
  );
}
