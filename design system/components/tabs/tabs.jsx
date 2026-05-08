/**
 * scm-tabs — React twin
 */

export default function Tabs({
  variant = 'underline',          // 'underline' | 'pill'
  value,
  onChange,
  items,                          // [{ key, label, count? }]
  className = '',
}) {
  const cls = [
    'scm-tabs',
    `scm-tabs--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} role="tablist">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            className={['scm-tab', active && 'is-active'].filter(Boolean).join(' ')}
            data-key={it.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(it.key)}
          >
            {variant === 'underline' ? (
              <>
                <span className="scm-tab__label">{it.label}</span>
                {it.count !== undefined && <span className="scm-tab__count">{it.count}</span>}
              </>
            ) : (
              it.label
            )}
          </button>
        );
      })}
    </div>
  );
}
