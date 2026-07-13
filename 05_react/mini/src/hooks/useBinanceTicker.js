import { useEffect, useRef, useState } from 'react'
import { CODE_BY_SYMBOL, STREAM_URL } from '../api/binance'

// 바이낸스 체결 스트림을 구독해서 해외(USDT) 시세를 실시간으로 받아온다.
// 연결에 실패하면 시세를 비워둔다 — 가짜 값을 만들면 김프 계산이 오해를 준다.
export default function useBinanceTicker() {
  const [prices, setPrices] = useState({}) // { 'KRW-BTC': 108020.5, ... }
  const [isLive, setIsLive] = useState(false)
  const latest = useRef({})

  useEffect(() => {
    let ws
    let stopped = false
    let reconnectId
    let failCount = 0

    const connect = () => {
      ws = new WebSocket(STREAM_URL)

      ws.onopen = () => {
        failCount = 0
        setIsLive(true)
      }

      ws.onmessage = (event) => {
        const { data } = JSON.parse(event.data)
        const code = CODE_BY_SYMBOL[data.s]
        if (code) latest.current[code] = Number(data.p)
      }

      ws.onclose = () => {
        setIsLive(false)
        failCount += 1
        if (stopped) return
        // 끊기면 재연결 시도. 연속 실패 시 점점 간격을 늘린다 (최대 30초)
        reconnectId = setTimeout(connect, Math.min(2000 * failCount, 30_000))
      }

      ws.onerror = () => ws.close()
    }

    connect()

    // 체결이 초당 여러 번 올 수 있어 매번 반영하면 리렌더가 과도해진다 — 300ms마다 한 번만 반영
    const flushId = setInterval(() => {
      if (Object.keys(latest.current).length) setPrices((prev) => ({ ...prev, ...latest.current }))
    }, 300)

    return () => {
      stopped = true
      clearInterval(flushId)
      clearTimeout(reconnectId)
      ws?.close()
    }
  }, [])

  return { prices, isLive }
}
