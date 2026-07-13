import { MARKETS, RANGES } from './upbit'

export { RANGES }

// 그룹별 조회 기간. 원천 데이터가 지원하는 단위가 달라 그룹마다 목록이 다르다.
// candle: 프록시 /candles 호출 파라미터. stepMs: 캔들 간격(갱신 주기 계산용).
const KR_RANGES = [
  { id: '1h', label: '1시간', stepMs: 60_000, candle: { type: 'kr', timeframe: 'minute', count: 60 } },
  { id: '3h', label: '3시간', stepMs: 60_000, candle: { type: 'kr', timeframe: 'minute', count: 180 } },
  { id: '1d', label: '1일(장중)', stepMs: 60_000, candle: { type: 'kr', timeframe: 'minute', count: 391 } },
  { id: '1w', label: '1주', stepMs: 86_400_000, long: true, candle: { type: 'kr', timeframe: 'day', count: 5 } },
  { id: '1mo', label: '1개월', stepMs: 86_400_000, long: true, candle: { type: 'kr', timeframe: 'day', count: 22 } },
  { id: '3mo', label: '3개월', stepMs: 86_400_000, long: true, candle: { type: 'kr', timeframe: 'day', count: 66 } },
]

const US_RANGES = [
  { id: '1w', label: '1주', stepMs: 86_400_000, long: true, candle: { type: 'us', count: 5 } },
  { id: '1mo', label: '1개월', stepMs: 86_400_000, long: true, candle: { type: 'us', count: 22 } },
  { id: '3mo', label: '3개월', stepMs: 86_400_000, long: true, candle: { type: 'us', count: 66 } },
  { id: '6mo', label: '6개월', stepMs: 86_400_000, long: true, candle: { type: 'us', count: 132 } },
  { id: '1y', label: '1년', stepMs: 86_400_000, long: true, candle: { type: 'us', count: 248 } },
]

const FX_RANGES = [
  { id: '1d', label: '당일', stepMs: 60_000, candle: { type: 'fx', chartType: 'day' } },
  { id: '1mo', label: '1개월', stepMs: 86_400_000, long: true, candle: { type: 'fx', chartType: 'areaMonth' } },
  { id: '3mo', label: '3개월', stepMs: 86_400_000, long: true, candle: { type: 'fx', chartType: 'areaMonthThree' } },
  { id: '1y', label: '1년', stepMs: 86_400_000, long: true, candle: { type: 'fx', chartType: 'areaYear' } },
]

// 원자재 당일 틱은 거래소 현지 시각으로 내려와 시각 표기가 어긋나므로 일간 시리즈만 제공한다.
const COMMODITY_RANGES = [
  { id: '1mo', label: '1개월', stepMs: 86_400_000, long: true, candle: { type: 'commodity', chartType: 'areaMonth' } },
  { id: '3mo', label: '3개월', stepMs: 86_400_000, long: true, candle: { type: 'commodity', chartType: 'areaMonthThree' } },
  { id: '1y', label: '1년', stepMs: 86_400_000, long: true, candle: { type: 'commodity', chartType: 'areaYear' } },
]

export const ASSET_GROUPS = [
  {
    id: 'crypto',
    label: '코인',
    ranges: RANGES,
    assets: MARKETS.map((market) => ({
      ...market,
      id: market.code,
      group: 'crypto',
      provider: 'Upbit',
      currency: 'KRW',
      unit: '원',
    })),
  },
  {
    id: 'us-stock',
    label: '미국주식',
    ranges: US_RANGES,
    assets: [
      // naverCode: 네이버 해외 차트용 로이터 코드 (나스닥 .O, NYSE Arca ETF는 심볼 그대로)
      { id: 'US-AAPL', code: 'AAPL', name: '애플', symbol: 'AAPL', naverCode: 'AAPL.O', provider: 'Finnhub', currency: 'USD', unit: '달러' },
      { id: 'US-MSFT', code: 'MSFT', name: '마이크로소프트', symbol: 'MSFT', naverCode: 'MSFT.O', provider: 'Finnhub', currency: 'USD', unit: '달러' },
      { id: 'US-NVDA', code: 'NVDA', name: '엔비디아', symbol: 'NVDA', naverCode: 'NVDA.O', provider: 'Finnhub', currency: 'USD', unit: '달러' },
      { id: 'US-SPY', code: 'SPY', name: 'S&P 500 ETF', symbol: 'SPY', naverCode: 'SPY', provider: 'Finnhub', currency: 'USD', unit: '달러' },
    ].map((asset) => ({ ...asset, group: 'us-stock' })),
  },
  {
    id: 'kr-stock',
    label: '국내주식',
    ranges: KR_RANGES,
    assets: [
      { id: 'KR-005930', code: '005930', name: '삼성전자', symbol: '삼성', currency: 'KRW', unit: '원' },
      { id: 'KR-000660', code: '000660', name: 'SK하이닉스', symbol: 'SK', currency: 'KRW', unit: '원' },
      { id: 'KR-035420', code: '035420', name: 'NAVER', symbol: 'N', currency: 'KRW', unit: '원' },
      { id: 'KR-069500', code: '069500', name: 'KODEX 200', symbol: 'K200', currency: 'KRW', unit: '원' },
    ].map((asset) => ({ ...asset, group: 'kr-stock', provider: '네이버' })),
  },
  {
    id: 'fx',
    label: '환율',
    ranges: FX_RANGES,
    assets: [
      { id: 'FX-USDKRW', code: 'USD/KRW', name: '미국 달러', symbol: 'USD', base: 'USD', currency: 'KRW', unit: '원' },
      { id: 'FX-EURKRW', code: 'EUR/KRW', name: '유로', symbol: 'EUR', base: 'EUR', currency: 'KRW', unit: '원' },
      { id: 'FX-JPYKRW', code: 'JPY/KRW', name: '일본 엔', symbol: 'JPY', base: 'JPY', currency: 'KRW', unit: '원' },
    ].map((asset) => ({ ...asset, group: 'fx', provider: '네이버' })),
  },
  {
    id: 'commodity',
    label: '원자재',
    ranges: COMMODITY_RANGES,
    assets: [
      // naverCode: 네이버 선물 시세용, series: FRED 일간 데이터 대체용
      { id: 'CMD-GOLD', code: 'GOLD', name: '금', symbol: 'Au', naverCode: 'GCcv1', series: 'GOLDAMGBD228NLBM', unit: '달러/oz' },
      { id: 'CMD-WTI', code: 'WTI', name: 'WTI 원유', symbol: 'WTI', naverCode: 'CLcv1', series: 'DCOILWTICO', unit: '달러/bbl' },
      { id: 'CMD-GAS', code: 'NATGAS', name: '천연가스', symbol: 'GAS', naverCode: 'NGcv1', series: 'DHHNGSP', unit: '달러/MMBtu' },
    ].map((asset) => ({ ...asset, group: 'commodity', provider: '네이버', currency: 'USD' })),
  },
]

export const ALL_ASSETS = ASSET_GROUPS.flatMap((group) => group.assets)

export function getGroup(groupId) {
  return ASSET_GROUPS.find((group) => group.id === groupId) ?? ASSET_GROUPS[0]
}

export function getAsset(assetId) {
  return ALL_ASSETS.find((asset) => asset.id === assetId) ?? ALL_ASSETS[0]
}
