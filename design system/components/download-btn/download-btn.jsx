/**
 * scm-download-btn — React twin
 */

const DownloadIcon = (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 16h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function DownloadButton({
  onClick,
  className = '',
  children = '전체 엑셀 다운로드',
  ...rest
}) {
  const cls = ['scm-download-btn', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {DownloadIcon}
      <span>{children}</span>
    </button>
  );
}
