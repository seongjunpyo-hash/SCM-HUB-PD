/**
 * scm-info-table — React twin
 */

export default function InfoTable({
  noBottom = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'scm-info-table',
    noBottom && 'scm-info-table--no-bottom',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

export function InfoRow({ quad = false, children, className = '', ...rest }) {
  const cls = ['scm-info-row', quad && 'scm-info-row--quad', className].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

export function InfoLabel({ top = false, children, className = '', ...rest }) {
  const cls = ['scm-info-cell-label', top && 'scm-info-cell-label--top', className].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

export function InfoValue({ padded = false, flexBetween = false, children, className = '', ...rest }) {
  const cls = [
    'scm-info-cell-value',
    padded && 'scm-info-cell-value--padded',
    flexBetween && 'scm-info-cell-value--flex-between',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}
