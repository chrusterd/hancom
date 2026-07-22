import { useId, useMemo, useState } from 'react'
import useElementSize from '../hooks/useElementSize'
import { fmtPrice, fmtClock, fmtAxisTime, fmtAxisPrice } from '../utils/format'

const H = 330
const PAD = { l: 64, r: 20, t: 18, b: 30 }

// 1-2-2.5-5 단위의 "깔끔한 숫자" y축 눈금
function niceTicks(min, max, count) {
  const span = max - min || Math.abs(max) * 0.01 || 1
  const rough = span / (count - 1)
  const mag = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count - 1) ?? mag * 10
  const start = Math.floor(min / step) * step
  const ticks = []
  for (let v = start; v < max + step * 0.999; v += step) ticks.push(v)
  return ticks
}

export default function PriceChart({ candles, rangeId }) {
  const { ref, width } = useElementSize()
  const [hover, setHover] = useState(null) // 데이터 인덱스
  const gradientId = useId()

  // 차트 지오메트리는 데이터·폭이 바뀔 때만 다시 계산
  const geo = useMemo(() => {
    if (!candles?.length || width < 120) return null

    const prices = candles.map((c) => c.price)
    const lo = Math.min(...prices)
    const hi = Math.max(...prices)
    const padV = (hi - lo || hi * 0.002 || 1) * 0.08
    const ticks = niceTicks(lo - padV, hi + padV, 6)
    const y0 = ticks[0]
    const y1 = ticks[ticks.length - 1]

    const innerW = width - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b
    const x = (i) => PAD.l + (candles.length === 1 ? 0.5 : i / (candles.length - 1)) * innerW
    const y = (v) => PAD.t + (1 - (v - y0) / (y1 - y0)) * innerH

    const points = candles.map((c, i) => ({ t: c.t, price: c.price, x: x(i), y: y(c.price) }))
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('')
    const floor = (H - PAD.b).toFixed(1)
    const area = `${line}L${points[points.length - 1].x.toFixed(1)},${floor}L${PAD.l},${floor}Z`

    const yTicks = ticks.map((v) => ({ v, y: y(v) }))
    const n = Math.min(6, candles.length)
    const xTicks = Array.from({ length: n }, (_, k) => {
      const i = Math.round((k / (n - 1 || 1)) * (candles.length - 1))
      return { x: x(i), t: candles[i].t, first: k === 0, last: k === n - 1 }
    })

    return { points, line, area, yTicks, xTicks }
  }, [candles, width])

  // 크로스헤어: 포인터 x좌표에서 가장 가까운 데이터 인덱스로 스냅
  function indexFromEvent(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left - PAD.l) / (width - PAD.l - PAD.r)
    return Math.max(0, Math.min(candles.length - 1, Math.round(ratio * (candles.length - 1))))
  }

  // 키보드로도 같은 정보에 접근 (←/→ 이동, Esc 해제)
  function onKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const d = e.key === 'ArrowRight' ? 1 : -1
      setHover((h) => Math.max(0, Math.min(candles.length - 1, (h ?? candles.length - 1) + d)))
    } else if (e.key === 'Escape') {
      setHover(null)
    }
  }

  const last = geo ? geo.points[geo.points.length - 1] : null
  const first = geo ? geo.points[0] : null
  // 기간 시작 대비 지금이 오르는 중인지 내리는 중인지 — 차트 색을 여기에 실시간으로 물들인다
  const trend =
    first && last && Math.abs(last.price - first.price) > first.price * 0.0002
      ? last.price > first.price
        ? 'up'
        : 'down'
      : 'flat'
  // 기간 전환 직후 hover 인덱스가 새 데이터 범위를 벗어날 수 있다
  const p = geo && hover != null ? (geo.points[hover] ?? last) : null
  const flip = p != null && p.x > width - 170 // 오른쪽 끝에서는 툴팁을 왼쪽으로

  return (
    <div className="chart-wrap" ref={ref}>
      {geo && (
        <svg
          width={width}
          height={H}
          className={`price-chart trend-${trend}`}
          role="img"
          aria-label={`가격 추이 라인 차트, 마지막 가격 ${fmtPrice(last.price)}원`}
          tabIndex={0}
          onPointerMove={(e) => setHover(indexFromEvent(e))}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKeyDown}
        >
          <defs>
            {/* 위는 트렌드 색으로 은은하게, 아래로 갈수록 투명해지는 영역 채우기 */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {geo.yTicks.map((t) => (
            <g key={t.v}>
              <line className="grid-line" x1={PAD.l} x2={width - PAD.r} y1={t.y} y2={t.y} />
              <text className="axis-text" x={PAD.l - 8} y={t.y + 3.5} textAnchor="end">
                {fmtAxisPrice(t.v)}
              </text>
            </g>
          ))}
          <line className="baseline" x1={PAD.l} x2={width - PAD.r} y1={H - PAD.b} y2={H - PAD.b} />
          {geo.xTicks.map((t) => (
            <text
              key={t.x}
              className="axis-text"
              x={t.x}
              y={H - PAD.b + 18}
              textAnchor={t.first ? 'start' : t.last ? 'end' : 'middle'}
            >
              {fmtAxisTime(t.t, rangeId)}
            </text>
          ))}

          <path className="price-area" d={geo.area} fill={`url(#${gradientId})`} />
          <path className="price-line" d={geo.line} />

          {p && <line className="crosshair" x1={p.x} x2={p.x} y1={PAD.t} y2={H - PAD.b} />}

          <text className="end-label" x={last.x} y={last.y - 12} textAnchor="end">
            {fmtPrice(last.price)}
          </text>
          {/* 실시간으로 갱신 중임을 알리는 라이브 핑 — 레이더처럼 원이 퍼지며 사라짐 */}
          <circle className="end-ping" cx={last.x} cy={last.y} r="4.5" />
          <circle className="end-dot" cx={last.x} cy={last.y} r="4.5" />
          {p && <circle className="hover-dot" cx={p.x} cy={p.y} r="5" />}
        </svg>
      )}

      {p && (
        <div
          className={`chart-tooltip trend-${trend} ${flip ? 'flip' : ''}`}
          style={{ left: p.x, top: p.y - 12 }}
        >
          <span className="tt-key" aria-hidden="true" />
          <strong>
            {fmtPrice(p.price)}
            <span className="unit">원</span>
          </strong>
          <span className="tt-time">{fmtClock(p.t, rangeId)}</span>
        </div>
      )}
    </div>
  )
}
