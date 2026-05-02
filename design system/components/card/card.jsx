/**
 * scm-card — React twin
 */

export default function Card({
  variant,                 // 'gray' | undefined
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-card',
    variant === 'gray' && 'scm-card--gray',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <article className={cls} {...rest}>{children}</article>;
}

export function CardHead({ title, link, children, className = '', ...rest }) {
  return (
    <header className={['scm-card-head', className].filter(Boolean).join(' ')} {...rest}>
      {children !== undefined ? children : (
        <>
          {title && <h3 className="scm-card-title">{title}</h3>}
          {link && link}
        </>
      )}
    </header>
  );
}

export function CardTitle({ size, children, className = '', ...rest }) {
  const cls = ['scm-card-title', size === 'lg' && 'scm-card-title--lg', className].filter(Boolean).join(' ');
  return <h3 className={cls} {...rest}>{children}</h3>;
}

export function CardBody({ flush = false, children, className = '', ...rest }) {
  const cls = ['scm-card-body', flush && 'scm-card-body--flush', className].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

export function CardSection({ padded = false, children, className = '', ...rest }) {
  const cls = ['scm-card-section', padded && 'scm-card-section--padded', className].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

export function CardDivider({ className = '', ...rest }) {
  return <div className={['scm-card-divider', className].filter(Boolean).join(' ')} {...rest} />;
}

export function CardLink({ href, children, className = '', ...rest }) {
  return (
    <a className={['scm-card-link', className].filter(Boolean).join(' ')} href={href} {...rest}>
      {children}
    </a>
  );
}
