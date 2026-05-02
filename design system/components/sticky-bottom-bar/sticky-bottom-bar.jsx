/**
 * scm-sticky-bottom-bar — React twin
 */

export default function StickyBottomBar({ children, className = '', ...rest }) {
  return (
    <div className={['scm-sticky-bottom-bar', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
