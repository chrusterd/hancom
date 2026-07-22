import { useState, useEffect } from 'react'

const Every = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('렌더링 될 때마다 실행')   // 화면 그릴 때마다 매번
  })                                    // ← 두번째 칸 없음 = 매 렌더마다 실행

  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3">
      <button
        onClick={() => setCount(c => c + 1)}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
      >
        {count}
      </button>
      <span className="text-sm text-gray-500">클릭해서 카운트 증가</span>
    </div>
  )
}
export default Every