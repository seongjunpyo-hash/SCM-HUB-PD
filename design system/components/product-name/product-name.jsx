/**
 * scm-product-name — React twin
 */

export default function ProductName({ thumbnail, name, accent, className = '', ...rest }) {
  return (
    <span className={['scm-product-name', className].filter(Boolean).join(' ')} {...rest}>
      <span className="scm-product-name__thumb" style={thumbnail ? { backgroundImage: `url("${thumbnail}")` } : undefined} />
      <span className="scm-product-name__text">
        {name}
        {accent && <strong style={{ color: '#245EFF', marginLeft: 4 }}>{accent}</strong>}
      </span>
    </span>
  );
}
