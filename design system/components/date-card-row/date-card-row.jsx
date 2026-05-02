/**
 * scm-date-card-row — React twin
 */

export default function DateCardRow({ children, className = '', ...rest }) {
  return (
    <div className={['scm-date-card-row', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function DateCard({ multi = false, label, value, valueMuted = false, children, className = '' }) {
  if (children) {
    return (
      <div className={['scm-date-card', multi && 'scm-date-card--multi', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    );
  }
  return (
    <div className={['scm-date-card', multi && 'scm-date-card--multi', className].filter(Boolean).join(' ')}>
      {label && <div className="scm-date-card__label">{label}</div>}
      {value && <div className={['scm-date-card__value', valueMuted && 'scm-date-card__value--muted'].filter(Boolean).join(' ')}>{value}</div>}
    </div>
  );
}
