/**
 * scm-section-count — React twin
 */

export default function SectionCount({ children, className = '', ...rest }) {
  return (
    <span className={['scm-section-count', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
