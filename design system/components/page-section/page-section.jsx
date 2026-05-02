/**
 * scm-page-section — React twin
 */

export default function PageSection({
  title,
  link,                   // ReactNode — 우측 링크/액션
  children,
  className = '',
  ...rest
}) {
  return (
    <section className={['scm-page-section', className].filter(Boolean).join(' ')} {...rest}>
      {(title || link) && (
        <header className="scm-page-section-head">
          {title && <h2 className="scm-page-section-title">{title}</h2>}
          {link && link}
        </header>
      )}
      <div className="scm-page-section-body">
        {children}
      </div>
    </section>
  );
}

export function PageSectionLink({ href, children, className = '', ...rest }) {
  return (
    <a className={['scm-page-section-link', className].filter(Boolean).join(' ')} href={href} {...rest}>
      {children}
    </a>
  );
}
