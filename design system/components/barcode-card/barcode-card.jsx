/**
 * scm-barcode-card — React twin
 */

const BarcodeIcon = (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="6" y="8" width="20" height="16" rx="2" fill="#F5F5F5" stroke="#000" strokeWidth="1.2"/>
    <g stroke="#000" strokeWidth="1">
      <path d="M9 11v10M11 11v10M13 11v10M15 11v10M17 11v10M19 11v10M21 11v10M23 11v10"/>
    </g>
  </svg>
);

export default function BarcodeCard({ number, chipNode, className = '', ...rest }) {
  return (
    <div className={['scm-barcode-card', className].filter(Boolean).join(' ')} {...rest}>
      <div className="scm-barcode-card__inner">
        <span className="scm-barcode-card__icon">{BarcodeIcon}</span>
        <span className="scm-barcode-card__num">{number}</span>
      </div>
      {chipNode}
    </div>
  );
}

export function BarcodeAdd({ onClick, className = '', ...rest }) {
  return (
    <button type="button" className={['scm-barcode-add', className].filter(Boolean).join(' ')} onClick={onClick} {...rest}>
      <svg viewBox="0 0 20 20"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
    </button>
  );
}
