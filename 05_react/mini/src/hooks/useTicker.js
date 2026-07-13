import { useEffect, useReducer } from 'react'
import { fetchTicker } from '../api/upbit'

// 폴링 결과를 누적하는 리듀서: 최신 시세 + 코인별 가격 히스토리(스파크라인용)
const HISTORY_MAX = 120

const initial = { tickers: {}, history: {}, isLive: null, updatedAt: null }

function tickerReducer(state, action) {
  switch (action.type) {
    case 'tick': {
      const tickers = {}
      const history = { ...state.history }
      for (const t of action.data) {
        tickers[t.market] = t
        const prev = history[t.market] ?? []
        history[t.market] = [...prev.slice(-(HISTORY_MAX - 1)), { t: action.at, p: t.trade_price }]
      }
      return { tickers, history, isLive: action.live, updatedAt: action.at }
    }
    default:
      return state
  }
}

// markets 배열의 시세를 intervalMs마다 폴링한다.
// API 실패 시 마지막 정상값을 유지하고(가짜 시세는 만들지 않는다), 탭이 숨겨지면 폴링을 건너뛴다.
export default function useTicker(markets, intervalMs) {
  const [state, dispatch] = useReducer(tickerReducer, initial)
  const key = markets.join(',')

  useEffect(() => {
    let cancelled = false
    let inFlight = false // 응답이 늦을 때 요청이 겹겹이 쌓이는 것 방지
    const codes = key.split(',')

    async function tick() {
      if (document.hidden || inFlight) return // 백그라운드 탭·진행 중 요청은 건너뜀
      inFlight = true
      try {
        const data = await fetchTicker(codes)
        if (!cancelled) dispatch({ type: 'tick', data, live: true, at: Date.now() })
      } catch {
        // 실패해도 상태를 바꾸지 않는다 — 화면은 마지막 정상값을 유지한다
      } finally {
        inFlight = false
      }
    }

    tick()
    const id = setInterval(tick, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [key, intervalMs])

  return state
}
