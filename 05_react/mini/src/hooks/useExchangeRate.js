import { useEffect, useState } from 'react'

const FALLBACK_RATE = 1_390 // 환율 API를 못 붙였을 때 쓰는 대략값 (김치프리미엄 계산용)

// USD→KRW 환율. 환율은 밀리초 단위로 바뀌지 않으므로 폴링 주기를 길게 둔다.
export default function useExchangeRate() {
  const [rate, setRate] = useState(FALLBACK_RATE)

  useEffect(() => {
    let cancelled = false

    async function fetchRate() {
      try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=KRW')
        if (!res.ok) throw new Error(`rate ${res.status}`)
        const data = await res.json()
        if (!cancelled && data.rates?.KRW) setRate(data.rates.KRW)
      } catch (error) {
        console.error('환율 로딩 실패, 대략값으로 대체:', error)
      }
    }

    fetchRate()
    const id = setInterval(fetchRate, 10 * 60 * 1000) // 10분마다 갱신
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return rate
}
