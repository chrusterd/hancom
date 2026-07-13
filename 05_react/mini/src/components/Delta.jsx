import { fmtPct } from '../utils/format'

// 등락 표시: 화살표(방향) + 퍼센트. 국내 시세 관례대로 상승=빨강, 하락=파랑.
// 색만으로 뜻을 전하지 않도록 화살표 기호를 반드시 함께 쓴다.
export default function Delta({ rate, label }) {
  const dir = rate > 0.0001 ? 'up' : rate < -0.0001 ? 'down' : 'flat'
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—'
  return (
    <span className={`delta ${dir}`}>
      {arrow} {fmtPct(rate)}
      {label && <span className="delta-label"> {label}</span>}
    </span>
  )
}
