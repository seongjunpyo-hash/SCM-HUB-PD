/**
 * scm-stats-bar — React twin
 *
 * 좌/우 슬롯만 제공. 안에 들어가는 stat / mini-action / pager / pgsize 등은
 * props 로 전달.
 */

export default function StatsBar({
  sticky = false,
  countsContent,                  // ReactNode (stats counts + dividers)
  miniActions,                    // ReactNode (mini-action 들)
  rightContent,                   // ReactNode (timestamp + download + pager + pgsize)
  className = '',
}) {
  const cls = [
    'scm-stats-bar',
    sticky && 'scm-stats-bar--sticky',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <div className="scm-stats-bar__left">
        {countsContent && (
          <div className="scm-stats-bar__counts-wrap">
            <div className="scm-stats-bar__counts">{countsContent}</div>
          </div>
        )}
        {miniActions && <div className="scm-stats-bar__mini-actions">{miniActions}</div>}
      </div>
      {rightContent && <div className="scm-stats-bar__right">{rightContent}</div>}
    </div>
  );
}

export function StatsBarVDivider({ className = '', ...rest }) {
  return <span className={['scm-stats-bar__v-divider', className].filter(Boolean).join(' ')} {...rest} />;
}

export function StatsBarTimestamp({ children, className = '', ...rest }) {
  return <span className={['scm-stats-bar__ts', className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}
