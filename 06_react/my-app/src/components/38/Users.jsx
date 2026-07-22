import { useState, useEffect } from 'react'

const Users = () => {
  // users: 받아온 목록 (초기값 빈 배열 — 도착 전엔 비어있음)
  const [users, setUsers] = useState([])

  useEffect(() => {
    // fetch(주소) 요청 → .then 응답을 JSON 변환 → .then 데이터를 state 저장 → .catch 에러 처리
    fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json()).then((data) => setUsers(data)).catch((error) => console.error('데이터 로딩 실패:', error))
  }, [])   // [] = 첫 렌더 1번만 요청

  return (
    <ul className="mx-auto flex max-w-md flex-col gap-2 p-4">
      {/* map: 배열 돌며 항목마다 li 생성 / key: 고유값(필수) */}
      {users.map((u) => (
        <li
          key={u.id}
          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
            {u.name.charAt(0)}
          </span>
          <span className="font-medium text-slate-800">{u.name}</span><span className="text-sm text-slate-500">{u.company.name}</span>
        </li>
      ))}
    </ul>
  )
}
export default Users