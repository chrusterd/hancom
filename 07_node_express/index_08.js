const express = require('express')
const app = express()

let users = [{ id: 1, name: '지니' }, { id: 2, name: '철수' }]

// 삭제 — DELETE /api/users/2 (그 id만 빼기 · body 없어서 express.json() 불필요)
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== Number(req.params.id))   // 그 id만 빼고 새 배열로
  res.json({ ok: true, 남은: users })   // 남은 목록까지 응답 → 삭제 눈으로 확인
})

app.listen(3000, async () => {
  // 서버 켜지면 코드가 스스로 DELETE 요청 → 응답 출력 (curl 없이 확인)
  const res = await fetch('http://localhost:3000/api/users/1', { method: 'DELETE' })
  console.log(await res.json())   // → { ok: true, 남은: [{ id: 1, name: '지니' }] }
})