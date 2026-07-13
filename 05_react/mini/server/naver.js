// 시세 프록시 로직 (네이버 금융 비공식 API + Upbit).
// 로컬 개발 서버(stock-proxy.js)와 Netlify 함수(netlify/functions/market.mjs)가 함께 쓴다.
// Upbit는 배포 도메인의 브라우저 요청을 CORS로 차단하므로 서버를 거쳐야 한다.
// 네이버는 인증이 필요 없지만, 브라우저처럼 보이도록 Referer/User-Agent를 반드시 실어 보내야 한다.

const BASE_URL = 'https://polling.finance.naver.com/api/realtime/domestic/stock'
const UPBIT_BASE = 'https://api.upbit.com/v1'
const INDEX_BASE_URL = 'https://m.stock.naver.com/front-api/marketIndex/productDetail'
const CACHE_TTL_MS = 3_000
const CANDLE_CACHE_TTL_MS = 10_000

// 원자재는 네이버가 카테고리별로 나눠 서비스하므로 지원 종목을 화이트리스트로 관리한다.
export const COMMODITY_CATEGORIES = { GCcv1: 'metals', CLcv1: 'energy', NGcv1: 'energy' }

const NAVER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://finance.naver.com/',
}

const cache = new Map() // 캐시 키 -> { at, value }

function cached(key, ttl, compute) {
  const hit = cache.get(key)
  if (hit && hit.at > Date.now() - ttl) return hit.value
  return Promise.resolve(compute()).then((value) => {
    cache.set(key, { at: Date.now(), value })
    return value
  })
}

function toNumber(raw) {
  const value = Number(typeof raw === 'string' ? raw.replaceAll(',', '') : raw)
  return Number.isFinite(value) ? value : null
}

export class BadRequestError extends Error {}

export function fetchQuotes(symbols) {
  return cached(`quote:${symbols.join(',')}`, CACHE_TTL_MS, async () => {
    const response = await fetch(`${BASE_URL}/${symbols.join(',')}`, { headers: NAVER_HEADERS })
    if (!response.ok) throw new Error(`네이버 시세 조회 실패 (${response.status})`)

    const data = await response.json()
    const result = {}
    for (const item of data.datas ?? []) {
      const price = toNumber(item.closePriceRaw)
      const change = toNumber(item.compareToPreviousClosePriceRaw) ?? 0
      if (price === null) continue
      result[item.itemCode] = {
        price,
        previousClose: price - change,
        high: toNumber(item.highPriceRaw) ?? price,
        low: toNumber(item.lowPriceRaw) ?? price,
        volume: toNumber(item.accumulatedTradingVolumeRaw) ?? 0,
      }
    }
    return result
  })
}

// 환율·원자재는 일괄 조회 엔드포인트가 없어 종목별 상세 API를 병렬 호출한다.
// 환율은 하나은행 고시(장중 몇 분 간격), 원자재는 NYMEX/COMEX 선물의 10분 지연 시세다.
export function fetchIndexQuotes(items) {
  const key = `index:${items.map((item) => `${item.category}/${item.code}`).join(',')}`
  return cached(key, CACHE_TTL_MS, async () => {
    const entries = await Promise.all(items.map(async ({ category, code }) => {
      const response = await fetch(`${INDEX_BASE_URL}?category=${category}&reutersCode=${code}`, { headers: NAVER_HEADERS })
      if (!response.ok) throw new Error(`네이버 지수 조회 실패 (${response.status})`)
      const item = (await response.json()).result
      const price = toNumber(item?.closePrice)
      const change = toNumber(item?.fluctuations) ?? 0
      if (price === null) throw new Error(`${code} 시세 응답 오류`)
      return [code, {
        price,
        previousClose: price - change,
        asOf: item.localTradedAt ? new Date(item.localTradedAt).getTime() : Date.now(),
      }]
    }))
    return Object.fromEntries(entries)
  })
}

// ---------- Upbit 중계 ----------

const UPBIT_CANDLE_PATHS = new Set([
  'seconds', 'minutes/1', 'minutes/3', 'minutes/5', 'minutes/10',
  'minutes/15', 'minutes/30', 'minutes/60', 'minutes/240',
])

export function fetchUpbitTicker(markets) {
  return cached(`upbit:ticker:${markets.join(',')}`, CACHE_TTL_MS, async () => {
    const response = await fetch(`${UPBIT_BASE}/ticker?markets=${markets.join(',')}`)
    if (!response.ok) throw new Error(`Upbit 시세 조회 실패 (${response.status})`)
    return response.json()
  })
}

export function fetchUpbitCandles(path, market, count) {
  return cached(`upbit:candles:${path}:${market}:${count}`, 5_000, async () => {
    const response = await fetch(`${UPBIT_BASE}/candles/${path}?market=${market}&count=${count}`)
    if (!response.ok) throw new Error(`Upbit 캔들 조회 실패 (${response.status})`)
    return response.json()
  })
}

// ---------- 기간별 캔들 ----------
// 응답은 그룹과 무관하게 [{ t, price, high, low, volume }] 로 통일한다.
// volume은 거래대금(가격 × 거래량)으로 환산해 내려준다. 없는 원천은 0.

// KST("YYYYMMDDHHmmss" 또는 "YYYYMMDD") → epoch ms
function kstToMs(stamp) {
  const s = stamp.padEnd(14, '0')
  return Date.parse(
    `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}+09:00`,
  )
}

// 국내주식: fchart XML. 분봉은 종가·누적거래량만 오므로 증분으로 분당 거래량을 만든다.
async function fetchKrCandles(symbol, timeframe, count) {
  const params = new URLSearchParams({ symbol, timeframe, count: String(count), requestType: '0' })
  const response = await fetch(`https://fchart.stock.naver.com/sise.nhn?${params}`, { headers: NAVER_HEADERS })
  if (!response.ok) throw new Error(`네이버 차트 조회 실패 (${response.status})`)
  const xml = await response.text()

  const rows = [...xml.matchAll(/data="([^"]+)"/g)].map((match) => match[1].split('|'))
  let prevCumulative = null
  const candles = rows.map(([stamp, , high, low, close, volume]) => {
    const price = toNumber(close) ?? 0
    let shares = toNumber(volume) ?? 0
    if (timeframe === 'minute') {
      // 누적거래량은 날마다 리셋되므로 감소하면 그 시점 값을 그대로 쓴다
      shares = prevCumulative !== null && shares >= prevCumulative ? shares - prevCumulative : shares
      prevCumulative = toNumber(volume) ?? 0
    }
    return {
      t: kstToMs(stamp),
      price,
      high: toNumber(high) ?? price,
      low: toNumber(low) ?? price,
      volume: shares * price,
    }
  })
  return candles.slice(-count)
}

// 미국주식: 일봉만 제공. 거래일 수를 달력 날짜 여유분으로 환산해 요청한다.
async function fetchUsCandles(symbol, count) {
  const fmt = (date) => date.toISOString().slice(0, 10).replaceAll('-', '')
  const end = new Date()
  end.setDate(end.getDate() + 1)
  const start = new Date()
  start.setDate(start.getDate() - Math.ceil(count * 1.6) - 5)
  const url = `https://api.stock.naver.com/chart/foreign/item/${symbol}/day?startDateTime=${fmt(start)}0000&endDateTime=${fmt(end)}0000`
  const response = await fetch(url, { headers: NAVER_HEADERS })
  if (!response.ok) throw new Error(`네이버 해외 차트 조회 실패 (${response.status})`)
  const data = await response.json()
  return data.map((item) => ({
    t: kstToMs(item.localDate),
    price: item.closePrice,
    high: item.highPrice ?? item.closePrice,
    low: item.lowPrice ?? item.closePrice,
    volume: (item.accumulatedTradingVolume ?? 0) * item.closePrice,
  })).slice(-count)
}

// 환율·원자재: pricesByPeriod. day는 당일 틱(환율만), area*는 일간 시리즈.
async function fetchIndexCandles(category, chartInfoType, code, scriptChartType) {
  const params = new URLSearchParams({ reutersCode: code, category, chartInfoType, scriptChartType })
  const response = await fetch(`https://m.stock.naver.com/front-api/chart/pricesByPeriod?${params}`, { headers: NAVER_HEADERS })
  if (!response.ok) throw new Error(`네이버 기간 차트 조회 실패 (${response.status})`)
  const result = (await response.json()).result
  return (result?.priceInfos ?? []).map((item) => {
    const price = toNumber(item.currentPrice ?? item.closePrice) ?? 0
    return {
      t: kstToMs(item.localDateTime ?? item.localDate),
      price,
      high: toNumber(item.highPrice) ?? price,
      low: toNumber(item.lowPrice) ?? price,
      volume: (toNumber(item.accumulatedTradingVolume) ?? 0) * price,
    }
  })
}

const INDEX_CHART_TYPES = new Set(['day', 'areaMonth', 'areaMonthThree', 'areaYear'])

export function fetchCandles(query) {
  const cacheKey = `candles:${query.toString()}`
  return cached(cacheKey, CANDLE_CACHE_TTL_MS, () => {
    const type = query.get('type')
    if (type === 'kr') {
      const symbol = query.get('symbol')
      const timeframe = query.get('timeframe')
      const count = Number(query.get('count'))
      if (!/^\d{6}$/.test(symbol ?? '') || !['minute', 'day'].includes(timeframe) || !(count > 0 && count <= 500)) {
        throw new BadRequestError('kr 캔들은 symbol(6자리)·timeframe(minute|day)·count(1~500)가 필요합니다.')
      }
      return fetchKrCandles(symbol, timeframe, count)
    }
    if (type === 'us') {
      const symbol = query.get('symbol')
      const count = Number(query.get('count'))
      if (!/^[A-Z]{1,5}(\.[A-Z])?$/.test(symbol ?? '') || !(count > 0 && count <= 400)) {
        throw new BadRequestError('us 캔들은 symbol(예: AAPL.O)·count(1~400)가 필요합니다.')
      }
      return fetchUsCandles(symbol, count)
    }
    if (type === 'fx' || type === 'commodity') {
      const code = query.get('code')
      const chartType = query.get('chartType')
      const isFx = type === 'fx'
      const valid = isFx ? /^FX_[A-Z]{6}$/.test(code ?? '') : Boolean(COMMODITY_CATEGORIES[code])
      if (!valid || !INDEX_CHART_TYPES.has(chartType)) {
        throw new BadRequestError('code와 chartType(day|areaMonth|areaMonthThree|areaYear)을 확인하세요.')
      }
      return fetchIndexCandles(
        isFx ? 'exchange' : COMMODITY_CATEGORIES[code],
        isFx ? 'exchange' : 'futures',
        code,
        chartType,
      )
    }
    throw new BadRequestError('type은 kr|us|fx|commodity 중 하나여야 합니다.')
  })
}

// HTTP 라우팅도 공용으로 둔다. pathname·searchParams를 받아 { status, body }를 돌려준다.
export async function handleRoute(pathname, searchParams) {
  try {
    if (pathname === '/health') return { status: 200, body: { ready: true } }

    if (pathname === '/quote') {
      const symbols = (searchParams.get('symbols') ?? '').split(',').filter(Boolean)
      if (!symbols.length || !symbols.every((symbol) => /^\d{6}$/.test(symbol))) {
        return { status: 400, body: { error: '6자리 종목코드가 필요합니다.' } }
      }
      return { status: 200, body: await fetchQuotes(symbols) }
    }

    if (pathname === '/fx') {
      const codes = (searchParams.get('codes') ?? '').split(',').filter(Boolean)
      if (!codes.length || !codes.every((code) => /^FX_[A-Z]{6}$/.test(code))) {
        return { status: 400, body: { error: 'FX_USDKRW 형식의 환율 코드가 필요합니다.' } }
      }
      return { status: 200, body: await fetchIndexQuotes(codes.map((code) => ({ category: 'exchange', code }))) }
    }

    if (pathname === '/commodity') {
      const codes = (searchParams.get('codes') ?? '').split(',').filter(Boolean)
      if (!codes.length || !codes.every((code) => COMMODITY_CATEGORIES[code])) {
        return { status: 400, body: { error: `지원 원자재 코드: ${Object.keys(COMMODITY_CATEGORIES).join(', ')}` } }
      }
      return { status: 200, body: await fetchIndexQuotes(codes.map((code) => ({ category: COMMODITY_CATEGORIES[code], code }))) }
    }

    if (pathname === '/candles') {
      return { status: 200, body: await fetchCandles(searchParams) }
    }

    if (pathname === '/upbit/ticker') {
      const markets = (searchParams.get('markets') ?? '').split(',').filter(Boolean)
      if (!markets.length || !markets.every((market) => /^[A-Z]{3,4}-[A-Z0-9]{2,10}$/.test(market))) {
        return { status: 400, body: { error: 'KRW-BTC 형식의 마켓 코드가 필요합니다.' } }
      }
      return { status: 200, body: await fetchUpbitTicker(markets) }
    }

    if (pathname === '/upbit/candles') {
      const path = searchParams.get('path')
      const market = searchParams.get('market')
      const count = Number(searchParams.get('count'))
      if (!UPBIT_CANDLE_PATHS.has(path) || !/^[A-Z]{3,4}-[A-Z0-9]{2,10}$/.test(market ?? '') || !(count > 0 && count <= 200)) {
        return { status: 400, body: { error: 'path·market·count(1~200)를 확인하세요.' } }
      }
      return { status: 200, body: await fetchUpbitCandles(path, market, count) }
    }

    return { status: 404, body: { error: 'Not found' } }
  } catch (error) {
    return { status: error instanceof BadRequestError ? 400 : 502, body: { error: error.message } }
  }
}
