/**
 * scm-code-link — React twin
 */

export default function CodeLink({
  codeType,
  onClick,
  children,
  className = '',
  ...rest
}) {
  return (
    <a
      className={['scm-code-link', className].filter(Boolean).join(' ')}
      data-code-type={codeType}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}

export function CodeLinkExtra({ children, className = '', ...rest }) {
  return (
    <a className={['scm-code-link__extra', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </a>
  );
}
