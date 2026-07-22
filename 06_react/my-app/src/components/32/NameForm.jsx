import { useState } from 'react'

const NameForm = () => {
  const [name, setName] = useState('')   // 입력값 보관(처음 빈 문자열)
  // input: value={name}=칸에 보일 값(state) / onChange=칠 때마다 state 갱신
  return (
    <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <div className="mt-6 text-lg font-semibold text-slate-800">
          안녕, <span className="text-blue-600">{name || '누군가'}</span>!
        </div>   {/* 입력 즉시 화면 반영 */}
      </div>
    </div>
  )
}
export default NameForm