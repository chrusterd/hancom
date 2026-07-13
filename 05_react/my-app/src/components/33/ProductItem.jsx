import { useState } from 'react'

// name = props(부모가 줌), count = state(자기가 기억)
const ProductItem = ({ name }) => {
  const [count, setCount] = useState(0)   // 담은 개수 기억(처음 0)
  return (
    <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800">{name}</h3>                        {/* props 표시 */}
          <p className="mt-1 text-sm text-slate-500">{count}개 담음</p>                    {/* state 표시 */}
        </div>
        <button
          onClick={() => setCount(c => c + 1)}
          className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          🛒 담기
        </button>   {/* 러닝화 카드 밖 (함수형) */}
      </div>
    </div>
  )
}
export default ProductItem