// Upbit 공개 시세 API — 배포 도메인에서는 CORS로 차단되므로 프록시를 거친다.
// (로컬 개발: stock-proxy, 배포: 같은 도메인의 Netlify Functions)
const PROXY = (import.meta.env.VITE_KR_STOCK_PROXY_URL ?? '').replace(/\/$/, '')

export const MARKETS = [
  { code: 'KRW-BTC', name: '비트코인', symbol: 'BTC' },
  { code: 'KRW-ETH', name: '이더리움', symbol: 'ETH' },
  { code: 'KRW-XRP', name: '리플', symbol: 'XRP' },
  { code: 'KRW-SOL', name: '솔라나', symbol: 'SOL' },
  { code: 'KRW-ADA', name: '에이다', symbol: 'ADA' },
  { code: 'KRW-DOGE', name: '도지코인', symbol: 'DOGE' },
]

// long: 축·툴팁에 날짜를 함께 표기해야 하는 기간
// 1분·3분은 초봉(1초 캔들)으로 촘촘하게, 5~30분은 1분봉으로
export const RANGES = [
  { id: '1m', label: '1분', path: 'seconds', count: 60, stepMs: 1_000 },
  { id: '3m', label: '3분', path: 'seconds', count: 180, stepMs: 1_000 },
  { id: '5m', label: '5분', path: 'minutes/1', count: 5, stepMs: 60_000 },
  { id: '10m', label: '10분', path: 'minutes/1', count: 10, stepMs: 60_000 },
  { id: '15m', label: '15분', path: 'minutes/1', count: 15, stepMs: 60_000 },
  { id: '30m', label: '30분', path: 'minutes/1', count: 30, stepMs: 60_000 },
  { id: '1h', label: '1시간', path: 'minutes/1', count: 60, stepMs: 60_000 },
  { id: '3h', label: '3시간', path: 'minutes/3', count: 60, stepMs: 180_000 },
  { id: '6h', label: '6시간', path: 'minutes/5', count: 72, stepMs: 300_000 },
  { id: '12h', label: '12시간', path: 'minutes/10', count: 72, stepMs: 600_000 },
  { id: '24h', label: '24시간', path: 'minutes/15', count: 96, stepMs: 900_000 },
  { id: '3d', label: '3일', path: 'minutes/30', count: 144, stepMs: 1_800_000, long: true },
  { id: '7d', label: '7일', path: 'minutes/60', count: 168, stepMs: 3_600_000, long: true },
  { id: '15d', label: '15일', path: 'minutes/240', count: 90, stepMs: 14_400_000, long: true },
  { id: '30d', label: '30일', path: 'minutes/240', count: 180, stepMs: 14_400_000, long: true },
]

export async function fetchTicker(markets) {
  const res = await fetch(`${PROXY}/upbit/ticker?markets=${markets.join(',')}`)
  if (!res.ok) throw new Error(`ticker ${res.status}`)
  return res.json()
}

export async function fetchCandles(market, range) {
  const params = new URLSearchParams({ path: range.path, market, count: range.count })
  const res = await fetch(`${PROXY}/upbit/candles?${params}`)
  if (!res.ok) throw new Error(`candles ${res.status}`)
  const data = await res.json()
  // Upbit은 최신 캔들부터 내려주므로 시간 오름차순으로 뒤집는다
  // 고가/저가/거래대금은 스탯 타일에서 기간별 집계에 쓴다
  return data.reverse().map((c) => ({
    t: new Date(c.candle_date_time_kst).getTime(),
    price: c.trade_price,
    high: c.high_price,
    low: c.low_price,
    volume: c.candle_acc_trade_price,
  }))
}

