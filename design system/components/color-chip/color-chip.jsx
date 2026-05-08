/**
 * scm-color-chip — React twin
 */

export default function ColorChip({ children, className = '', ...rest }) {
  return (
    <span className={['scm-color-chip', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
