/**
 * scm-sizeset-btn — React twin
 */

export default function SizesetButton({
  used,
  total,
  label = '전개',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      className={['scm-sizeset-btn', className].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span>{label}</span>
      <span className="scm-sizeset-btn__num">
        <em>{used}</em>
        <span className="divider">/</span>
        <span className="total">{total}</span>
      </span>
    </button>
  );
}
