import { fetchTicker } from './upbit'

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY
const FRED_KEY = import.meta.env.VITE_FRED_API_KEY
// 비워두면 같은 도메인(/quote 등)으로 호출한다 — Netlify Functions가 그 경로를 서빙한다.
// 로컬 개발에서는 .env.development.local이 http://127.0.0.1:8787 를 지정한다.
const KR_STOCK_PROXY = (import.meta.env.VITE_KR_STOCK_PROXY_URL ?? '').replace(/\/$/, '')

function normalize(asset, price, previous, extra = {}) {
  const change = previous ? price - previous : 0
  return {
    market: asset.id,
    trade_price: price,
    signed_change_price: change,
    signed_change_rate: previous ? change / previous : 0,
    high_price: extra.high ?? Math.max(price, previous || price),
    low_price: extra.low ?? Math.min(price, previous || price),
    acc_trade_price_24h: extra.volume ?? null,
    source: extra.source ?? asset.provider,
    mode: extra.mode ?? 'live',
    asOf: extra.asOf ?? Date.now(),
  }
}

async function upbitQuotes(assets) {
  const data = await fetchTicker(assets.map((asset) => asset.code))
  return data.map((quote) => ({ ...quote, market: quote.market, source: 'Upbit', mode: 'live', asOf: Date.now() }))
}

async function finnhubQuotes(assets) {
  if (!FINNHUB_KEY) throw new Error('VITE_FINNHUB_API_KEY가 설정되지 않았습니다.')
  return Promise.all(assets.map(async (asset) => {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${asset.code}&token=${FINNHUB_KEY}`)
    if (!res.ok) throw new Error(`Finnhub ${res.status}`)
    const data = await res.json()
    if (!data.c) throw new Error(`Finnhub ${asset.code} empty quote`)
    return normalize(asset, data.c, data.pc, {
      high: data.h,
      low: data.l,
      source: 'Finnhub',
      mode: 'live',
      asOf: data.t ? data.t * 1000 : Date.now(),
    })
  }))
}

async function krStockQuotes(assets) {
  const symbols = assets.map((asset) => asset.code).join(',')
  const res = await fetch(`${KR_STOCK_PROXY}/quote?symbols=${symbols}`)
  if (!res.ok) throw new Error(`국내주식 프록시 ${res.status}`)
  const data = await res.json()
  return assets.map((asset) => {
    const quote = data[asset.code]
    if (!quote) throw new Error(`${asset.code} 시세 없음`)
    return normalize(asset, Number(quote.price), Number(quote.previousClose), {
      high: Number(quote.high), low: Number(quote.low), volume: Number(quote.volume), source: '네이버', mode: 'live',
    })
  })
}

async function fxQuotes(assets) {
  try {
    const codes = assets.map((asset) => `FX_${asset.base}KRW`).join(',')
    const res = await fetch(`${KR_STOCK_PROXY}/fx?codes=${codes}`)
    if (!res.ok) throw new Error(`환율 프록시 ${res.status}`)
    const data = await res.json()
    return assets.map((asset) => {
      const quote = data[`FX_${asset.base}KRW`]
      if (!quote) throw new Error(`${asset.base} 환율 없음`)
      // 네이버(하나은행 고시)는 엔화를 100엔 기준으로 고시하므로 1엔 기준으로 맞춘다.
      const scale = asset.base === 'JPY' ? 100 : 1
      return normalize(asset, Number(quote.price) / scale, Number(quote.previousClose) / scale, {
        source: '네이버', mode: 'live', asOf: quote.asOf,
      })
    })
  } catch (error) {
    console.error('네이버 환율 실패, Frankfurter(일간)로 대체:', error)
    return frankfurterQuotes(assets)
  }
}

async function frankfurterQuotes(assets) {
  const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW,EUR,JPY')
  if (!res.ok) throw new Error(`Frankfurter ${res.status}`)
  const { rates, date } = await res.json()
  const values = { USD: rates.KRW, EUR: rates.KRW / rates.EUR, JPY: rates.KRW / rates.JPY }
  return assets.map((asset) => normalize(asset, values[asset.base], null, {
    source: 'Frankfurter', mode: 'delayed', asOf: new Date(`${date}T00:00:00Z`).getTime(),
  }))
}

async function commodityQuotes(assets) {
  try {
    const codes = assets.map((asset) => asset.naverCode).join(',')
    const res = await fetch(`${KR_STOCK_PROXY}/commodity?codes=${codes}`)
    if (!res.ok) throw new Error(`원자재 프록시 ${res.status}`)
    const data = await res.json()
    return assets.map((asset) => {
      const quote = data[asset.naverCode]
      if (!quote) throw new Error(`${asset.code} 시세 없음`)
      return normalize(asset, Number(quote.price), Number(quote.previousClose), {
        source: '네이버 (10분 지연)', mode: 'live', asOf: quote.asOf,
      })
    })
  } catch (error) {
    console.error('네이버 원자재 실패, FRED(일간)로 대체:', error)
    return fredQuotes(assets)
  }
}

async function fredQuotes(assets) {
  if (!FRED_KEY) throw new Error('VITE_FRED_API_KEY가 설정되지 않았습니다.')
  return Promise.all(assets.map(async (asset) => {
    const params = new URLSearchParams({
      series_id: asset.series, api_key: FRED_KEY, file_type: 'json', sort_order: 'desc', limit: '10',
    })
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?${params}`)
    if (!res.ok) throw new Error(`FRED ${res.status}`)
    const data = await res.json()
    const valid = data.observations.filter((item) => item.value !== '.').slice(0, 2)
    if (!valid.length) throw new Error(`FRED ${asset.series} empty series`)
    return normalize(asset, Number(valid[0].value), Number(valid[1]?.value), {
      source: 'FRED', mode: 'delayed', asOf: new Date(`${valid[0].date}T00:00:00Z`).getTime(),
    })
  }))
}

// 코인 외 그룹의 기간별 캔들. 프록시가 없거나 실패하면 null을 반환해
// 호출 쪽에서 세션 히스토리로 대체하게 한다.
export async function fetchGroupCandles(asset, range) {
  if (!range.candle) return null
  const params = new URLSearchParams(range.candle)
  if (range.candle.type === 'kr') params.set('symbol', asset.code)
  if (range.candle.type === 'us') params.set('symbol', asset.naverCode)
  if (range.candle.type === 'fx') params.set('code', `FX_${asset.base}KRW`)
  if (range.candle.type === 'commodity') params.set('code', asset.naverCode)
  const res = await fetch(`${KR_STOCK_PROXY}/candles?${params}`)
  if (!res.ok) throw new Error(`캔들 프록시 ${res.status}`)
  const candles = await res.json()
  if (!candles.length) return null
  // 환율은 하나은행이 엔화를 100엔 기준으로 고시하므로 1엔 기준으로 맞춘다
  const scale = range.candle.type === 'fx' && asset.base === 'JPY' ? 100 : 1
  return candles.map((candle) => ({
    ...candle,
    price: candle.price / scale,
    high: candle.high / scale,
    low: candle.low / scale,
  }))
}

export async function fetchAssetQuotes(group) {
  try {
    if (group.id === 'crypto') return await upbitQuotes(group.assets)
    if (group.id === 'us-stock') return await finnhubQuotes(group.assets)
    if (group.id === 'kr-stock') return await krStockQuotes(group.assets)
    if (group.id === 'fx') return await fxQuotes(group.assets)
    if (group.id === 'commodity') return await commodityQuotes(group.assets)
  } catch (error) {
    // 데모(가짜) 시세는 오해를 줄 수 있어 만들지 않는다.
    // 빈 배열을 돌려주면 화면은 마지막 정상값을 유지하거나 '–'를 표시한다.
    console.error(`${group.label} 시세 로딩 실패:`, error)
  }
  return []
}
