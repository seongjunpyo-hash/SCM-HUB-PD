/**
 * scm-input-cell — React twin
 */

export default function InputCell({ value, onChange, max, onMax, className = '', ...rest }) {
  return (
    <span className={['scm-input-cell', className].filter(Boolean).join(' ')}>
      <input
        type="number"
        className="scm-input-cell__input"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        max={max}
        {...rest}
      />
      <button type="button" className="scm-input-cell__max" onClick={onMax}>최대</button>
    </span>
  );
}
