import { useEffect } from 'react'

const Hello = () => {
  useEffect(() => {
    console.log('화면 뜰 때 딱 1번만 실행되는 의존성 배열')   // 여기에 시작 작업
  }, [])                            // [] = 처음 한 번만

  return (
    <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="rounded-2xl bg-white px-8 py-6 text-2xl font-bold text-slate-800 shadow-lg ring-1 ring-black/5">
        안녕하세요
      </div>
    </div>
  )
}
export default Hello