import { useState, useEffect } from 'react'

const Clock = () => {
  // time: 현재 시각 문자열 / 초기값 = 첫 렌더 시각
  const [time, setTime] = useState(new Date().toUTCString())

  useEffect(() => {
    // setInterval — 브라우저 내장 함수 (직접 만든 것 아님)
    // 인자: (콜백함수, 간격ms) / 반환값: 타이머 ID(숫자)
    const timer = setInterval(() => {
      setTime(new Date().toUTCString())   // 시각 갱신 → 리렌더
    }, 1000)                                     // 1000 = 두번째 인자, 밀리초 간격(내가 지정) → 1초마다 반복
    // clearInterval — 브라우저 내장 함수, 인자: 멈출 타이머 ID
    return () => clearInterval(timer)   // 사라질 때 그 ID로 타이머 정리(cleanup)
  }, [])                                // [] = 처음 1번만 등록

  return (
    <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-r from-slate-50 to-blue-50 p-6">
      <div className="rounded-2xl bg-white px-8 py-6 shadow-lg ring-1 ring-black/5">
        <div className="flex items-center gap-3 font-mono tracking-wider text-slate-800">
          <span>⏰</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  )
}
export default Clock