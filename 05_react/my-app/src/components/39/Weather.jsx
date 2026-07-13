import { useState, useEffect } from 'react'

// 온도 구간별 게이지 색상 (추움 → 더움)
const getGaugeColor = (t) => {
  if (t == null) return '#94a3b8'
  if (t < 5) return '#38bdf8'
  if (t < 15) return '#34d399'
  if (t < 25) return '#fbbf24'
  return '#f87171'
}

const Weather = () => {
  const [temp, setTemp] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5&longitude=127&current_weather=true')
        const data = await res.json()
        setTemp(data.current_weather.temperature)
        setIsLoading(false)
      } catch (error) {
        console.error('기온 로딩 실패:', error)
        setIsLoading(false)
      }
    }
    fetchWeather()
  }, [])

  // -10~40도를 0~100% 게이지 비율로 환산
  const percent = temp == null ? 0 : Math.min(100, Math.max(0, ((temp + 10) / 50) * 100))
  const color = getGaugeColor(temp)

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-3 py-6">
      <div
        className="flex h-36 w-36 items-center justify-center rounded-full p-3 transition-all duration-700"
        style={{ background: `conic-gradient(${color} ${percent}%, #e2e8f0 ${percent}% 100%)` }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-full shadow-inner bg-white">
          <span className="text-2xl">🌡️</span>
          {isLoading ? (
            <span className="animate-pulse text-sm font-medium text-slate-400">불러오는 중…</span>
          ) : (
            <span className="text-2xl font-bold text-slate-800">{temp ? temp + '°C' : '불러올 수 없음'}</span>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-slate-500">서울 기온</span>
    </div>
  )
}
export default Weather