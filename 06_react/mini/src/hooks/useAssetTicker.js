import { useEffect, useReducer } from 'react'
import { fetchAssetQuotes } from '../api/marketData'

const HISTORY_MAX = 120
const initial = { tickers: {}, history: {}, updatedAt: null }

function reducer(state, action) {
  if (action.type !== 'tick') return state
  // 로딩 실패 시 빈 배열이 오면 상태를 바꾸지 않는다 — 마지막 정상값 유지
  if (!action.data.length) return state
  const tickers = { ...state.tickers }
  const history = { ...state.history }
  action.data.forEach((ticker) => {
    tickers[ticker.market] = ticker
    const previous = history[ticker.market] ?? []
    history[ticker.market] = [...previous.slice(-(HISTORY_MAX - 1)), { t: action.at, p: ticker.trade_price }]
  })
  return { tickers, history, updatedAt: action.at }
}

export default function useAssetTicker(group, intervalMs) {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    let cancelled = false
    let inFlight = false

    async function tick() {
      if (document.hidden || inFlight) return
      inFlight = true
      const data = await fetchAssetQuotes(group)
      if (!cancelled) dispatch({ type: 'tick', data, at: Date.now() })
      inFlight = false
    }

    tick()
    // 원천 데이터의 갱신 속도가 정해진 그룹은 사용자 설정과 무관하게 고정 주기로 폴링한다.
    // (Header의 FIXED_INTERVAL_LABELS 표시와 일치해야 한다)
    // - kr-stock: 네이버 시세 API 자체가 7초 주기
    // - fx: 하나은행 고시가 장중 몇 분 간격으로 갱신 → 15초면 새 고시를 놓치지 않는다
    // - commodity: 네이버 선물 시세(10분 지연 스트림) → 15초 폴링이면 충분
    const fixedMs = { 'kr-stock': 7_000, fx: 15_000, commodity: 15_000 }[group.id]
    // 선택 가능한 그룹(코인·미국주식)도 하한은 7초 — 과거 저장값(1~5초)을 걸러낸다
    const id = setInterval(tick, fixedMs ?? Math.max(intervalMs, 7_000))
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [group, intervalMs])

  return state
}
