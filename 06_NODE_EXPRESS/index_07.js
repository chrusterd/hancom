const express = require('express')
const app = express()
app.use(express.json())   // 보낼 새 이름을 req.body로 받으려면 必

let users = [{ id: 1, name: '지니' }, { id: 2, name: '철수' }]

// 수정 — PUT /api/users/1 (그 id 항목의 이름 교체)
app.put('/api/users/:id', (req, res) => {
  const u = users.find(u => u.id === Number(req.params.id))   // :id로 항목 찾기
  if (!u) return res.status(404).json({ error: '없는 유저' })  // 없으면 404
  u.name = req.body.name      // 보낸 새 이름으로 교체
  res.json(u)                 // 수정된 항목 응답
})

app.listen(3000, async () => {
  // 서버 켜지면 코드가 스스로 PUT 요청 → 응답 출력 (curl 없이 확인)
  const res = await fetch('http://localhost:3000/api/users/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '민수' })
  })
  console.log(await res.json())   // → { id: 1, name: '민수' }  바뀐 결과 확인
})