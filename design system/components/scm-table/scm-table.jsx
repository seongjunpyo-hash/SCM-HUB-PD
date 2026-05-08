/**
 * scm-table — React twin (skeleton)
 *
 * 주의: 현재 클래스명은 legacy `mp-*` (mp-table 등) 그대로 유지.
 * Stage 12 마이그레이션 시 `scm-table-*` 로 일괄 리네임 예정.
 *
 * 본 컴포넌트는 마크업/CSS 골격만 제공. sticky thead / cell selection /
 * resize 등의 상호작용은 vanilla 모듈 (scm-table.js) 또는 호출처 책임.
 *
 * Usage:
 *   <Table variant="grouped" headerSlot={...}>
 *     <tbody>...</tbody>
 *   </Table>
 */

export default function Table({
  variant,                  // 'grouped' | undefined (default: single)
  cellSelectable = true,
  className = '',
  headerSlot,               // <thead>...</thead> ReactNode
  children,                 // <tbody>...</tbody> ReactNode
  ...rest
}) {
  const tableCls = [
    'mp-table',
    variant === 'grouped' && 'mp-table--grouped',
    cellSelectable && 'is-cell-selectable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mp-table-host">
      <div className="mp-thead-sticky">
        <div className="mp-thead-scroll">
          <table className={tableCls.replace(' is-cell-selectable', '')}>
            {headerSlot}
          </table>
        </div>
      </div>
      <div className="mp-table-scroll">
        <table className={tableCls} {...rest}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableCheckbox({ checked = false, indeterminate = false, ariaLabel = '선택', onChange, ...rest }) {
  const value = indeterminate ? 'mixed' : (checked ? 'true' : 'false');
  return (
    <span
      className="mp-cb"
      role="checkbox"
      aria-checked={value}
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={() => onChange && onChange(checked === true ? false : true)}
      {...rest}
    />
  );
}
