/**
 * scm-search-btn — React twin
 */

export default function SearchButton({
  disabled = true,
  onClick,
  className = '',
  children = '검색',
  ...rest
}) {
  const cls = ['scm-search-btn', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
