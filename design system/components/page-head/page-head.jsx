/**
 * scm-page-head — React twin
 */

export default function PageHead({
  variant = 'list',                // 'list' | 'detail' | 'form' | 'dashboard'
  sticky = false,
  title,
  subtitle,                        // dashboard 만
  back,                            // ReactNode (BackButton) — detail/form 만
  actions,                         // ReactNode — list/dashboard 만
  className = '',
}) {
  const cls = [
    'scm-page-head',
    `scm-page-head--${variant}`,
    sticky && 'scm-page-head--sticky',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'dashboard') {
    return (
      <div className={cls}>
        <div className="scm-page-head__titles">
          {title && <h1 className="scm-page-head__title">{title}</h1>}
          {subtitle && <p className="scm-page-head__sub">{subtitle}</p>}
        </div>
        {actions && <div className="scm-page-head__actions">{actions}</div>}
      </div>
    );
  }

  if (variant === 'detail' || variant === 'form') {
    return (
      <div className={cls}>
        {back}
        {title && <h1 className="scm-page-head__title">{title}</h1>}
      </div>
    );
  }

  // list (default)
  return (
    <div className={cls}>
      {title && <h1 className="scm-page-head__title">{title}</h1>}
      {actions && <div className="scm-page-head__actions">{actions}</div>}
    </div>
  );
}
