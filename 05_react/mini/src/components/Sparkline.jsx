import { useId } from 'react'

// 폴링으로 쌓인 가격 히스토리를 작은 추세선으로 보여준다
export default function Sparkline({ data, width = 96, height = 28, dotR = 2.5 }) {
  const gradientId = useId()

  if (!data || data.length < 2) {
    return <svg className="spark" width={width} height={height} aria-hidden="true" />
  }

  const prices = data.map((d) => d.p)
  let min = Math.min(...prices)
  let max = Math.max(...prices)
  if (max - min < 1e-9) {
    min -= 1
    max += 1
  }

  const px = (i) => 3 + (i / (data.length - 1)) * (width - 6)
  const py = (p) => 3 + (1 - (p - min) / (max - min)) * (height - 6)
  const points = data.map((d, i) => `${px(i).toFixed(1)},${py(d.p).toFixed(1)}`).join(' ')
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(d.p).toFixed(1)}`).join('')
  const floor = (height - 3).toFixed(1)
  const area = `${linePath}L${px(data.length - 1).toFixed(1)},${floor}L${px(0).toFixed(1)},${floor}Z`

  const first = data[0]
  const last = data[data.length - 1]
  // 시작가 대비 지금이 오름세/내림세인지 — 국내 관례대로 상승=빨강, 하락=파랑
  const trend = Math.abs(last.p - first.p) > first.p * 0.0002 ? (last.p > first.p ? 'up' : 'down') : 'flat'
  const lastX = px(data.length - 1)
  const lastY = py(last.p)

  return (
    <svg className={`spark trend-${trend}`} width={width} height={height} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="spark-area" d={area} fill={`url(#${gradientId})`} />
      <polyline points={points} />
      {/* 라이브 핑: 히어로 스파크라인에서만 CSS로 켜짐 */}
      <circle className="spark-ping" cx={lastX} cy={lastY} r={dotR} />
      <circle cx={lastX} cy={lastY} r={dotR} />
    </svg>
  )
}
