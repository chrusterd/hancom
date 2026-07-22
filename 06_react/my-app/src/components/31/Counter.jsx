import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
        <button
          onClick={() => setCount(c => c - 1)}
          className="h-10 w-10 cursor-pointer rounded-lg bg-slate-100 text-lg font-semibold text-slate-700 transition hover:bg-slate-200 active:bg-slate-300"
        >
          −1
        </button>
        <span className="min-w-[2ch] text-center text-2xl font-bold text-slate-800">{count}</span>
        <button
          onClick={() => setCount(c => c + 1)}
          className="h-10 w-10 cursor-pointer rounded-lg bg-blue-600 text-lg font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          +1
        </button>
        <button
          onClick={() => setCount(0)}
          className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          리셋
        </button>   {/* 초기값 0으로 */}
      </div>
    </div>
  )
}
export default Counter