/**
 * scm-activity-item — React twin
 */

export default function ActivityItem({
  iconNode,                 // ReactNode (scm-icon-box --sm)
  title,
  description,
  time,
  className = '',
}) {
  return (
    <div className={['scm-activity-item', className].filter(Boolean).join(' ')}>
      {iconNode}
      <div className="scm-activity-item__content">
        {title && <div className="scm-activity-item__title">{title}</div>}
        {description && <div className="scm-activity-item__desc">{description}</div>}
      </div>
      {time && <span className="scm-activity-item__time">{time}</span>}
    </div>
  );
}
