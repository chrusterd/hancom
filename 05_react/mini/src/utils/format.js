// 숫자·시간 표기 헬퍼 (원화 시세 표기 관례를 따른다)

export function fmtPrice(n) {
  if (n == null || Number.isNaN(n)) return '–'
  const abs = Math.abs(n)
  const digits = abs < 100 ? 2 : abs < 5_000 ? 1 : 0
  return n.toLocaleString('ko-KR', {
    maximumFractionDigits: digits,
    minimumFractionDigits: abs < 100 ? 2 : 0,
  })
}

// 해외(달러) 시세 표기 — 단가대가 KRW보다 훨씬 작으므로 자릿수 기준을 다르게 둔다
export function fmtUsd(n) {
  if (n == null || Number.isNaN(n)) return '–'
  const abs = Math.abs(n)
  const digits = abs < 1 ? 4 : abs < 10 ? 3 : abs < 1_000 ? 2 : 0
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export function fmtAssetPrice(n, currency) {
  if (currency === 'USD') return `$${fmtUsd(n)}`
  return fmtPrice(n)
}

export function fmtKRWCompact(n) {
  if (n == null || Number.isNaN(n)) return '–'
  if (n >= 1e12) return `${(n / 1e12).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}조`
  if (n >= 1e8) return `${(n / 1e8).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}억`
  if (n >= 1e4) return `${(n / 1e4).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만`
  return fmtPrice(n)
}

// y축 눈금용: 자릿수가 큰 값을 억/만 단위로 줄인다
export function fmtAxisPrice(v) {
  if (v >= 1e8) return `${(v / 1e8).toLocaleString('ko-KR', { maximumFractionDigits: 3 })}억`
  if (v >= 1e4) return `${(v / 1e4).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만`
  return v.toLocaleString('ko-KR', { maximumFractionDigits: 2 })
}

export function fmtPct(rate) {
  return `${(Math.abs(rate) * 100).toFixed(2)}%`
}

export function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('ko-KR', { hour12: false })
}

// 하루를 넘는 기간에는 날짜를 함께 표기한다 (1w~1y는 주식·환율·원자재의 일봉 기간)
const LONG_RANGES = new Set(['3d', '7d', '15d', '30d', '1w', '1mo', '3mo', '6mo', '1y'])
// 축 눈금에 날짜만 쓰는 기간 (시각까지 쓰면 너무 길다)
const DATE_ONLY_RANGES = new Set(['7d', '15d', '30d', '1w', '1mo', '3mo', '6mo', '1y'])
// 초봉 기간에는 초 단위까지 표기한다
const SECONDS_RANGES = new Set(['1m', '3m'])

// 툴팁·표용 시각
export function fmtClock(ts, rangeId) {
  const d = new Date(ts)
  if (SECONDS_RANGES.has(rangeId)) {
    return d.toLocaleTimeString('ko-KR', { hour12: false })
  }
  const hm = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
  return LONG_RANGES.has(rangeId) ? `${d.getMonth() + 1}/${d.getDate()} ${hm}` : hm
}

// x축 눈금용 시각
export function fmtAxisTime(ts, rangeId) {
  const d = new Date(ts)
  if (SECONDS_RANGES.has(rangeId)) return d.toLocaleTimeString('ko-KR', { hour12: false })
  if (DATE_ONLY_RANGES.has(rangeId)) return `${d.getMonth() + 1}/${d.getDate()}`
  if (rangeId === '3d') return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}시`
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
}
