import { useEffect, useState } from 'react'
import { fetchCandles } from '../api/upbit'
import { fetchGroupCandles } from '../api/marketData'

// 캔들 간격이 짧을수록 더 자주 갱신한다 (초봉 10초, 분봉 이상 60초)
function refreshMs(range) {
  return Math.min(60_000, Math.max(10_000, range.stepMs * 5))
}

// 선택된 자산·기간의 캔들을 불러온다. 코인은 Upbit, 나머지는 네이버 프록시.
// 갱신 중에는 이전 데이터를 유지해 차트가 사라지지 않게 한다(투명도만 낮춤).
// loading은 별도 상태가 아니라 "지금 보고 있는 키 ≠ 데이터의 키"로 파생시킨다.
export default function useCandles(asset, range, isCrypto) {
  const key = `${asset.id}:${range.id}`
  const [state, setState] = useState({ candles: null, isLive: true, key: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const candles = isCrypto
          ? await fetchCandles(asset.code, range)
          : await fetchGroupCandles(asset, range)
        if (!cancelled) setState({ candles, isLive: true, key })
      } catch {
        // 가짜 캔들은 만들지 않는다 — null이면 화면이 세션 히스토리로 대체한다
        if (!cancelled) setState({ candles: null, isLive: false, key })
      }
    }

    load()
    const id = setInterval(load, refreshMs(range))
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [asset, range, key, isCrypto])

  return { candles: state.candles, isLive: state.isLive, loading: state.key !== key }
}
