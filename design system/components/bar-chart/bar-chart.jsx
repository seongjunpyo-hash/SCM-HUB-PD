/**
 * scm-bar-chart — React twin (mock)
 *
 * 실제 production 에서는 Chart.js / Recharts 등 사용 권장. 본 모듈은 시뮬레이션 페이지용 mock.
 */

export default function BarChart({
  bars = [],                // [{ label, value (0-100), light? }]
  className = '',
}) {
  return (
    <div className={['scm-bar-chart', className].filter(Boolean).join(' ')}>
      {bars.map((b, i) => (
        <div
          key={i}
          className={['scm-bar-chart__bar', b.light && 'scm-bar-chart__bar--light'].filter(Boolean).join(' ')}
          style={{ height: `${b.value}%` }}
        >
          <span className="scm-bar-chart__bar-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
