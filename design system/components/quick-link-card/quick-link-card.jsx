/**
 * scm-quick-link-card — React twin
 */

export default function QuickLinkCard({
  href = '#',
  iconNode,
  title,
  description,
  className = '',
  ...rest
}) {
  return (
    <a href={href} className={['scm-quick-link-card', className].filter(Boolean).join(' ')} {...rest}>
      {iconNode}
      {title && <div className="scm-quick-link-card__title">{title}</div>}
      {description && <div className="scm-quick-link-card__desc">{description}</div>}
    </a>
  );
}
