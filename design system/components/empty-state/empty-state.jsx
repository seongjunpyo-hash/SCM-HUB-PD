/**
 * scm-empty-state — React twin
 */

export default function EmptyState({
  icon,                // ReactNode (svg)
  iconColor,           // 'blue' | 'green' | 'gray' | 'red' | undefined
  title,
  description,
  noBorder = false,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-empty-state',
    noBorder && 'scm-empty-state--no-border',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconCls = [
    'scm-empty-state__icon',
    iconColor && `scm-empty-state__icon--${iconColor}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {icon && <span className={iconCls}>{icon}</span>}
      {title && <div className="scm-empty-state__title">{title}</div>}
      {description && <div className="scm-empty-state__desc">{description}</div>}
    </div>
  );
}
