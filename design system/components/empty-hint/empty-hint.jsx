/**
 * scm-empty-hint — React twin
 */

export default function EmptyHint({ children, className = '', ...rest }) {
  return (
    <div className={['scm-empty-hint', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
